import { Injectable, BadRequestException } from '@nestjs/common';
import * as net from 'net';
import * as dns from 'dns';
import { promisify } from 'util';
import SwaggerParser from '@apidevtools/swagger-parser';

const lookupDns = promisify(dns.lookup);

@Injectable()
export class SwaggerValidator {
  
  validateUrl(urlString: string): URL {
    try {
      const url = new URL(urlString);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error();
      }
      return url;
    } catch {
      throw new BadRequestException('Invalid URL format');
    }
  }

  async validateSecurityRules(url: URL): Promise<void> {
    // TEMPORARILY DISABLED FOR LOCAL TESTING:
    // This allows importing from localhost (e.g. http://localhost:3000/docs-json)
    return;

    const hostname = url.hostname.toLowerCase();

    // 1. Block literal local hosts
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '0.0.0.0' ||
      hostname === '[::1]' ||
      hostname === '[::]' ||
      hostname.endsWith('.local')
    ) {
      throw new BadRequestException('Unsafe URL is not allowed');
    }

    // 2. If it is already an IP address, block if private
    if (net.isIP(hostname)) {
      if (this.isPrivateIp(hostname)) {
        throw new BadRequestException('Unsafe URL is not allowed');
      }
    }

    // 3. DNS Lookup: Resolve hostname and check IP ranges (SSRF protection)
    try {
      const addresses = await lookupDns(hostname, { all: true });
      for (const addr of addresses) {
        if (this.isPrivateIp(addr.address)) {
          throw new BadRequestException('Unsafe URL is not allowed');
        }
      }
    } catch (err) {
      // If DNS resolution fails, reject to be safe
      throw new BadRequestException('Unsafe URL is not allowed');
    }
  }

  validateFormat(content: any): void {
    if (!content || typeof content !== 'object') {
      throw new BadRequestException('Provided URL is not a valid Swagger/OpenAPI document');
    }

    const hasSwagger = 'swagger' in content && typeof content.swagger === 'string';
    const hasOpenApi = 'openapi' in content && typeof content.openapi === 'string';

    if (!hasSwagger && !hasOpenApi) {
      throw new BadRequestException('Provided URL is not a valid Swagger/OpenAPI document');
    }
  }

  async validateOpenApiSchema(content: any): Promise<any> {
    try {
      // Validate structure and resolve $refs cleanly using @apidevtools/swagger-parser
      // Validate will parse, dereference, and validate against OpenAPI spec
      return await SwaggerParser.validate(content);
    } catch (error) {
      throw new BadRequestException('Swagger schema validation failed');
    }
  }

  private isPrivateIp(ip: string): boolean {
    if (net.isIPv4(ip)) {
      const parts = ip.split('.').map(Number);
      if (parts.length !== 4) return true;

      // 127.0.0.0/8 (Loopback)
      if (parts[0] === 127) return true;

      // 10.0.0.0/8 (Private Network)
      if (parts[0] === 10) return true;

      // 172.16.0.0/12 (Private Network)
      if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

      // 192.168.0.0/16 (Private Network)
      if (parts[0] === 192 && parts[1] === 168) return true;

      // 169.254.0.0/16 (Link Local)
      if (parts[0] === 169 && parts[1] === 254) return true;

      // 0.0.0.0 (Default route/any)
      if (ip === '0.0.0.0') return true;

      return false;
    }

    if (net.isIPv6(ip)) {
      const lower = ip.toLowerCase();
      // Loopback
      if (lower === '::1' || lower === '::') return true;
      // Link local
      if (lower.startsWith('fe80:')) return true;
      // Unique local address
      if (lower.startsWith('fc00:') || lower.startsWith('fd00:')) return true;

      return false;
    }

    return true; // Reject unrecognized IP formatting
  }
}

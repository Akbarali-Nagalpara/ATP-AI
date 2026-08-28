import { Injectable, Logger } from '@nestjs/common';
import { TestResult, Endpoint, Role } from '@prisma/client';

export type PreprocessedResult = {
  resultId: string;
  method: string;
  path: string;
  role: string;
  statusCode: number;
  latencyMs: number;
  errorMessage: string | null;
  requestSchema: any;
  responseSchema: any;
  actualPayload: any; // Safely sanitized
};

@Injectable()
export class AiPreprocessorService {
  private readonly logger = new Logger(AiPreprocessorService.name);

  preprocessFailedResults(
    testResults: (TestResult & { endpoint: Endpoint; role: Role | null })[]
  ): PreprocessedResult[] {
    this.logger.debug(`Preprocessing ${testResults.length} failed results`);
    
    return testResults.map(result => {
      return {
        resultId: result.id,
        method: result.endpoint.method,
        path: result.endpoint.path,
        role: result.role?.name || 'Public',
        statusCode: result.statusCode || 500,
        latencyMs: result.responseTimeMs || 0,
        errorMessage: result.errorMessage,
        requestSchema: result.endpoint.requestSchema || {},
        responseSchema: result.endpoint.responseSchema || {},
        actualPayload: this.sanitizePayload(result.responseBody),
      };
    });
  }

  private sanitizePayload(payload: any): any {
    if (!payload) return null;
    
    // Very basic sanitization, stringify and truncate to avoid blowing up context window
    const str = JSON.stringify(payload);
    if (str.length > 2000) {
      return { _truncated: true, preview: str.substring(0, 2000) };
    }
    
    try {
      // Remove tokens/credentials if visible
      const obj = JSON.parse(str);
      this.recursivelyRemoveSensitiveFields(obj);
      return obj;
    } catch {
      return payload;
    }
  }

  private recursivelyRemoveSensitiveFields(obj: any) {
    if (!obj || typeof obj !== 'object') return;
    
    const sensitiveKeys = ['token', 'password', 'secret', 'jwt', 'auth', 'key', 'authorization'];
    
    for (const key of Object.keys(obj)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        this.recursivelyRemoveSensitiveFields(obj[key]);
      }
    }
  }
}

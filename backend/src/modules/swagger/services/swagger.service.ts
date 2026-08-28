import { Injectable, BadRequestException } from '@nestjs/common';
import { OpenAPIParser, ParsedEndpoint } from '../parsers/openapi-parser';
import { SwaggerValidator } from '../validators/swagger.validator';
import axios from 'axios';

@Injectable()
export class SwaggerService {
  constructor(
    private readonly parser: OpenAPIParser,
    private readonly validator: SwaggerValidator,
  ) {}

  async parseFromUrl(urlString: string): Promise<ParsedEndpoint[]> {
    // Automatically convert NestJS Swagger UI URLs to their JSON endpoint equivalents
    if (urlString.endsWith('/docs')) {
      urlString += '-json';
    } else if (urlString.endsWith('/docs/')) {
      urlString = urlString.slice(0, -1) + '-json';
    }

    // 1. Validate URL format
    const url = this.validator.validateUrl(urlString);

    // 2. Security validation: Block internal/unsafe subnets (SSRF protection)
    await this.validator.validateSecurityRules(url);

    // 3. Fetch remote content using Axios
    let content: any;
    try {
      const response = await axios.get(urlString, {
        timeout: 10000, // 10 seconds timeout
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'User-Agent': 'ATP-AI-Swagger-Parser/1.0',
        },
      });
      content = response.data;
    } catch (error: any) {
      // Return a clean error if fetch fails
      throw new BadRequestException(`Failed to fetch schema from URL: ${error.message || error}`);
    }

    // Handle case where axios receives raw string instead of parsed object
    if (typeof content === 'string') {
      try {
        content = JSON.parse(content);
      } catch {
        throw new BadRequestException('Provided URL is not a valid Swagger/OpenAPI document');
      }
    }

    // 4. Verify Swagger/OpenAPI format (contains swagger or openapi fields)
    this.validator.validateFormat(content);

    // 5. Validate OpenAPI schema structure & resolve references
    const validatedSchema = await this.validator.validateOpenApiSchema(content);

    // 6. Parse and extract endpoints from the validated, dereferenced schema
    return await this.parser.parse(validatedSchema);
  }
}

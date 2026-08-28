import SwaggerParser from '@apidevtools/swagger-parser';
import { Injectable } from '@nestjs/common';
import { HttpMethod } from '@prisma/client';

export interface ParsedEndpoint {
  method: HttpMethod;
  path: string;
  summary: string;
  requestSchema: any;
  responseSchema: any;
  headersSchema: any;
  querySchema: any;
  pathParamsSchema: any;
  authRequired: boolean;
  tags: string[];
}

@Injectable()
export class OpenAPIParser {
  async parse(urlOrSchema: string | any): Promise<ParsedEndpoint[]> {
    // dereference resolves all $refs automatically!
    const api = await SwaggerParser.dereference(urlOrSchema);
    const parsedEndpoints: ParsedEndpoint[] = [];

    const rootSecurity = api.security || [];

    if (!api.paths) return [];

    for (const [pathKey, pathItem] of Object.entries(api.paths)) {
      if (!pathItem) continue;

      const pathParameters = (pathItem as any).parameters || [];

      for (const methodKey of ['get', 'post', 'put', 'delete', 'patch']) {
        const operation = (pathItem as any)[methodKey];
        if (!operation) continue;

        const summary = operation.summary || operation.description || '';
        const tags = operation.tags || [];

        // Auth requirements
        const operationSecurity = operation.security || rootSecurity;
        const authRequired = operationSecurity.length > 0;

        // Combine parameters from path level and operation level
        const allParameters = [...pathParameters, ...(operation.parameters || [])];

        // Extracted schemas
        const headersSchema: any = { type: 'object', properties: {} };
        const querySchema: any = { type: 'object', properties: {} };
        const pathParamsSchema: any = { type: 'object', properties: {} };
        let requestSchema: any = null;
        let responseSchema: any = null;

        // Process parameters
        for (const param of allParameters) {
          if (!param) continue;
          
          const name = param.name;
          const required = param.required || false;
          const schema = param.schema || { type: param.type || 'string' };

          if (param.in === 'header') {
            headersSchema.properties[name] = schema;
            if (required) {
              headersSchema.required = headersSchema.required || [];
              headersSchema.required.push(name);
            }
          } else if (param.in === 'query') {
            querySchema.properties[name] = schema;
            if (required) {
              querySchema.required = querySchema.required || [];
              querySchema.required.push(name);
            }
          } else if (param.in === 'path') {
            pathParamsSchema.properties[name] = schema;
            if (required) {
              pathParamsSchema.required = pathParamsSchema.required || [];
              pathParamsSchema.required.push(name);
            }
          } else if (param.in === 'body') {
            // Swagger 2.0 body param
            requestSchema = schema;
          }
        }

        // OpenAPI 3.x requestBody
        if (operation.requestBody && operation.requestBody.content) {
          const content = operation.requestBody.content;
          const jsonContent = content['application/json'] || content['multipart/form-data'] || content['application/x-www-form-urlencoded'];
          if (jsonContent) {
            requestSchema = jsonContent.schema;
          }
        }

        // Responses
        if (operation.responses) {
          // Look for successful responses
          const successCode = Object.keys(operation.responses).find(
            code => code.startsWith('2') || code === 'default'
          );
          if (successCode) {
            const successResponse = operation.responses[successCode];
            if (successResponse.content && successResponse.content['application/json']) {
              responseSchema = successResponse.content['application/json'].schema;
            } else if (successResponse.schema) {
              // Swagger 2.0 response schema
              responseSchema = successResponse.schema;
            }
          }
        }

        // Map HTTP method to Prisma HttpMethod enum
        let prismaMethod: HttpMethod;
        switch (methodKey) {
          case 'get':
            prismaMethod = HttpMethod.GET;
            break;
          case 'post':
            prismaMethod = HttpMethod.POST;
            break;
          case 'put':
            prismaMethod = HttpMethod.PUT;
            break;
          case 'delete':
            prismaMethod = HttpMethod.DELETE;
            break;
          case 'patch':
            prismaMethod = HttpMethod.PATCH;
            break;
          default:
            continue;
        }

        parsedEndpoints.push({
          method: prismaMethod,
          path: pathKey,
          summary,
          requestSchema: requestSchema || { type: 'object' },
          responseSchema: responseSchema || { type: 'object' },
          headersSchema: Object.keys(headersSchema.properties).length > 0 ? headersSchema : null,
          querySchema: Object.keys(querySchema.properties).length > 0 ? querySchema : null,
          pathParamsSchema: Object.keys(pathParamsSchema.properties).length > 0 ? pathParamsSchema : null,
          authRequired,
          tags,
        });
      }
    }

    return parsedEndpoints;
  }
}

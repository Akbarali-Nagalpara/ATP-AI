import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ParsedEndpoint } from '../../swagger/parsers/openapi-parser';

@Injectable()
export class EndpointsService {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(projectId: string, endpoints: ParsedEndpoint[]) {
    const createdList: any[] = [];

    for (const endpoint of endpoints) {
      const parsed = await this.prisma.endpoint.upsert({
        where: {
          projectId_method_path: {
            projectId,
            method: endpoint.method,
            path: endpoint.path,
          },
        },
        update: {
          summary: endpoint.summary,
          requestSchema: endpoint.requestSchema || undefined,
          responseSchema: endpoint.responseSchema || undefined,
          headersSchema: endpoint.headersSchema || undefined,
          querySchema: endpoint.querySchema || undefined,
          pathParamsSchema: endpoint.pathParamsSchema || undefined,
          authRequired: endpoint.authRequired,
          tags: endpoint.tags || undefined,
        },
        create: {
          projectId,
          method: endpoint.method,
          path: endpoint.path,
          summary: endpoint.summary,
          requestSchema: endpoint.requestSchema || undefined,
          responseSchema: endpoint.responseSchema || undefined,
          headersSchema: endpoint.headersSchema || undefined,
          querySchema: endpoint.querySchema || undefined,
          pathParamsSchema: endpoint.pathParamsSchema || undefined,
          authRequired: endpoint.authRequired,
          tags: endpoint.tags || undefined,
        },
      });
      createdList.push(parsed);
    }

    return createdList;
  }
}

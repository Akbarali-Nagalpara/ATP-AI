import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { SwaggerService } from '../../swagger/services/swagger.service';
import { EndpointsService } from '../../endpoints/services/endpoints.service';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly swaggerService: SwaggerService,
    private readonly endpointsService: EndpointsService,
  ) {}

  async getOrCreateDefaultUser() {
    let user = await this.prisma.user.findFirst();
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: 'ATP Admin',
          email: 'admin@atp-ai.com',
          passwordHash: '$2b$10$defaultpasswordhashfortestingpurposesonly',
        },
      });
    }
    return user;
  }

  async importSwagger(projectName: string, swaggerUrl: string) {
    try {
      new URL(swaggerUrl);
    } catch (e) {
      throw new BadRequestException('Invalid swaggerUrl format.');
    }

    const parsedEndpoints = await this.swaggerService.parseFromUrl(swaggerUrl);
    const user = await this.getOrCreateDefaultUser();

    const project = await this.prisma.project.create({
      data: {
        name: projectName,
        swaggerUrl: swaggerUrl,
        userId: user.id,
      },
    });

    const storedEndpoints = await this.endpointsService.createMany(project.id, parsedEndpoints);

    return {
      project,
      endpoints: storedEndpoints,
    };
  }
}

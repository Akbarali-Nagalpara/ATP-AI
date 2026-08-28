import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsService } from '../services/projects.service';
import { ImportSwaggerDto } from '../dto/import-swagger.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('import-swagger')
  @ApiOperation({ summary: 'Import a Swagger/OpenAPI schema and extract all endpoints' })
  @ApiResponse({ status: 201, description: 'Project successfully created and endpoints imported.' })
  async importSwagger(@Body() dto: ImportSwaggerDto) {
    return this.projectsService.importSwagger(dto.projectName, dto.swaggerUrl);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all projects' })
  async getAllProjects() {
    return this.prisma.project.findMany({
      include: {
        _count: {
          select: { endpoints: true },
        },
      },
    });
  }

  @Get(':id/endpoints')
  @ApiOperation({ summary: 'Retrieve all endpoints for a specific project' })
  async getProjectEndpoints(@Param('id') projectId: string) {
    return this.prisma.endpoint.findMany({
      where: { projectId },
      orderBy: [
        { path: 'asc' },
        { method: 'asc' },
      ],
    });
  }
}

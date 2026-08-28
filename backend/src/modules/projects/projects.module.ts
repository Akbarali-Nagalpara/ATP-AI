import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { SwaggerModule } from '../swagger/swagger.module';
import { EndpointsModule } from '../endpoints/endpoints.module';

@Module({
  imports: [SwaggerModule, EndpointsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}

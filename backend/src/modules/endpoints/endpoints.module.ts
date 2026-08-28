import { Module } from '@nestjs/common';
import { EndpointsController } from './controllers/endpoints.controller';
import { EndpointsService } from './services/endpoints.service';

@Module({
  controllers: [EndpointsController],
  providers: [EndpointsService],
  exports: [EndpointsService],
})
export class EndpointsModule {}

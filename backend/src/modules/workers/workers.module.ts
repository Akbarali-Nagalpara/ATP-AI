import { Module } from '@nestjs/common';
import { WorkersService } from './services/workers.service';
import { WorkersController } from './controllers/workers.controller';

@Module({
  controllers: [WorkersController],
  providers: [WorkersService],
  exports: [WorkersService],
})
export class WorkersModule {}

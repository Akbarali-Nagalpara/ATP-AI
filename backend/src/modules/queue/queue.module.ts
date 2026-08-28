import { Module } from '@nestjs/common';
import { QueueService } from './services/queue.service';
import { QueueController } from './controllers/queue.controller';

@Module({
  controllers: [QueueController],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}

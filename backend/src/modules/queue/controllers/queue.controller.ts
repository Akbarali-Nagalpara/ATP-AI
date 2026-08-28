import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { QueueService } from '../services/queue.service';

@ApiTags('Queue')
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}
}

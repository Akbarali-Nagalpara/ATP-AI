import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkersService } from '../services/workers.service';

@ApiTags('Workers')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}
}

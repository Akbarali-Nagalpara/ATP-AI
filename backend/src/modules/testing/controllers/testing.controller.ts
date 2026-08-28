import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TestingService } from '../services/testing.service';

@ApiTags('Testing')
@Controller('testing')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}
}

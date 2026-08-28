import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerService } from '../services/swagger.service';

@ApiTags('Swagger')
@Controller('swagger')
export class SwaggerController {
  constructor(private readonly swaggerService: SwaggerService) {}
}

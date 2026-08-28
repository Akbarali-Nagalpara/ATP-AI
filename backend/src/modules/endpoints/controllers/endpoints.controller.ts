import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EndpointsService } from '../services/endpoints.service';

@ApiTags('Endpoints')
@Controller('endpoints')
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) {}
}

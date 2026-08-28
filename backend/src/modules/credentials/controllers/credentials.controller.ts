import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CredentialsService } from '../services/credentials.service';

@ApiTags('Credentials')
@Controller('credentials')
export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) {}
}

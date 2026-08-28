import { Module } from '@nestjs/common';
import { CredentialsService } from './services/credentials.service';
import { CredentialsController } from './controllers/credentials.controller';

@Module({
  controllers: [CredentialsController],
  providers: [CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {}

import { Module } from '@nestjs/common';
import { SessionsService } from './services/sessions.service';
import { SessionsController } from './controllers/sessions.controller';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SessionsModule {}

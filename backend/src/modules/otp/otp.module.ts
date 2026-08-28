import { Module } from '@nestjs/common';
import { OtpService } from './services/otp.service';
import { OtpController } from './controllers/otp.controller';

@Module({
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}

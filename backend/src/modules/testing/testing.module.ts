import { Module } from '@nestjs/common';
import { TestingService } from './services/testing.service';
import { TestingController } from './controllers/testing.controller';

@Module({
  controllers: [TestingController],
  providers: [TestingService],
  exports: [TestingService],
})
export class TestingModule {}

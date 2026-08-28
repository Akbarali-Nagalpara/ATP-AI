import { Module } from '@nestjs/common';
import { AiService } from './services/ai.service';
import { AiController } from './controllers/ai.controller';
import { OllamaProvider } from './providers/ollama.provider';
import { AiPreprocessorService } from './services/ai-preprocessor.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [AiService, OllamaProvider, AiPreprocessorService],
  exports: [AiService],
})
export class AiModule {}

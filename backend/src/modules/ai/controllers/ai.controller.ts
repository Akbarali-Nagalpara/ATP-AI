import { Controller, Post, Get, Param, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AiService } from '../services/ai.service';

@ApiTags('AI Analysis')
@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('analyze/:runId')
  @ApiOperation({ summary: 'Trigger AI analysis for failed endpoints in a test run' })
  @ApiResponse({ status: 200, description: 'Analysis completed successfully' })
  async analyzeTestRun(@Param('runId') runId: string) {
    this.logger.log(`Received request to analyze run ${runId}`);
    return this.aiService.analyzeTestRunFailures(runId);
  }

  @Get('findings/:runId')
  @ApiOperation({ summary: 'Get all AI findings for a specific test run' })
  @ApiResponse({ status: 200, description: 'List of AI findings' })
  async getFindings(@Param('runId') runId: string) {
    return this.aiService.getFindingsForRun(runId);
  }
}

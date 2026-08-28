import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { OllamaProvider } from '../providers/ollama.provider';
import { AiPreprocessorService } from './ai-preprocessor.service';
import { generateFailureAnalysisPrompt } from '../prompts/failure-analysis.prompt';
import { validateAiResponse } from '../dto/ai-finding.dto';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  
  // Track ongoing analysis to prevent duplicate runs
  private activeAnalysis = new Set<string>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly ollama: OllamaProvider,
    private readonly preprocessor: AiPreprocessorService
  ) {}

  async analyzeTestRunFailures(runId: string) {
    if (this.activeAnalysis.has(runId)) {
      throw new BadRequestException('Analysis already in progress for this run.');
    }
    this.activeAnalysis.add(runId);

    try {
      // 1. Verify Run
      const testRun = await this.prisma.testRun.findUnique({
        where: { id: runId },
        include: {
          testResults: {
            where: { success: false },
            include: { endpoint: true, role: true }
          }
        }
      });

      if (!testRun) {
        throw new NotFoundException(`TestRun ${runId} not found`);
      }

      const failedResults = testRun.testResults;
      if (failedResults.length === 0) {
        return { message: 'No failed test results to analyze', count: 0 };
      }

      this.logger.log(`Starting AI analysis for TestRun ${runId} (${failedResults.length} failures)`);

      // 2. Preprocess Data
      const preprocessed = this.preprocessor.preprocessFailedResults(failedResults);

      let analyzedCount = 0;

      // 3. Process Each Failure
      for (const result of preprocessed) {
        try {
          const prompt = generateFailureAnalysisPrompt(result);
          
          // 4. Call Ollama
          const rawResponse = await this.ollama.generate(prompt, 'json');
          
          let parsed;
          try {
            // Sometimes Qwen adds markdown blocks despite instructions
            const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            parsed = JSON.parse(cleaned);
          } catch (e) {
            this.logger.error(`Failed to parse JSON from AI for result ${result.resultId}. Raw: ${rawResponse}`);
            continue;
          }

          // 5. Validate JSON
          const validatedData = validateAiResponse(parsed);

          // 6. Save Findings
          await this.prisma.aIFinding.create({
            data: {
              resultId: result.resultId,
              issue: validatedData.issue,
              severity: validatedData.severity,
              suggestion: `${validatedData.suggestion}\n\n**Root Cause:**\n${validatedData.rootCause}\n\n**Developer Fix:**\n${validatedData.fixPrompt}\n\n**Security:**\n${validatedData.securityFindings.join(', ')}`
            }
          });
          analyzedCount++;
          
        } catch (error) {
          this.logger.error(`Error analyzing result ${result.resultId}: ${error.message}`);
        }
      }

      return { message: 'Analysis completed successfully', analyzedCount };

    } finally {
      this.activeAnalysis.delete(runId);
    }
  }

  async getFindingsForRun(runId: string) {
    return this.prisma.aIFinding.findMany({
      where: {
        testResult: { runId }
      },
      include: {
        testResult: {
          include: { endpoint: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

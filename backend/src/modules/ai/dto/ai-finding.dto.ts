import { SeverityLevel } from '@prisma/client';

export class AiFindingResponseDto {
  issue: string;
  suggestion: string;
  rootCause: string;
  fixPrompt: string;
  securityFindings: string[];
  severity: SeverityLevel;
}

export function validateAiResponse(data: any): AiFindingResponseDto {
  if (typeof data !== 'object' || data === null) {
    throw new Error('AI response is not a valid JSON object');
  }

  if (typeof data.issue !== 'string') data.issue = 'Unknown Issue';
  if (typeof data.suggestion !== 'string') data.suggestion = 'Review backend logs for more details.';
  if (typeof data.rootCause !== 'string') data.rootCause = 'Undetermined root cause.';
  if (typeof data.fixPrompt !== 'string') data.fixPrompt = 'No fix prompt generated.';
  if (!Array.isArray(data.securityFindings)) data.securityFindings = [];
  
  const validSeverities: SeverityLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  if (!validSeverities.includes(data.severity)) {
    data.severity = 'MEDIUM';
  }

  return {
    issue: data.issue,
    suggestion: data.suggestion,
    rootCause: data.rootCause,
    fixPrompt: data.fixPrompt,
    securityFindings: data.securityFindings,
    severity: data.severity as SeverityLevel
  };
}

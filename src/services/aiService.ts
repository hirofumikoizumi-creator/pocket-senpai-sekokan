import { buildNoMatchResponse, buildSafetyFallbackResponse, isUnsafeConstructionJudgmentRequest } from '../constants/safety';
import { findConsultationResponse } from '../data/consultations';
import { ConsultationResponse } from '../types';
import { formatWithOnDeviceQwen } from './onDeviceQwen';
import { enforceResponseSafety } from './safetyGuard';

const RESPONSE_DELAY_MS = 500;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAIResponse(query: string): Promise<ConsultationResponse> {
  await wait(RESPONSE_DELAY_MS);

  if (isUnsafeConstructionJudgmentRequest(query)) {
    return buildSafetyFallbackResponse(query);
  }

  const approvedSource = findConsultationResponse(query) ?? buildNoMatchResponse();
  const qwenFormatted = await formatWithOnDeviceQwen({ query, source: approvedSource });

  return enforceResponseSafety(qwenFormatted ?? approvedSource);
}

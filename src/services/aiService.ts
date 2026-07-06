import { buildGeneralSenpaiResponse, buildSafetyFallbackResponse, isUnsafeConstructionJudgmentRequest } from '../constants/safety';
import { findConsultationResponse } from '../data/consultations';
import { ConsultationResponse } from '../types';
import { formatWithOnDeviceAI } from './onDeviceAI';
import { enforceResponseSafety } from './safetyGuard';

const RESPONSE_DELAY_MS = 500;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withSenpaiTone(response: ConsultationResponse): ConsultationResponse {
  const isGeneral = response.id === 'general-senpai-ai';
  const lead = isGeneral ? '' : 'おつかれさま。';
  const conclusion = response.conclusion.startsWith('おつかれさま')
    ? response.conclusion
    : `${lead}${response.conclusion}`;

  const senpaiMessage = response.senpaiMessage || '大丈夫です。まずは事実を分けて、確認先へつなげていきましょう。';

  return {
    ...response,
    conclusion,
    fieldTalk: response.fieldTalk || '「ここまで確認しました。次に見るべき点を一緒に整理させてください。」',
    senpaiMessage: senpaiMessage.startsWith('先輩っぽく言うなら')
      ? senpaiMessage
      : `先輩っぽく言うなら、${senpaiMessage}`,
  };
}

export async function getAIResponse(query: string): Promise<ConsultationResponse> {
  await wait(RESPONSE_DELAY_MS);

  if (isUnsafeConstructionJudgmentRequest(query)) {
    return withSenpaiTone(buildSafetyFallbackResponse(query));
  }

  const approvedSource = findConsultationResponse(query) ?? buildGeneralSenpaiResponse(query);
  const aiFormatted = await formatWithOnDeviceAI({ query, source: approvedSource });

  return enforceResponseSafety(withSenpaiTone(aiFormatted ?? approvedSource));
}

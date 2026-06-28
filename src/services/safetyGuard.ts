import { SAFETY_NOTICE } from '../constants/safety';
import { ConsultationResponse } from '../types';

const UNSAFE_OUTPUT_PATTERNS = [
  /施工してよい/,
  /省略してよい/,
  /安全です/,
  /合法です|違法ではありません/,
  /構造.*問題ありません/,
  /資格なし.*できます/,
  /事故.*報告不要/,
];

function scrub(value: string): string {
  if (!value) return value;
  if (!UNSAFE_OUTPUT_PATTERNS.some((pattern) => pattern.test(value))) return value;
  return `${SAFETY_NOTICE} 監修済み素材の範囲で、学習用の確認事項として参照してください。`;
}

export function enforceResponseSafety(response: ConsultationResponse): ConsultationResponse {
  return {
    ...response,
    conclusion: scrub(response.conclusion),
    fieldAction: scrub(response.fieldAction),
    fieldTalk: scrub(response.fieldTalk),
    caution: response.caution ? scrub(response.caution) : SAFETY_NOTICE,
    senpaiMessage: scrub(response.senpaiMessage),
  };
}

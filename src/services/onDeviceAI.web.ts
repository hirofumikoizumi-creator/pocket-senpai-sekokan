import { ConsultationResponse } from '../types';
import type { AIFormatInput, OnDeviceAIStatus } from './onDeviceAI';

export type { AIFormatInput, OnDeviceAIStatus };

export async function getOnDeviceAIStatus(): Promise<OnDeviceAIStatus> {
  return 'native_unavailable';
}

export async function formatWithOnDeviceAI(
  _input: AIFormatInput
): Promise<ConsultationResponse | null> {
  return null;
}

import { ConsultationResponse } from '../types';
import type { OnDeviceQwenStatus, QwenFormatInput } from './onDeviceQwen';

export type { OnDeviceQwenStatus, QwenFormatInput };

export async function getOnDeviceQwenStatus(): Promise<OnDeviceQwenStatus> {
  return 'native_unavailable';
}

export async function formatWithOnDeviceQwen(
  _input: QwenFormatInput
): Promise<ConsultationResponse | null> {
  return null;
}

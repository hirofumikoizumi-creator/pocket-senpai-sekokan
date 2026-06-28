import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { modelManifest } from '../data/modelManifest';
import { ConsultationResponse } from '../types';
import { enforceResponseSafety } from './safetyGuard';

export type OnDeviceQwenStatus =
  | 'ready'
  | 'loading'
  | 'missing_model'
  | 'native_unavailable'
  | 'error';

export type QwenFormatInput = {
  query: string;
  source: ConsultationResponse;
};

type LlamaModule = typeof import('llama.rn');
type LlamaContext = Awaited<ReturnType<LlamaModule['initLlama']>>;

const MIN_REAL_MODEL_BYTES = 500 * 1024 * 1024;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const QWEN_MODEL_ASSET = require('../../assets/models/Qwen3-0.6B-Q8_0.gguf');
const STOP_WORDS = ['</s>', '<|end|>', '<|im_end|>', '<|endoftext|>'];

let contextPromise: Promise<LlamaContext | null> | null = null;
let lastStatus: OnDeviceQwenStatus = 'loading';

async function getBundledModelUri(): Promise<string | null> {
  const asset = Asset.fromModule(QWEN_MODEL_ASSET);
  await asset.downloadAsync();

  const uri = asset.localUri ?? asset.uri;
  if (!uri) return null;

  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists || typeof info.size !== 'number' || info.size < MIN_REAL_MODEL_BYTES) {
    return null;
  }

  return uri.startsWith('file://') ? uri : `file://${uri}`;
}

async function loadContext(): Promise<LlamaContext | null> {
  try {
    const model = await getBundledModelUri();
    if (!model) {
      lastStatus = 'missing_model';
      return null;
    }

    const llama = await import('llama.rn');
    const context = await llama.initLlama({
      model,
      use_mlock: true,
      n_ctx: 1024,
      n_gpu_layers: 99,
      n_threads: 4,
    });

    lastStatus = 'ready';
    return context;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    lastStatus = message.includes('Native') || message.includes('TurboModule')
      ? 'native_unavailable'
      : 'error';
    return null;
  }
}

async function getContext(): Promise<LlamaContext | null> {
  if (!contextPromise) {
    contextPromise = loadContext();
  }
  return contextPromise;
}

function buildPrompt(input: QwenFormatInput): string {
  return [
    'あなたは建設・土木の施工管理学習アプリ内のオンデバイス整形器です。',
    '新しい技術判断や法令判断を生成してはいけません。',
    '法令適合、構造計算、施工可否、重機・仮設・災害・事故・緊急対応、契約や行政手続きの最終判断を出してはいけません。',
    '入力された監修済み素材だけを、同じ意味のまま短く読みやすく整えてください。',
    '必ずJSONだけを返してください。Markdownや説明文は禁止です。',
    '',
    'JSON形式:',
    '{"conclusion":"","fieldAction":"","fieldTalk":"","caution":"","senpaiMessage":""}',
    '',
    `相談: ${input.query}`,
    `監修済み素材: ${JSON.stringify({
      conclusion: input.source.conclusion,
      fieldAction: input.source.fieldAction,
      fieldTalk: input.source.fieldTalk,
      caution: input.source.caution,
      senpaiMessage: input.source.senpaiMessage,
    })}`,
  ].join('\n');
}

function parseFormattedResponse(text: string, source: ConsultationResponse): ConsultationResponse | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return null;

  try {
    const parsed = JSON.parse(text.slice(start, end + 1)) as Partial<ConsultationResponse>;
    return enforceResponseSafety({
      ...source,
      conclusion: String(parsed.conclusion || source.conclusion),
      fieldAction: String(parsed.fieldAction || source.fieldAction),
      fieldTalk: String(parsed.fieldTalk || source.fieldTalk),
      caution: String(parsed.caution || source.caution),
      senpaiMessage: String(parsed.senpaiMessage || source.senpaiMessage),
    });
  } catch {
    return null;
  }
}

export async function getOnDeviceQwenStatus(): Promise<OnDeviceQwenStatus> {
  if (lastStatus === 'ready') return 'ready';
  if (!contextPromise) {
    const model = await getBundledModelUri();
    return model ? lastStatus : 'missing_model';
  }
  await contextPromise;
  return lastStatus;
}

export async function formatWithOnDeviceQwen(
  input: QwenFormatInput
): Promise<ConsultationResponse | null> {
  if (!modelManifest.cloudApiEnabled) {
    const context = await getContext();
    if (!context) return null;

    const result = await context.completion({
      prompt: buildPrompt(input),
      n_predict: 220,
      temperature: 0.1,
      top_k: 20,
      top_p: 0.8,
      stop: STOP_WORDS,
    });

    return parseFormattedResponse(result.text, input.source);
  }

  return null;
}

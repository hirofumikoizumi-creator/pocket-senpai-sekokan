import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system/legacy';
import { modelManifest } from '../data/modelManifest';
import { ConsultationResponse } from '../types';
import { enforceResponseSafety } from './safetyGuard';

export type OnDeviceAIStatus =
  | 'ready'
  | 'loading'
  | 'missing_model'
  | 'native_unavailable'
  | 'error';

export type AIFormatInput = {
  query: string;
  source: ConsultationResponse;
};

type LlamaModule = typeof import('llama.rn');
type LlamaContext = Awaited<ReturnType<LlamaModule['initLlama']>>;

const MIN_REAL_MODEL_BYTES = 500 * 1024 * 1024;
const STOP_WORDS = ['</s>', '<|end|>', '<|im_end|>', '<|endoftext|>'];
const constants = Constants as any;
const extra = Constants.expoConfig?.extra || constants.manifest2?.extra || {};
const modelDownloadUrl = String(extra.aiModelUrl || '');

let contextPromise: Promise<LlamaContext | null> | null = null;
let lastStatus: OnDeviceAIStatus = 'loading';

function getLocalModelUri() {
  return `${FileSystem.documentDirectory || ''}models/${modelManifest.filename}`;
}

async function ensureModelDirectory() {
  const directory = `${FileSystem.documentDirectory || ''}models`;
  const info = await FileSystem.getInfoAsync(directory);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  }
}

async function isUsableModel(uri: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(uri);
  return Boolean(info.exists && !info.isDirectory && (info.size || 0) >= MIN_REAL_MODEL_BYTES);
}

async function downloadConfiguredModel(uri: string): Promise<string | null> {
  if (!modelDownloadUrl || !/^https:\/\//i.test(modelDownloadUrl)) return null;

  try {
    await ensureModelDirectory();
    const result = await FileSystem.downloadAsync(modelDownloadUrl, uri);
    return await isUsableModel(result.uri) ? result.uri : null;
  } catch (error) {
    console.warn('AI model download failed:', error);
    return null;
  }
}

async function getAvailableModelUri(): Promise<string | null> {
  const localUri = getLocalModelUri();
  if (await isUsableModel(localUri)) return localUri;
  return downloadConfiguredModel(localUri);
}

async function loadContext(): Promise<LlamaContext | null> {
  try {
    const model = await getAvailableModelUri();
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

function buildPrompt(input: AIFormatInput): string {
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

export async function getOnDeviceAIStatus(): Promise<OnDeviceAIStatus> {
  if (lastStatus === 'ready') return 'ready';
  if (!contextPromise) {
    const model = await getAvailableModelUri();
    return model ? lastStatus : 'missing_model';
  }
  await contextPromise;
  return lastStatus;
}

export async function formatWithOnDeviceAI(
  input: AIFormatInput
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

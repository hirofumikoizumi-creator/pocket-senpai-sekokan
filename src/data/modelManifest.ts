export const modelManifest = {
  id: 'qwen3-on-device',
  displayName: 'Qwen3 On-device Formatter',
  filename: 'Qwen3-0.6B-Q8_0.gguf',
  minBytes: 524288000,
  runtime: 'llama.rn',
  mode: 'bundled-gguf-required',
  cloudApiEnabled: false,
  purpose:
    '監修済みデータを相談画面向けの形式に整えるためのオンデバイス補助。医療事実の生成には使わない。',
} as const;

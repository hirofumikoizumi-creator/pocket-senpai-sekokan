export const modelManifest = {
  id: 'ai-on-device-formatter',
  displayName: 'AI On-device Formatter',
  filename: 'ai-model.gguf',
  minBytes: 524288000,
  runtime: 'llama.rn',
  mode: 'download-or-local-gguf',
  cloudApiEnabled: false,
  purpose:
    '監修済みデータを相談画面向けの形式に整えるためのオンデバイス補助。現場判断・法令判断の生成には使わない。',
} as const;

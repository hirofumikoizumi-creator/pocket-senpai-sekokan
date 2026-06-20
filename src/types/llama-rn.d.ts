declare module 'llama.rn' {
  export type LlamaChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
  };

  export type LlamaContext = {
    completion(
      params: {
        messages?: LlamaChatMessage[];
        prompt?: string;
        n_predict?: number;
        temperature?: number;
        top_k?: number;
        top_p?: number;
        stop?: string[];
        response_format?: unknown;
      },
      onToken?: (data: { token?: string }) => void
    ): Promise<{ text: string; timings?: unknown }>;
    release?: () => Promise<void>;
  };

  export function initLlama(params: {
    model: string;
    use_mlock?: boolean;
    n_ctx?: number;
    n_gpu_layers?: number;
    n_threads?: number;
  }): Promise<LlamaContext>;

  export function loadLlamaModelInfo(model: string): Promise<unknown>;
}

declare const require: (path: string) => number;

declare module '*.gguf' {
  const assetId: number;
  export default assetId;
}

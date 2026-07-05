/**
 * ポケット先輩 型定義
 */

// 先輩相談
export interface ConsultationResponse {
  id: string;
  category: string;
  keywords: string[];
  conclusion: string;
  fieldAction: string;
  fieldTalk: string;
  caution: string;
  senpaiMessage: string;
  references?: string[];
  sourceNote?: string;
}

// 現場トーク
export interface TalkScript {
  id: string;
  category: string;
  title: string;
  situation: string;
  dialogues: Dialogue[];
  references?: string[];
  sourceNote?: string;
}

export interface Dialogue {
  speaker: 'field' | 'counterpart';
  text: string;
}

// 業務別マニュアル
export interface Manual {
  id: string;
  category: string;
  title: string;
  overview: string;
  steps: ManualStep[];
  tips: string[];
  cautions: string[];
  references?: string[];
  sourceNote?: string;
}

export interface ManualStep {
  order: number;
  title: string;
  description: string;
}

// チェックリスト
export interface ChecklistCategory {
  id: string;
  title: string;
  icon: string;
  items: ChecklistItem[];
  references?: string[];
  sourceNote?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

// クイズ
export interface Quiz {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  references?: string[];
  sourceNote?: string;
}

// お気に入り
export interface FavoriteItem {
  id: string;
  type: 'consultation' | 'talk' | 'manual' | 'checklist' | 'quiz';
  title: string;
  category: string;
  savedAt: string;
}

// AI サービスインターフェース（オンデバイス整形・テンプレートフォールバック用）
export interface AIServiceInterface {
  getResponse(query: string): Promise<ConsultationResponse>;
}

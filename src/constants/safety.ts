import { ConsultationResponse } from '../types';
import { COMMON_REFERENCES, CONTENT_SOURCE_NOTE, SAFETY_REFERENCES } from '../data/references';

export const FULL_DISCLAIMER =
  '本アプリは建設・土木の施工管理を学ぶための教育・学習支援アプリです。法令適合、構造安全、施工可否、労働安全、災害・事故対応などの判断を代替するものではありません。実務では法令、設計図書、仕様書、元請・発注者・所属会社のルール、有資格者・監督者の指示に従ってください。';

export const SAFETY_NOTICE =
  '法令適合、構造計算、施工可否、重機・仮設・墜落災害、事故・緊急対応、契約・行政手続きの最終判断は扱えません。必ず法令、設計図書、仕様書、現場ルール、有資格者・監督者の指示を確認してください。';

const UNSAFE_REQUEST_PATTERNS = [
  /構造計算|耐力|安全率/,
  /法令適合|違法|合法|建築確認|許認可/,
  /施工可否|やっていい|省略していい|手抜き/,
  /墜落|感電|崩壊|土砂崩れ|酸欠|火災|爆発/,
  /事故|労災|緊急|救急/,
  /契約|損害賠償|行政処分/,
  /資格なし|無資格/,
];

export function isUnsafeConstructionJudgmentRequest(text: string): boolean {
  return UNSAFE_REQUEST_PATTERNS.some((pattern) => pattern.test(text));
}

export function buildSafetyFallbackResponse(query: string): ConsultationResponse {
  return {
    id: 'safety-fallback',
    category: '安全確認',
    keywords: [],
    conclusion:
      'この内容は安全・法令・施工可否などの重要判断に関わる可能性があるため、本アプリでは判断を行いません。学習用の一般的な確認事項として整理してください。',
    fieldAction:
      '1. 現場を止める必要があるか監督者へ確認する  2. 事実、場所、時間、関係者、写真・記録を整理する  3. 設計図書・仕様書・施工計画書・KY記録を確認する  4. 緊急性がある場合は現場ルールに沿って直ちに報告する',
    fieldTalk:
      '「安全と品質に関わる内容のため、現場責任者・監督者と確認してからご案内します。」',
    caution: SAFETY_NOTICE,
    senpaiMessage:
      query.trim().length > 0
        ? '施工管理でいちばん大事なのは、危ないかもと思った瞬間に確認先へつなぐことです。一人で抱えず、事実を短く整理して共有しましょう。'
        : '相談内容を入力するときも、個人名、現場名、契約情報など特定につながる情報は入れないでください。',
    references: SAFETY_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  };
}

export function buildNoMatchResponse(): ConsultationResponse {
  return {
    id: 'template-fallback',
    category: '一般',
    keywords: [],
    conclusion:
      '監修済みデータ内にぴったり一致する素材が見つかりませんでした。一般的な学習の整理として、状況・困っている点・確認先を分けて考えてみましょう。',
    fieldAction:
      '1. 何に困っているかを短く書き出す  2. 安全・品質・工程・書類・関係者調整のどれかを分ける  3. 判断が必要な部分は監督者・先輩・施工計画書・現場ルールへ確認する',
    fieldTalk: '「確認してから、根拠と対応を整理してご案内します。」',
    caution: SAFETY_NOTICE,
    senpaiMessage:
      'うまく言葉にできない時は、まず「何が不安か」だけでも大丈夫。判断ではなく、確認する順番を整理していきましょう。',
    references: COMMON_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  };
}

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

export function buildGeneralSenpaiResponse(query: string): ConsultationResponse {
  const trimmedQuery = query.trim();
  const lowerQuery = trimmedQuery.toLowerCase();
  const isTired = /疲れ|つら|辛|しんど|不安|メンタル|眠れ|限界/.test(trimmedQuery);
  const isRelationship = /人間関係|上司|先輩|後輩|同僚|職長|怒ら|苦手|コミュ/.test(trimmedQuery);
  const isStudy = /勉強|覚え|資格|試験|学習|練習|成長/.test(trimmedQuery);
  const isWriting = /メール|文章|報告|返信|書き方|言い方|伝え方/.test(trimmedQuery);
  const isPlanning = /時間|予定|優先|段取り|タスク|忙し|整理|何から/.test(trimmedQuery);

  let conclusion = 'おつかれさま。これは施工管理の専門知識そのものではなくても、まず落ち着いて整理すれば大丈夫です。';
  let fieldAction =
    '1. いま起きていることを一文で書く  2. 自分で決められることと、相談が必要なことを分ける  3. 今日できる一歩を一つだけ決める  4. 無理に抱えず、必要なら信頼できる人へ早めに共有する';
  let fieldTalk = '「いま少し整理したいので、状況と次にやることを一緒に確認させてください。」';
  let caution =
    '医療、法律、契約、金銭、緊急対応などの重要判断は、専門家や責任者に確認してください。個人情報や現場を特定できる情報は入力しないでください。';
  let senpaiMessage =
    '先輩っぽく言うなら、完璧な答えを一発で出そうとしなくていいです。まずは「事実」「気持ち」「次の一手」を分ければ、だいぶ動きやすくなります。';

  if (isTired) {
    conclusion = 'おつかれさま。しんどい時は、気合いで押し切るより、まず負荷を見える形にするのが先です。';
    fieldAction =
      '1. 今日中に必要なことだけを3つ以内に絞る  2. 後ろへ回せるものを分ける  3. 上長や周囲に相談する材料をメモする  4. 体調に影響が出ているなら、会社窓口や医療・専門相談につなぐ';
    fieldTalk = '「少し業務が詰まっているので、優先順位を確認させてください。」';
    senpaiMessage = '無理して黙っている方が、あとで現場にも自分にも響きます。早めに小さく相談するのは、ちゃんとした仕事の進め方です。';
  } else if (isRelationship) {
    conclusion = '人とのやりとりは、正しさだけで押すより、相手が判断しやすい形にすると通りやすいです。';
    fieldAction =
      '1. 相手に伝えたい結論を一つに絞る  2. 感情と事実を分ける  3. 写真・記録・期限など根拠を添える  4. 相談なのか報告なのか依頼なのかを明確にする';
    fieldTalk = '「現状はここまで確認できています。次の進め方について相談させてください。」';
    senpaiMessage = '言い方に迷ったら、まず相手を責めない形で事実から入るといいです。短く、落ち着いて、判断材料を渡しましょう。';
  } else if (isStudy) {
    conclusion = '勉強は量だけでなく、間違えた理由を残すと伸びやすいです。';
    fieldAction =
      '1. 分野を小さく分ける  2. まず一問または一項目だけ進める  3. 間違えた理由を一言で残す  4. 翌日と週末に同じ内容を見直す';
    fieldTalk = '「今日はこの分野だけを進めて、間違えた理由をメモしておきます。」';
    senpaiMessage = '一気に全部やろうとしなくて大丈夫です。毎日少しでも、現場の経験と用語がつながると強くなります。';
  } else if (isWriting) {
    conclusion = '文章や報告は、うまい表現より「相手がすぐ判断できる順番」が大事です。';
    fieldAction =
      '1. 結論を先に書く  2. 事実、理由、お願いしたいことを分ける  3. 日時・場所・期限を入れる  4. 最後に相手に何をしてほしいかを書く';
    fieldTalk = '「結論からお伝えします。現状は〇〇で、確認いただきたい点は〇〇です。」';
    senpaiMessage = 'きれいな文章にしようとしすぎなくていいです。結論、事実、依頼。この3つがあれば、仕事の文章はかなり伝わります。';
  } else if (isPlanning || lowerQuery.includes('todo')) {
    conclusion = '忙しい時ほど、頭の中だけで抱えず、順番を外に出すのが効きます。';
    fieldAction =
      '1. 今日必ず終えることを書く  2. 10分でできることから着手する  3. 人に確認が必要なものを先に投げる  4. 終わらないものは期限と理由を添えて相談する';
    fieldTalk = '「今日中に必要なものと、確認待ちのものを分けて進めます。」';
    senpaiMessage = '段取りは才能じゃなくて、分け方です。まず紙でもメモでもいいので、外に出してから優先順位を決めましょう。';
  }

  return {
    id: 'general-senpai-ai',
    category: '一般相談',
    keywords: [],
    conclusion,
    fieldAction,
    fieldTalk,
    caution,
    senpaiMessage,
    references: COMMON_REFERENCES,
    sourceNote:
      trimmedQuery.length > 0
        ? '一般的な学習・相談支援としてAIで整理しています。専門判断や緊急対応は、必ず専門家・責任者へ確認してください。'
        : CONTENT_SOURCE_NOTE,
  };
}

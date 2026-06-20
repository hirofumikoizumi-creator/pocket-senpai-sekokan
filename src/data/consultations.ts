import { buildNoMatchResponse } from '../constants/safety';
import { ConsultationResponse } from '../types';

export const consultationData: ConsultationResponse[] = [
  {
    id: 'c001',
    category: '安全管理',
    keywords: ['KY', '朝礼', '安全', '危険予知', 'ヒヤリ', '作業前'],
    conclusion:
      '作業前は、当日の作業内容と危険源を「場所・作業・人の動き」に分け、対策と確認先を明確にします。',
    fieldAction:
      '1. 工程と作業範囲を確認する  2. 墜落・重機接触・飛来落下・感電などを洗い出す  3. 立入禁止、合図者、保護具、退避場所を共有する  4. 不安な作業は開始前に監督者へ確認する',
    patientTalk:
      '「今日の作業で危険が大きいところを先に共有します。迷ったら作業を止めて、必ず声をかけてください。」',
    caution:
      '危険作業の継続可否や緊急対応はアプリで判断できません。現場ルール、法令、有資格者・監督者の指示に従ってください。',
    senpaiMessage:
      '安全確認は細かすぎるくらいでちょうどいいです。気づいた違和感を言葉にできたら、もう施工管理の大事な一歩です。',
  },
  {
    id: 'c002',
    category: '品質管理',
    keywords: ['写真', '出来形', '品質', '黒板', '検査', '寸法', '測定'],
    conclusion:
      '品質管理では、設計図書・仕様書・施工計画書に基づき、後から確認できない箇所を先回りして記録します。',
    fieldAction:
      '1. 管理項目と頻度を確認する  2. 不可視部や施工中写真の撮影タイミングを決める  3. 黒板情報と実測値をそろえる  4. 当日中に写真と出来形表を照合する',
    patientTalk:
      '「この箇所は後から見えなくなるため、設計値・実測値・施工状況が分かる写真を残してから次工程へ進めます。」',
    caution:
      '規格値の解釈、合否判定、是正要否は仕様書・監督者・発注者指示を確認してください。記録の改ざんは絶対に行わないでください。',
    senpaiMessage:
      '写真は未来の自分を助ける証拠です。迷ったら「後で説明できるか」で撮るかどうかを考えてみましょう。',
  },
  {
    id: 'c003',
    category: '工程管理',
    keywords: ['工程', '遅れ', '週間工程', '段取り', '天候', '搬入', '納期'],
    conclusion:
      '工程の遅れや変更は、原因・影響・代替案を分けて整理し、関係者へ早めに共有します。',
    fieldAction:
      '1. 遅れの原因を事実で整理する  2. 安全・品質・後続作業への影響を確認する  3. 資材、人員、天候、立会の制約を見直す  4. 変更案は上長・職長と確認して記録する',
    patientTalk:
      '「工程への影響が出る可能性があるため、原因と代替案を整理して、関係者に確認します。」',
    caution:
      '安全設備、養生期間、品質確認を省いて工程短縮する判断はできません。契約工期や追加費用に関わる内容は上長へ確認してください。',
    senpaiMessage:
      '工程表は予定表というより、関係者との約束の地図です。変わりそうな時ほど早めの共有が効きます。',
  },
  {
    id: 'c004',
    category: '書類・記録',
    keywords: ['書類', '記録', '施工計画書', '日報', '議事録', '提出', '整理'],
    conclusion:
      '書類は、事実・根拠・決定事項が後から追えることを意識して整理します。',
    fieldAction:
      '1. 提出先と期限を確認する  2. 図面番号、仕様書、写真、測定値など根拠をそろえる  3. 決定者と日付を記録する  4. 不足資料は早めに依頼する',
    patientTalk:
      '「確認結果を記録に残し、後から誰が見ても経緯が分かる形に整理します。」',
    caution:
      '契約、法令、行政手続きに関わる書類は、上長・有資格者・会社ルールを確認してください。',
    senpaiMessage:
      '書類は面倒に見えますが、現場を守る道具です。完璧より、まず「後で追える」を目標にしましょう。',
  },
  {
    id: 'c005',
    category: '職長・発注者対応',
    keywords: ['職長', '発注者', '監督員', '説明', '報告', '相談', 'コミュニケーション'],
    conclusion:
      '報告は「事実」「影響」「相談したいこと」を分けると、相手が判断しやすくなります。',
    fieldAction:
      '1. いつ・どこで・何が起きたかを整理する  2. 安全・品質・工程への影響を分ける  3. 写真や図面番号を添える  4. 判断してほしい点を一つに絞る',
    patientTalk:
      '「現状はここまで確認できています。影響が出る可能性があるため、この点について判断をお願いします。」',
    caution:
      '追加費用、工期変更、施工方法変更を独断で約束しないでください。決定事項は記録に残してください。',
    senpaiMessage:
      'うまく話すより、相手が判断できる材料をそろえるほうが大事です。短くても事実があれば伝わります。',
  },
  {
    id: 'c006',
    category: '試験学習',
    keywords: ['施工管理技士', '試験', '勉強', '過去問', '資格', '土木', '建築'],
    conclusion:
      '施工管理技士の学習は、過去問、施工経験記述、法規・安全・品質・工程の弱点整理を繰り返すと進めやすくなります。',
    fieldAction:
      '1. 出題分野を安全・品質・工程・法規・施工法に分ける  2. 過去問で間違えた理由を記録する  3. 経験記述は工事概要、課題、対策、結果を型で整理する  4. 現場で見た内容と用語を結びつける',
    patientTalk: '',
    caution:
      '試験制度、受験資格、出題範囲は年度で変わる可能性があります。必ず最新の公式情報を確認してください。',
    senpaiMessage:
      '現場で見たことは試験勉強の強い味方です。用語だけで覚えず、「あの作業のことだ」と結びつけていきましょう。',
  },
];

export function findConsultationResponse(query: string): ConsultationResponse | null {
  const normalizedQuery = query.toLowerCase();
  let bestMatch: ConsultationResponse | null = null;
  let bestScore = 0;

  for (const item of consultationData) {
    const score = item.keywords.reduce((total, keyword) => {
      return normalizedQuery.includes(keyword.toLowerCase()) ? total + 1 : total;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return bestScore > 0 ? bestMatch : buildNoMatchResponse();
}

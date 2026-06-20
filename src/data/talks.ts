import { TalkScript } from '../types';

export const talkScripts: TalkScript[] = [
  {
    id: 't001',
    category: '報告の基本',
    title: '事実・影響・相談を分ける',
    situation: '職長や上長へ現場の変更点を報告する場面',
    dialogues: [
      { speaker: 'dh', text: '確認した事実、影響、相談したいことを分けて報告します。' },
      { speaker: 'patient', text: '何が起きていますか？' },
      {
        speaker: 'dh',
        text: '本日10時ごろ、A工区の搬入が遅れています。午後の据付に影響する可能性があるため、作業順序の変更可否を確認したいです。',
      },
      { speaker: 'patient', text: '写真と工程への影響も合わせて確認しましょう。' },
    ],
  },
  {
    id: 't002',
    category: '安全共有',
    title: '危険作業を始める前の声かけ',
    situation: '重機作業や高所作業の前に協力会社へ共有する場面',
    dialogues: [
      { speaker: 'dh', text: 'この作業では、重機旋回範囲と歩行者動線を分けて確認します。' },
      { speaker: 'patient', text: '合図者は誰ですか？' },
      {
        speaker: 'dh',
        text: '本日の合図者は田中さんです。立入禁止範囲をカラーコーンで明示し、合図者の指示があるまで近づかない運用でお願いします。',
      },
      { speaker: 'patient', text: '了解です。作業員にも共有します。' },
    ],
  },
  {
    id: 't003',
    category: '品質確認',
    title: '不可視部写真の依頼',
    situation: '次工程で見えなくなる箇所を撮影してから進める場面',
    dialogues: [
      { speaker: 'dh', text: 'この部分は埋戻し後に確認できなくなるため、写真を残してから次へ進めたいです。' },
      { speaker: 'patient', text: 'どの写真が必要ですか？' },
      {
        speaker: 'dh',
        text: '測点、設計値、実測値、施工状況が分かる写真を撮ります。黒板情報を確認してから撮影します。',
      },
      { speaker: 'patient', text: '撮影後に一緒に確認しましょう。' },
    ],
  },
  {
    id: 't004',
    category: '発注者対応',
    title: '確認後に回答する',
    situation: '発注者・監督員から判断が必要な質問を受けた場面',
    dialogues: [
      { speaker: 'patient', text: 'この方法で進めても問題ないですか？' },
      {
        speaker: 'dh',
        text: '安全と品質に関わる内容のため、施工計画書と現場責任者に確認してから回答します。',
      },
      { speaker: 'patient', text: 'いつごろ分かりますか？' },
      {
        speaker: 'dh',
        text: '本日中に確認し、根拠とあわせてご連絡します。急ぎの場合は先に上長へ共有します。',
      },
    ],
  },
];

export function getTalksByCategory(category: string): TalkScript[] {
  return talkScripts.filter((talk) => talk.category === category);
}

export function getTalkCategories(): string[] {
  return [...new Set(talkScripts.map((talk) => talk.category))];
}

import { TalkScript } from '../types';
import { COMMON_REFERENCES, CONTENT_SOURCE_NOTE, QUALITY_REFERENCES, SAFETY_REFERENCES } from './references';

const baseTalkScripts: TalkScript[] = [
  {
    id: 't001',
    category: '報告の基本',
    title: '事実・影響・相談を分ける',
    situation: '職長や上長へ現場の変更点を報告する場面',
    dialogues: [
      { speaker: 'field', text: '確認した事実、影響、相談したいことを分けて報告します。' },
      { speaker: 'counterpart', text: '何が起きていますか？' },
      {
        speaker: 'field',
        text: '本日10時ごろ、A工区の搬入が遅れています。午後の据付に影響する可能性があるため、作業順序の変更可否を確認したいです。',
      },
      { speaker: 'counterpart', text: '写真と工程への影響も合わせて確認しましょう。' },
    ],
    references: COMMON_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  },
  {
    id: 't002',
    category: '安全共有',
    title: '危険作業を始める前の声かけ',
    situation: '重機作業や高所作業の前に協力会社へ共有する場面',
    dialogues: [
      { speaker: 'field', text: 'この作業では、重機旋回範囲と歩行者動線を分けて確認します。' },
      { speaker: 'counterpart', text: '合図者は誰ですか？' },
      {
        speaker: 'field',
        text: '本日の合図者は田中さんです。立入禁止範囲をカラーコーンで明示し、合図者の指示があるまで近づかない運用でお願いします。',
      },
      { speaker: 'counterpart', text: '了解です。作業員にも共有します。' },
    ],
    references: SAFETY_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  },
  {
    id: 't003',
    category: '品質確認',
    title: '不可視部写真の依頼',
    situation: '次工程で見えなくなる箇所を撮影してから進める場面',
    dialogues: [
      { speaker: 'field', text: 'この部分は埋戻し後に確認できなくなるため、写真を残してから次へ進めたいです。' },
      { speaker: 'counterpart', text: 'どの写真が必要ですか？' },
      {
        speaker: 'field',
        text: '測点、設計値、実測値、施工状況が分かる写真を撮ります。黒板情報を確認してから撮影します。',
      },
      { speaker: 'counterpart', text: '撮影後に一緒に確認しましょう。' },
    ],
    references: QUALITY_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  },
  {
    id: 't004',
    category: '発注者対応',
    title: '確認後に回答する',
    situation: '発注者・監督員から判断が必要な質問を受けた場面',
    dialogues: [
      { speaker: 'counterpart', text: 'この方法で進めても問題ないですか？' },
      {
        speaker: 'field',
        text: '安全と品質に関わる内容のため、施工計画書と現場責任者に確認してから回答します。',
      },
      { speaker: 'counterpart', text: 'いつごろ分かりますか？' },
      {
        speaker: 'field',
        text: '本日中に確認し、根拠とあわせてご連絡します。急ぎの場合は先に上長へ共有します。',
      },
    ],
    references: COMMON_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  },
];

const talkTopics = [
  ['安全共有', '高所作業の開始前確認', '足場・開口部・保護具を確認する場面', '高所作業前に、手すり・開口部養生・フルハーネスの使用条件を確認します。', '不備がある場合は開始前に止めましょう。', SAFETY_REFERENCES],
  ['安全共有', '重機旋回範囲の共有', '重機作業の前に周囲へ声をかける場面', '重機の旋回範囲と歩行者動線を分けます。合図者の指示で動いてください。', 'カラーコーンと誘導員の位置も確認します。', SAFETY_REFERENCES],
  ['安全共有', '熱中症リスクの共有', '暑熱環境で作業前に共有する場面', '今日は暑熱リスクが高いので、休憩と水分補給のタイミングを先に決めます。', '体調が悪い人はすぐ申告してください。', SAFETY_REFERENCES],
  ['安全共有', '仮設電気の確認', '電動工具を使う前に確認する場面', '電源、漏電遮断器、コード損傷、水濡れを確認してから使用します。', '異常があれば有資格者へ確認します。', SAFETY_REFERENCES],
  ['安全共有', '第三者動線の確認', '通行人に影響する作業を始める場面', '歩行者動線と立入禁止範囲を確認し、誘導方法を共有します。', '掲示と声かけも忘れずに行います。', SAFETY_REFERENCES],
  ['品質確認', '材料受入の確認', '納品材料を使う前に確認する場面', '承認材料と納品物の規格、数量、ロットを照合してから使用します。', '納品書と写真も残します。', QUALITY_REFERENCES],
  ['品質確認', '打設前の確認', 'コンクリート打設前に職長へ確認する場面', '型枠、配筋、受入試験、打設手順、養生方法を確認してから打設します。', '後から直しにくい部分を重点確認します。', QUALITY_REFERENCES],
  ['品質確認', '配筋写真の確認', '鉄筋が隠れる前に撮影を依頼する場面', '径、本数、間隔、かぶり、継手位置が分かる写真を残します。', '図面番号と測点も黒板に入れます。', QUALITY_REFERENCES],
  ['品質確認', '是正完了の確認', '指摘事項の手直し後に確認する場面', '是正内容、完了写真、確認者、再発防止を記録してから完了扱いにします。', '口頭だけで終わらせないようにします。', QUALITY_REFERENCES],
  ['品質確認', '測量の再確認', '墨出しやレベル確認を共有する場面', '基準点とレベルを再確認して、後工程に影響が出ないようにします。', '測定記録と確認者を残します。', QUALITY_REFERENCES],
  ['報告の基本', '搬入遅延の報告', '資材搬入が遅れている場面', '搬入が遅れています。後続作業への影響と代替作業を確認したいです。', '納入予定時刻と待機人員も共有します。', COMMON_REFERENCES],
  ['報告の基本', '雨天時の工程相談', '雨で予定作業が難しい場面', '雨天影響があるため、止める作業と進める作業を分けて相談します。', '品質影響がある作業は無理に進めません。', COMMON_REFERENCES],
  ['報告の基本', '人員不足の相談', '予定人員が足りない場面', '人員が不足しているため、安全上必要な配置を優先して工程を見直したいです。', '資格者や監視人は省かない前提で確認します。', COMMON_REFERENCES],
  ['報告の基本', 'ミスの報告', '確認漏れやミスに気づいた場面', '確認漏れがありました。影響範囲と対応案を整理して報告します。', '隠さず早めに共有します。', COMMON_REFERENCES],
  ['報告の基本', '追加作業の相談', '当初範囲外の作業が出た場面', '追加作業の可能性があるため、範囲・根拠・写真を整理して相談します。', '金額や工期は上長確認前に約束しません。', COMMON_REFERENCES],
  ['発注者対応', '確認後回答', 'その場で答えにくい質問を受けた場面', '安全・品質に関わるため、根拠資料と責任者に確認してから回答します。', '本日中に確認結果を共有します。', COMMON_REFERENCES],
  ['発注者対応', '検査前説明', '立会前に資料を説明する場面', '検査対象、写真、測定値、保留事項を整理しています。順番に説明します。', '判断待ち事項は明確に分けます。', QUALITY_REFERENCES],
  ['発注者対応', '近隣苦情の一次対応', '近隣から問い合わせがあった場面', 'ご連絡ありがとうございます。内容を確認し、会社の窓口と共有して回答します。', '独断で約束せず、記録を残します。', COMMON_REFERENCES],
  ['発注者対応', '道路規制の説明', '交通規制を伴う作業を説明する場面', '許可条件に沿って作業時間、誘導員、歩行者動線を確認しています。', '変更があれば事前に共有します。', COMMON_REFERENCES],
  ['発注者対応', '設計図書との差異相談', '現場条件が図面と違う場面', '現場条件と図面に差異があるため、写真と位置を整理して確認をお願いします。', '承認前に独断で進めません。', COMMON_REFERENCES],
  ['書類・記録', '日報確認', '日報の記載を確認する場面', '今日の作業実績、人数、機械、天候、写真番号を日報に残します。', '特記事項も当日中に記録します。', COMMON_REFERENCES],
  ['書類・記録', '議事録確認', '打合せ後に決定事項を確認する場面', '決定事項、宿題、担当、期限を分けて議事録に残します。', '認識違いがないか共有します。', COMMON_REFERENCES],
  ['書類・記録', '提出前確認', '書類提出前に上長へ確認する場面', '提出先、期限、版数、添付資料、承認状況を確認してから提出します。', '控えとバックアップも保存します。', COMMON_REFERENCES],
  ['書類・記録', '写真台帳の確認', '写真整理を確認する場面', '写真の目的、工種、測点、黒板情報が追えるよう整理します。', '検査で説明できる形にします。', QUALITY_REFERENCES],
  ['書類・記録', '是正記録の共有', '指摘対応を共有する場面', '指摘内容、原因、対応、完了確認、再発防止を記録します。', '重大事項は正式ルートで共有します。', QUALITY_REFERENCES],
  ['若手相談', '質問の仕方', '先輩に確認したい場面', 'ここまでは確認しました。判断に迷う点があるので確認させてください。', '調べたことと迷っている点を分けます。', COMMON_REFERENCES],
  ['若手相談', '優先順位の相談', 'やることが多く混乱している場面', '今日の作業を安全・品質・工程・書類に分けて、優先順位を確認したいです。', '期限と影響が大きいものから整理します。', COMMON_REFERENCES],
  ['若手相談', '体調不良の申告', '体調が悪い時に伝える場面', '体調が悪いため、作業内容と安全配置について相談させてください。', '無理をして危険作業を続けません。', SAFETY_REFERENCES],
  ['若手相談', '振り返り', '作業後に学びを残す場面', '今日迷った点と次回確認する点をメモして、同じミスを防ぎます。', '責めるより仕組みを見直します。', COMMON_REFERENCES],
  ['若手相談', '新人への声かけ', '後輩に作業を教える場面', 'まず目的と危険ポイントを共有して、見本を見せてから一緒に確認します。', '資格作業は任せる範囲に注意します。', SAFETY_REFERENCES],
] as const;

const generatedTalkScripts: TalkScript[] = talkTopics.map((topic, index) => ({
  id: `tx${String(index + 1).padStart(3, '0')}`,
  category: topic[0],
  title: topic[1],
  situation: topic[2],
  dialogues: [
    { speaker: 'field', text: topic[3] },
    { speaker: 'counterpart', text: '具体的には何を確認しますか？' },
    { speaker: 'field', text: topic[4] },
    { speaker: 'counterpart', text: '分かりました。記録と共有もお願いします。' },
  ],
  references: topic[5],
  sourceNote: CONTENT_SOURCE_NOTE,
}));

export const talkScripts: TalkScript[] = [
  ...baseTalkScripts,
  ...generatedTalkScripts,
];

export function getTalksByCategory(category: string): TalkScript[] {
  return talkScripts.filter((talk) => talk.category === category);
}

export function getTalkCategories(): string[] {
  return [...new Set(talkScripts.map((talk) => talk.category))];
}

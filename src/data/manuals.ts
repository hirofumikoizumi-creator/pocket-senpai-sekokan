import { Manual } from '../types';
import {
  COMMON_REFERENCES,
  CONTENT_SOURCE_NOTE,
  DOCUMENT_REFERENCES,
  PROCESS_REFERENCES,
  QUALITY_REFERENCES,
  SAFETY_REFERENCES,
} from './references';

const baseManuals: Manual[] = [
  {
    id: 'm001',
    category: '安全管理',
    title: '朝礼・KYの確認ポイント',
    overview:
      '当日の作業内容、危険ポイント、役割分担を整理するための学習資料です。安全判断は現場責任者・有資格者の指示を優先します。',
    steps: [
      { order: 1, title: '作業内容を確認', description: '工程表、作業指示、施工計画書から当日の作業範囲を確認する' },
      { order: 2, title: '危険源を洗い出す', description: '墜落、重機接触、飛来落下、感電、酸欠、土砂崩壊などを作業ごとに確認する' },
      { order: 3, title: '対策を共有', description: '立入禁止、合図者、保護具、作業手順、退避場所を具体的に共有する' },
      { order: 4, title: '体調と資格を確認', description: '体調不良者、必要資格、特別教育、作業主任者の配置を確認する' },
      { order: 5, title: '記録を残す', description: 'KY用紙、朝礼記録、写真などを現場ルールに沿って残す' },
    ],
    tips: [
      '危険を「場所」「作業」「人の動き」に分けて見る',
      '抽象的な注意ではなく、今日の作業に合わせた対策にする',
      '疑問がある作業は開始前に止めて確認する',
    ],
    cautions: [
      '危険作業の継続可否をアプリ情報だけで判断しない',
      '緊急時は現場ルールと監督者・救急連絡体制に従う',
    ],
    references: SAFETY_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  },
  {
    id: 'm002',
    category: '品質管理',
    title: '出来形・写真管理の基本',
    overview:
      '出来形確認と工事写真を漏れなく残すための学習資料です。検査基準や判定は設計図書・仕様書・監督員指示を確認します。',
    steps: [
      { order: 1, title: '管理項目を確認', description: '設計図書、仕様書、施工計画書から寸法・数量・測点・頻度を確認する' },
      { order: 2, title: '撮影タイミングを決める', description: '施工前、施工中、不可視部、完成後など、後から確認できない場面を押さえる' },
      { order: 3, title: '黒板情報を整える', description: '工種、測点、設計値、実測値、日付、立会者などを現場ルールに沿って記載する' },
      { order: 4, title: '実測値を記録', description: '測定者、測定器、測定位置が後で追えるように記録する' },
      { order: 5, title: '早めに整理', description: '写真と出来形表をこまめに照合し、撮り漏れを当日中に確認する' },
    ],
    tips: [
      '不可視部は「後で撮れない」を基準に先回りする',
      '設計値と実測値を同じ画面・記録で追えるようにする',
      '迷った写真は削らず、監督者に確認して整理する',
    ],
    cautions: [
      '合否判定や規格値の解釈は仕様書・監督者確認を優先する',
      '写真の改ざんや事実と異なる記録は絶対に行わない',
    ],
    references: QUALITY_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  },
  {
    id: 'm003',
    category: '工程管理',
    title: '週間工程の組み立て方',
    overview:
      '作業順序、資機材、人員、天候リスクを整理するための学習資料です。契約工期や工程変更は関係者合意を前提に確認します。',
    steps: [
      { order: 1, title: '前提を集める', description: '全体工程、週間工程、資材納期、協力会社予定、天候予報を確認する' },
      { order: 2, title: '制約を見つける', description: '先行作業、養生期間、立会、搬入制限、近隣条件などを洗い出す' },
      { order: 3, title: '作業順序を調整', description: '安全・品質に影響する無理な同時作業がないか確認する' },
      { order: 4, title: '関係者に共有', description: '職長、協力会社、発注者・監督員への共有事項を整理する' },
      { order: 5, title: '変更を記録', description: '変更理由、影響範囲、合意内容をメモや議事録に残す' },
    ],
    tips: [
      '工程は作業名だけでなく、準備と片付けまで含めて考える',
      '天候で止まりやすい作業を先に見える化する',
      '「誰にいつ確認するか」を工程に入れる',
    ],
    cautions: [
      '安全対策や養生期間を削って工程短縮しない',
      '契約・発注者協議に関わる変更は必ず上長へ確認する',
    ],
    references: PROCESS_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  },
  {
    id: 'm004',
    category: '施工計画',
    title: '施工計画書の読み方',
    overview:
      '新人・若手が施工計画書から現場で見るべき点を整理するための資料です。正式な計画変更は承認ルートに従います。',
    steps: [
      { order: 1, title: '適用範囲を確認', description: 'どの工種・区間・作業条件に適用される計画か確認する' },
      { order: 2, title: '手順を追う', description: '準備、施工、検査、片付けまでの流れを現場の動きに置き換える' },
      { order: 3, title: '管理基準を見る', description: '品質、出来形、写真、安全、環境の管理項目を拾い出す' },
      { order: 4, title: '必要な人と機械を確認', description: '資格者、作業主任者、重機、仮設、測定器の要否を確認する' },
      { order: 5, title: '不一致を共有', description: '現場条件と計画書が違う点は、作業前に監督者へ共有する' },
    ],
    tips: [
      '計画書は「現場で何を確認するか」に変換して読む',
      '管理項目はチェックリスト化すると抜けにくい',
      '図面、仕様書、計画書をセットで見る',
    ],
    cautions: [
      '承認済み計画と違う施工を自己判断で進めない',
      '仮設・重機・安全設備の変更は有資格者・監督者へ確認する',
    ],
    references: DOCUMENT_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  },
  {
    id: 'm005',
    category: '関係者調整',
    title: '職長・発注者への報告の型',
    overview:
      '現場で起きたことを短く正確に伝えるための学習資料です。契約・法令・安全判断は責任者へつなぎます。',
    steps: [
      { order: 1, title: '事実を先に言う', description: 'いつ、どこで、何が起きたかを主観と分けて伝える' },
      { order: 2, title: '影響を整理', description: '安全、品質、工程、コスト、近隣への影響を分ける' },
      { order: 3, title: '確認した根拠を添える', description: '図面番号、仕様書、写真、測定値、議事録などを添える' },
      { order: 4, title: '相談事項を一つに絞る', description: '判断してほしいこと、確認してほしいことを明確にする' },
      { order: 5, title: '決定事項を残す', description: '誰が、いつ、何を決めたかを記録する' },
    ],
    tips: [
      '「事実」「影響」「相談」を分ける',
      '写真や図面番号があると話が早い',
      '結論を急がず、確認が必要な点を明確にする',
    ],
    cautions: [
      '契約・追加費用・工期変更を独断で約束しない',
      '重大な安全・品質問題を口頭だけで終わらせない',
    ],
    references: COMMON_REFERENCES,
    sourceNote: CONTENT_SOURCE_NOTE,
  },
];

const manualTopics = [
  { category: '安全管理', title: '高所作業前の確認', focus: '墜落災害を防ぐため、足場・開口部・保護具を作業前に確認します。', refs: SAFETY_REFERENCES },
  { category: '安全管理', title: '重機作業の立入管理', focus: '重機の旋回範囲、合図者、歩行者動線を分けて整理します。', refs: SAFETY_REFERENCES },
  { category: '安全管理', title: '熱中症対策の進め方', focus: 'WBGT、休憩、飲料、体調確認、緊急時対応をセットで確認します。', refs: SAFETY_REFERENCES },
  { category: '安全管理', title: '仮設電気と感電防止', focus: '漏電遮断器、コード損傷、雨天養生、有資格作業の範囲を確認します。', refs: SAFETY_REFERENCES },
  { category: '安全管理', title: '酸欠・閉所作業の入口確認', focus: '測定、換気、監視、救助体制を作業前に確認します。', refs: SAFETY_REFERENCES },
  { category: '品質管理', title: '材料受入の基本', focus: '承認材料と納品物の規格、数量、ロット、保管状態を照合します。', refs: QUALITY_REFERENCES },
  { category: '品質管理', title: 'コンクリート打設前チェック', focus: '配合、型枠、配筋、受入試験、打設計画、養生を確認します。', refs: QUALITY_REFERENCES },
  { category: '品質管理', title: '鉄筋・かぶり確認', focus: '径、本数、間隔、継手、定着、かぶりを図面と照合します。', refs: QUALITY_REFERENCES },
  { category: '品質管理', title: '防水施工の確認', focus: '下地、端部、貫通部、重ね代、天候条件を重点確認します。', refs: QUALITY_REFERENCES },
  { category: '品質管理', title: '測量・墨出しの確認', focus: '基準点、通り芯、レベル、測定記録、再確認者を残します。', refs: QUALITY_REFERENCES },
  { category: '工程管理', title: '搬入遅延時の整理', focus: '遅延理由、代替作業、後続影響、連絡先を整理します。', refs: PROCESS_REFERENCES },
  { category: '工程管理', title: '雨天時工程の組替え', focus: '止める作業、進める作業、品質影響、養生を分けて確認します。', refs: PROCESS_REFERENCES },
  { category: '工程管理', title: '職種間干渉の調整', focus: '同時作業の範囲、時間帯、動線、資材置場を調整します。', refs: PROCESS_REFERENCES },
  { category: '工程管理', title: '検査待ち工程の扱い', focus: '承認前に隠れる作業を止め、準備作業を切り分けます。', refs: PROCESS_REFERENCES },
  { category: '工程管理', title: '工程会議の準備', focus: '進捗、遅れ、制約、決めたい事項、代替案を準備します。', refs: PROCESS_REFERENCES },
  { category: '書類・記録', title: '日報の残し方', focus: '作業実績、人数、機械、天候、写真番号、特記事項を残します。', refs: DOCUMENT_REFERENCES },
  { category: '書類・記録', title: '議事録のまとめ方', focus: '決定事項、宿題、担当、期限、次回確認を分けます。', refs: DOCUMENT_REFERENCES },
  { category: '書類・記録', title: '写真台帳の整理', focus: '写真の目的、工種、測点、黒板情報を後から追えるようにします。', refs: DOCUMENT_REFERENCES },
  { category: '書類・記録', title: '是正記録の作り方', focus: '指摘、原因、対応、完了確認、再発防止を一連で残します。', refs: DOCUMENT_REFERENCES },
  { category: '書類・記録', title: '提出前チェック', focus: '提出先、期限、版数、添付資料、承認状況を確認します。', refs: DOCUMENT_REFERENCES },
  { category: '環境・近隣', title: '騒音・振動の近隣対応', focus: '作業時間、周知、測定、苦情連絡ルートを確認します。', refs: COMMON_REFERENCES },
  { category: '環境・近隣', title: '粉じん対策', focus: '散水、集じん、養生、清掃、保護具を確認します。', refs: COMMON_REFERENCES },
  { category: '環境・近隣', title: '産廃分別と搬出', focus: '分別、保管、委託契約、マニフェスト、搬出写真を確認します。', refs: COMMON_REFERENCES },
  { category: '環境・近隣', title: '濁水・排水管理', focus: '沈砂、排水経路、流出防止、降雨時対応を確認します。', refs: COMMON_REFERENCES },
  { category: '環境・近隣', title: '道路使用時の確認', focus: '許可条件、誘導員、掲示、歩行者動線、復旧を確認します。', refs: COMMON_REFERENCES },
  { category: '関係者調整', title: '追加作業の相談', focus: '追加理由、範囲、根拠、写真、指示者を整理します。', refs: COMMON_REFERENCES },
  { category: '関係者調整', title: '協力会社への依頼', focus: '依頼範囲、必要資格、施工条件、納期を明確にします。', refs: COMMON_REFERENCES },
  { category: '関係者調整', title: '出来高確認', focus: '実績数量と写真・日報・検査記録を照合します。', refs: COMMON_REFERENCES },
  { category: '関係者調整', title: 'ミス報告の型', focus: '隠さず、事実・影響・対応案を早く共有します。', refs: COMMON_REFERENCES },
  { category: '関係者調整', title: '新人OJTの進め方', focus: '目的、手順、見本、任せる範囲、確認タイミングを決めます。', refs: COMMON_REFERENCES },
  { category: '試験学習', title: '経験記述の組み立て', focus: '工事概要、課題、対策、結果を型で整理します。', refs: COMMON_REFERENCES },
  { category: '試験学習', title: '法規学習の進め方', focus: '現場場面と法令の目的を結びつけて覚えます。', refs: COMMON_REFERENCES },
  { category: '試験学習', title: '過去問復習の型', focus: '正解暗記ではなく、間違えた理由と関連用語を残します。', refs: COMMON_REFERENCES },
  { category: '試験学習', title: '施工法の整理', focus: '手順、管理項目、危険源、写真ポイントをセットで覚えます。', refs: COMMON_REFERENCES },
  { category: '試験学習', title: '学習計画の立て方', focus: '残り期間、弱点分野、復習間隔を見える化します。', refs: COMMON_REFERENCES },
  { category: '施工計画', title: '施工計画と現場条件の差異', focus: '計画書と実際の現場条件の違いを作業前に共有します。', refs: DOCUMENT_REFERENCES },
  { category: '施工計画', title: '作業手順書の読み方', focus: '準備、施工、検査、片付け、禁止事項を現場動作に置き換えます。', refs: DOCUMENT_REFERENCES },
  { category: '施工計画', title: '仮設計画の確認', focus: '仮設範囲、荷重、動線、点検、撤去手順を確認します。', refs: SAFETY_REFERENCES },
  { category: '施工計画', title: '施工前打合せの準備', focus: '作業範囲、管理基準、安全対策、役割分担をそろえます。', refs: DOCUMENT_REFERENCES },
  { category: '施工計画', title: '変更時の周知', focus: '変更理由、影響範囲、承認状況、周知先を整理します。', refs: DOCUMENT_REFERENCES },
  { category: '検査対応', title: '中間検査の準備', focus: '検査対象、記録、写真、立会者、保留事項を整理します。', refs: QUALITY_REFERENCES },
  { category: '検査対応', title: '完成検査前の確認', focus: '指摘予防、書類、写真、是正状況、清掃を確認します。', refs: QUALITY_REFERENCES },
  { category: '検査対応', title: '指摘事項の管理', focus: '指摘、担当、期限、完了写真、再確認を一覧化します。', refs: QUALITY_REFERENCES },
  { category: '検査対応', title: '立会時の説明', focus: '根拠資料、写真、測定値、判断待ち事項を準備します。', refs: QUALITY_REFERENCES },
  { category: '検査対応', title: '引渡し前の記録整理', focus: '完成図書、写真、試験成績、保証書、取扱説明を確認します。', refs: DOCUMENT_REFERENCES },
];

const generatedManuals: Manual[] = manualTopics.map((topic, index) => ({
  id: `mx${String(index + 1).padStart(3, '0')}`,
  category: topic.category,
  title: topic.title,
  overview: `${topic.focus}本資料は学習用の確認観点であり、現場判断は設計図書・仕様書・監督者指示を優先します。`,
  steps: [
    { order: 1, title: '目的を確認', description: 'この確認で防ぎたい安全・品質・工程・記録上のリスクを言葉にする' },
    { order: 2, title: '根拠資料をそろえる', description: '設計図書、仕様書、施工計画書、写真、日報、指示記録などを確認する' },
    { order: 3, title: '現物を見る', description: '机上の情報だけでなく、現場の状態、作業範囲、人の動き、資機材を確認する' },
    { order: 4, title: '関係者へ共有', description: '職長、協力会社、上長、監督者に、事実・影響・相談事項を分けて伝える' },
    { order: 5, title: '記録に残す', description: '確認日、確認者、写真番号、判断者、次の対応を後から追える形で残す' },
  ],
  tips: [
    '「何を防ぐ確認か」を先に決める',
    '写真・図面番号・測定値をセットで残す',
    '迷う内容は早めに監督者・上長へ相談する',
  ],
  cautions: [
    '最終判断をアプリ情報だけで行わない',
    '法令、設計図書、仕様書、会社ルール、発注者指示を優先する',
  ],
  references: topic.refs,
  sourceNote: CONTENT_SOURCE_NOTE,
}));

export const manuals: Manual[] = [
  ...baseManuals,
  ...generatedManuals,
];

export function getManualsByCategory(category: string): Manual[] {
  return manuals.filter((manual) => manual.category === category);
}

export function getManualCategories(): string[] {
  return [...new Set(manuals.map((manual) => manual.category))];
}

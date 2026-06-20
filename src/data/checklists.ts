import { ChecklistCategory } from '../types';

export const checklistData: ChecklistCategory[] = [
  {
    id: 'cl001',
    title: '朝の現場準備',
    icon: 'clipboard-check-outline',
    items: [
      { id: 'cl001-1', text: '当日の作業範囲と立入禁止範囲を確認', checked: false },
      { id: 'cl001-2', text: 'KY・朝礼で危険ポイントと対策を共有', checked: false },
      { id: 'cl001-3', text: '必要資格者・作業主任者・合図者の配置を確認', checked: false },
      { id: 'cl001-4', text: '不明点を現場責任者または先輩へ確認', checked: false },
    ],
  },
  {
    id: 'cl002',
    title: '安全確認',
    icon: 'shield-check-outline',
    items: [
      { id: 'cl002-1', text: '墜落・重機接触・飛来落下・感電などの危険源を確認', checked: false },
      { id: 'cl002-2', text: '保護具、立入禁止、手すり、開口部養生を確認', checked: false },
      { id: 'cl002-3', text: '危険を感じた作業は開始前に止めて確認', checked: false },
      { id: 'cl002-4', text: '事故・ヒヤリハットの報告ルートを確認', checked: false },
    ],
  },
  {
    id: 'cl003',
    title: '品質・写真',
    icon: 'camera-outline',
    items: [
      { id: 'cl003-1', text: '出来形管理項目と測定頻度を確認', checked: false },
      { id: 'cl003-2', text: '不可視部の撮影タイミングを確認', checked: false },
      { id: 'cl003-3', text: '黒板情報、設計値、実測値を確認', checked: false },
      { id: 'cl003-4', text: '写真と記録を当日中に整理', checked: false },
    ],
  },
  {
    id: 'cl004',
    title: '工程・調整',
    icon: 'calendar-check-outline',
    items: [
      { id: 'cl004-1', text: '先行作業、搬入、立会、天候リスクを確認', checked: false },
      { id: 'cl004-2', text: '職長・協力会社への共有事項を整理', checked: false },
      { id: 'cl004-3', text: '工程変更の理由と影響を記録', checked: false },
      { id: 'cl004-4', text: '契約・工期に関わる内容は上長へ確認', checked: false },
    ],
  },
];

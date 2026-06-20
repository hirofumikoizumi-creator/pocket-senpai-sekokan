import { Quiz } from '../types';

export const quizData: Quiz[] = [
  {
    id: 'q001',
    category: '安全ルール',
    question: '本アプリで扱わない内容はどれですか？',
    options: ['KYの整理', '写真管理の学習', '構造安全や施工可否の最終判断', '報告文の組み立て練習'],
    correctIndex: 2,
    explanation:
      '構造安全、施工可否、法令適合、事故対応などの最終判断は本アプリでは扱いません。監督者・有資格者・現場ルールに従います。',
  },
  {
    id: 'q002',
    category: '安全ルール',
    question: '危険を感じた作業を始める前の行動として最も安全なのはどれですか？',
    options: ['急いで進める', '作業を止めて監督者へ確認する', 'あとで日報に書く', '周りに言わず様子を見る'],
    correctIndex: 1,
    explanation:
      '危険を感じた場合は、作業開始前に止めて確認することが大切です。緊急時は現場の報告ルートに従います。',
  },
  {
    id: 'q003',
    category: '品質管理',
    question: '不可視部の写真管理で意識することはどれですか？',
    options: ['完成後にまとめて撮る', '後から確認できない場面を先に撮る', '黒板情報は不要', '実測値は記録しない'],
    correctIndex: 1,
    explanation:
      '埋戻しや隠ぺい後に確認できない箇所は、施工中に写真と記録を残します。',
  },
  {
    id: 'q004',
    category: '工程管理',
    question: '工程変更を共有するときに分けるとよい項目はどれですか？',
    options: ['気分と印象', '事実・影響・相談事項', '言い訳だけ', '担当者名だけ'],
    correctIndex: 1,
    explanation:
      '事実、工程・安全・品質への影響、判断してほしい相談事項を分けると、関係者が判断しやすくなります。',
  },
  {
    id: 'q005',
    category: '書類・記録',
    question: '記録で大切な考え方はどれですか？',
    options: ['後から経緯を追えるようにする', '口頭だけで済ませる', '日付を省く', '都合の悪い写真を改ざんする'],
    correctIndex: 0,
    explanation:
      '記録は、誰が、いつ、何を確認・決定したかを後から追えるように残します。改ざんは絶対に行いません。',
  },
  {
    id: 'q006',
    category: '試験学習',
    question: '施工管理技士の経験記述で整理しやすい型はどれですか？',
    options: ['工事概要・課題・対策・結果', '好きな作業だけ', '暗記した用語だけ', '感想だけ'],
    correctIndex: 0,
    explanation:
      '経験記述は、工事概要、課題、具体的対策、結果を整理すると書きやすくなります。最新の試験情報は公式情報で確認してください。',
  },
];

export function getQuizzesByCategory(category: string): Quiz[] {
  return quizData.filter((quiz) => quiz.category === category);
}

export function getQuizCategories(): string[] {
  return [...new Set(quizData.map((quiz) => quiz.category))];
}

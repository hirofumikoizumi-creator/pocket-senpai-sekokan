/**
 * ポケット先輩 テーマ定数
 * ミントグリーン系・白基調・女性向け優しいUI
 */

export const COLORS = {
  primary: '#4ECDC4',        // ミントグリーン
  primaryLight: '#A8E6CF',   // ライトミント
  primaryDark: '#2BAD9F',    // ダークミント
  secondary: '#FF6B9D',      // ピンクアクセント
  background: '#FAFFFE',     // ほぼ白の背景
  surface: '#FFFFFF',        // カード背景
  surfaceLight: '#F0FDF9',   // 薄いミント背景
  text: '#2D3748',           // メインテキスト
  textSecondary: '#718096',  // サブテキスト
  textLight: '#A0AEC0',      // 薄いテキスト
  border: '#E2E8F0',         // ボーダー
  success: '#48BB78',        // 成功
  warning: '#F6AD55',        // 警告
  error: '#FC8181',          // エラー
  white: '#FFFFFF',
  black: '#1A202C',
  cardShadow: 'rgba(0, 0, 0, 0.05)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  title: 26,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
};

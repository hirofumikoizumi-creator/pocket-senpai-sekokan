import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } from '../utils/theme';

/**
 * バナー広告コンポーネント
 * 
 * 本番環境では react-native-google-mobile-ads の BannerAd を使用。
 * 開発時はプレースホルダーを表示。
 * 
 * 本番実装時:
 * import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
 * 
 * const adUnitId = __DEV__
 *   ? TestIds.BANNER
 *   : Platform.OS === 'ios'
 *     ? 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY'
 *     : 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ';
 */

interface AdBannerProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
  style?: object;
}

export function AdBanner({ size = 'banner', style }: AdBannerProps) {
  const height = size === 'banner' ? 50 : size === 'largeBanner' ? 100 : 250;

  // 開発時はプレースホルダーを表示
  // 本番時は以下のコメントアウトを解除
  /*
  return (
    <BannerAd
      unitId={adUnitId}
      size={BannerAdSize.BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
  */

  return (
    <View style={[styles.container, { height }, style]}>
      <Text style={styles.text}>Ad Banner ({size})</Text>
    </View>
  );
}

/**
 * インライン広告コンポーネント（記事内に表示）
 */
export function InlineAd({ style }: { style?: object }) {
  return (
    <View style={[styles.inlineContainer, style]}>
      <Text style={styles.inlineLabel}>PR</Text>
      <Text style={styles.text}>インライン広告スペース</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  text: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
  inlineContainer: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginVertical: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  inlineLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    backgroundColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: SPACING.xs,
    overflow: 'hidden',
  },
});

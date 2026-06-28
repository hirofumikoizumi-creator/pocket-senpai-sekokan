import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../utils/theme';
import { useSubscription } from '../hooks/useSubscription';

interface AdBannerProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
  style?: object;
}

function getPlaceholderHeight(size: AdBannerProps['size']) {
  if (size === 'largeBanner') return 100;
  if (size === 'mediumRectangle') return 250;
  return 50;
}

export function AdBanner({ size = 'banner', style }: AdBannerProps) {
  const { isPremium } = useSubscription();
  if (isPremium) return null;

  return (
    <View style={[styles.container, { height: getPlaceholderHeight(size) }, style]}>
      <Text style={styles.text}>広告スペース</Text>
    </View>
  );
}

export function InlineAd({ style }: { style?: object }) {
  return <AdBanner size="mediumRectangle" style={style || styles.inlineContainer} />;
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
});

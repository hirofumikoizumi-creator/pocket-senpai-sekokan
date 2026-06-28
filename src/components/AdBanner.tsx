import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../utils/theme';
import { useSubscription } from '../hooks/useSubscription';

declare const require: any;

interface AdBannerProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
  style?: object;
}

const constants = Constants as any;
const extra = Constants.expoConfig?.extra || constants.manifest2?.extra || {};
const bannerUnitId = String(extra.admobBannerUnitId || 'ca-app-pub-5840457424714744/5895122794');

function getGoogleMobileAds() {
  if (Platform.OS === 'web') return null;

  try {
    const module = require('react-native-google-mobile-ads');
    return module.default ? { ...module, default: module.default } : module;
  } catch (error) {
    console.warn('Google Mobile Ads SDK is unavailable:', error);
    return null;
  }
}

function getBannerSize(size: AdBannerProps['size'], BannerAdSize: any) {
  if (size === 'largeBanner') return BannerAdSize?.LARGE_BANNER || 'LARGE_BANNER';
  if (size === 'mediumRectangle') return BannerAdSize?.MEDIUM_RECTANGLE || 'MEDIUM_RECTANGLE';
  return BannerAdSize?.BANNER || 'BANNER';
}

function getPlaceholderHeight(size: AdBannerProps['size']) {
  if (size === 'largeBanner') return 100;
  if (size === 'mediumRectangle') return 250;
  return 50;
}

export function AdBanner({ size = 'banner', style }: AdBannerProps) {
  const { isPremium } = useSubscription();
  const ads = getGoogleMobileAds();

  if (isPremium) return null;

  const height = getPlaceholderHeight(size);

  if (!ads?.BannerAd) {
    return (
      <View style={[styles.container, { height }, style]}>
        <Text style={styles.text}>広告スペース</Text>
      </View>
    );
  }

  const BannerAd = ads.BannerAd;
  const adSize = getBannerSize(size, ads.BannerAdSize);

  return (
    <View style={[styles.nativeContainer, style]}>
      <BannerAd
        unitId={bannerUnitId}
        size={adSize}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

export function InlineAd({ style }: { style?: object }) {
  return <AdBanner size="mediumRectangle" style={style || styles.inlineContainer} />;
}

const styles = StyleSheet.create({
  nativeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.sm,
  },
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

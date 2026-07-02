import { Platform } from 'react-native';
import Constants from 'expo-constants';

declare const require: any;

const constants = Constants as any;
const extra = Constants.expoConfig?.extra || constants.manifest2?.extra || {};

const interstitialUnitId = String(extra.admobInterstitialUnitId || 'ca-app-pub-5840457424714744/4861664185');
const rewardedUnitId = String(extra.admobRewardedUnitId || 'ca-app-pub-5840457424714744/6250767477');

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

function waitForAdEvent(ad: any, loadedEvent: string, closedEvent: string, earnedEvent?: string): Promise<boolean> {
  return new Promise((resolve) => {
    let loaded = false;
    let earned = !earnedEvent;
    let finished = false;
    const unsubscribers: (() => void)[] = [];

    const cleanup = () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };

    const finish = (result: boolean) => {
      if (finished) return;
      finished = true;
      cleanup();
      resolve(result);
    };

    unsubscribers.push(ad.addAdEventListener(loadedEvent, () => {
      loaded = true;
      ad.show();
    }));

    if (earnedEvent) {
      unsubscribers.push(ad.addAdEventListener(earnedEvent, () => {
        earned = true;
      }));
    }

    unsubscribers.push(ad.addAdEventListener(closedEvent, () => {
      finish(loaded && earned);
    }));

    ad.load();

    setTimeout(() => finish(false), 15000);
  });
}

export async function showInterstitialAd(): Promise<boolean> {
  const ads = getGoogleMobileAds();
  if (!ads?.InterstitialAd || !ads?.AdEventType) return false;

  const interstitialAd = ads.InterstitialAd.createForAdRequest(interstitialUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  return waitForAdEvent(interstitialAd, ads.AdEventType.LOADED, ads.AdEventType.CLOSED);
}

export async function showRewardedAd(): Promise<boolean> {
  const ads = getGoogleMobileAds();
  if (!ads?.RewardedAd || !ads?.AdEventType || !ads?.RewardedAdEventType) return false;

  const rewardedAd = ads.RewardedAd.createForAdRequest(rewardedUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  return waitForAdEvent(
    rewardedAd,
    ads.RewardedAdEventType.LOADED,
    ads.AdEventType.CLOSED,
    ads.RewardedAdEventType.EARNED_REWARD
  );
}

import { Platform } from 'react-native';
import Constants from 'expo-constants';

declare const require: any;

const constants = Constants as any;
const extra = Constants.expoConfig?.extra || constants.manifest2?.extra || {};

const interstitialUnitId = String(extra.admobInterstitialUnitId || 'ca-app-pub-5840457424714744/4861664185');
const rewardedUnitId = String(extra.admobRewardedUnitId || 'ca-app-pub-5840457424714744/6250767477');
const requestOptions = { requestNonPersonalizedAdsOnly: true };

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

export function showInterstitialAd(): Promise<boolean> {
  const ads = getGoogleMobileAds();
  if (!ads?.InterstitialAd || !ads?.AdEventType) return Promise.resolve(false);

  return new Promise((resolve) => {
    let settled = false;
    const interstitial = ads.InterstitialAd.createForAdRequest(interstitialUnitId, requestOptions);
    const cleanup: Array<() => void> = [];

    const finish = (shown: boolean) => {
      if (settled) return;
      settled = true;
      cleanup.forEach(unsubscribe => unsubscribe());
      resolve(shown);
    };

    cleanup.push(interstitial.addAdEventListener(ads.AdEventType.LOADED, () => {
      interstitial.show();
    }));
    cleanup.push(interstitial.addAdEventListener(ads.AdEventType.CLOSED, () => finish(true)));
    cleanup.push(interstitial.addAdEventListener(ads.AdEventType.ERROR, () => finish(false)));

    setTimeout(() => finish(false), 8000);
    interstitial.load();
  });
}

export function showRewardedAd(): Promise<boolean> {
  const ads = getGoogleMobileAds();
  if (!ads?.RewardedAd || !ads?.AdEventType || !ads?.RewardedAdEventType) {
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    let earnedReward = false;
    let settled = false;
    const rewarded = ads.RewardedAd.createForAdRequest(rewardedUnitId, requestOptions);
    const cleanup: Array<() => void> = [];

    const finish = () => {
      if (settled) return;
      settled = true;
      cleanup.forEach(unsubscribe => unsubscribe());
      resolve(earnedReward);
    };

    cleanup.push(rewarded.addAdEventListener(ads.RewardedAdEventType.LOADED, () => {
      rewarded.show();
    }));
    cleanup.push(rewarded.addAdEventListener(ads.RewardedAdEventType.EARNED_REWARD, () => {
      earnedReward = true;
    }));
    cleanup.push(rewarded.addAdEventListener(ads.AdEventType.CLOSED, finish));
    cleanup.push(rewarded.addAdEventListener(ads.AdEventType.ERROR, finish));

    setTimeout(finish, 12000);
    rewarded.load();
  });
}

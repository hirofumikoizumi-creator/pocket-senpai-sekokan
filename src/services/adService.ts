/**
 * 広告サービス
 * 
 * AdMob広告の管理を行うサービス層。
 * 開発時はダミー実装、本番時にAdMob SDKを使用。
 * 
 * 本番実装時:
 * import {
 *   InterstitialAd,
 *   RewardedAd,
 *   AppOpenAd,
 *   TestIds,
 *   AdEventType,
 *   RewardedAdEventType,
 * } from 'react-native-google-mobile-ads';
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_APP_OPEN_AD_KEY = '@pocket_senpai_last_app_open_ad';
const DAILY_CONSULTATION_COUNT_KEY = '@pocket_senpai_daily_consultation';
const FREE_CONSULTATIONS_PER_DAY = 5;

/**
 * 起動時広告を表示（1日1回まで）
 */
export async function showAppOpenAd(): Promise<boolean> {
  try {
    const lastShown = await AsyncStorage.getItem(LAST_APP_OPEN_AD_KEY);
    const today = new Date().toDateString();

    if (lastShown === today) {
      return false; // 今日は既に表示済み
    }

    // 本番時: AppOpenAd を表示
    // const appOpenAd = AppOpenAd.createForAdRequest(adUnitId);
    // await appOpenAd.load();
    // await appOpenAd.show();

    await AsyncStorage.setItem(LAST_APP_OPEN_AD_KEY, today);
    console.log('[Ad] App open ad shown (placeholder)');
    return true;
  } catch (error) {
    console.error('[Ad] Failed to show app open ad:', error);
    return false;
  }
}

/**
 * リワード広告を表示（クイズ追加解説用）
 */
export async function showRewardedAd(): Promise<boolean> {
  try {
    // 本番時:
    // const rewardedAd = RewardedAd.createForAdRequest(adUnitId);
    // await rewardedAd.load();
    // const result = await rewardedAd.show();
    // return result.type === RewardedAdEventType.EARNED_REWARD;

    console.log('[Ad] Rewarded ad shown (placeholder)');
    return true; // 開発時は常にリワード付与
  } catch (error) {
    console.error('[Ad] Failed to show rewarded ad:', error);
    return false;
  }
}

/**
 * AI相談の利用回数を管理
 * 将来的に「動画広告を見ると追加相談可能」な構造
 */
export async function getConsultationCount(): Promise<number> {
  try {
    const data = await AsyncStorage.getItem(DAILY_CONSULTATION_COUNT_KEY);
    if (!data) return 0;

    const { count, date } = JSON.parse(data);
    const today = new Date().toDateString();

    if (date !== today) {
      // 日付が変わったらリセット
      await AsyncStorage.setItem(
        DAILY_CONSULTATION_COUNT_KEY,
        JSON.stringify({ count: 0, date: today })
      );
      return 0;
    }

    return count;
  } catch {
    return 0;
  }
}

export async function incrementConsultationCount(): Promise<void> {
  try {
    const today = new Date().toDateString();
    const current = await getConsultationCount();
    await AsyncStorage.setItem(
      DAILY_CONSULTATION_COUNT_KEY,
      JSON.stringify({ count: current + 1, date: today })
    );
  } catch (error) {
    console.error('[Ad] Failed to increment consultation count:', error);
  }
}

export async function canUseConsultation(): Promise<boolean> {
  const count = await getConsultationCount();
  return count < FREE_CONSULTATIONS_PER_DAY;
}

export function getFreeConsultationsPerDay(): number {
  return FREE_CONSULTATIONS_PER_DAY;
}

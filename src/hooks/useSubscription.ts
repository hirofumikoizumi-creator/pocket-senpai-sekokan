import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getRevenueCatStatus,
  isRevenueCatAvailable,
  purchasePremium,
  restorePremium,
} from '../services/revenueCat';

const SUBSCRIPTION_KEY = '@pocket_senpai_subscription';

type SubscriptionState = {
  isPremium: boolean;
  source: 'free' | 'store' | 'development';
  isRevenueCatConfigured: boolean;
};

const DEFAULT_STATE: SubscriptionState = {
  isPremium: false,
  source: 'free',
  isRevenueCatConfigured: false,
};

function getFallbackState(savedState: SubscriptionState, isRevenueCatConfigured: boolean): SubscriptionState {
  if (savedState.source === 'development' && savedState.isPremium) {
    return {
      isPremium: true,
      source: 'development',
      isRevenueCatConfigured,
    };
  }

  return {
    ...DEFAULT_STATE,
    isRevenueCatConfigured,
  };
}

export function useSubscription() {
  const [state, setState] = useState<SubscriptionState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      const saved = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      const savedState = saved ? JSON.parse(saved) as SubscriptionState : DEFAULT_STATE;

      if (!isRevenueCatAvailable()) {
        const nextState = getFallbackState(savedState, false);
        setState(nextState);
        await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(nextState));
        return;
      }

      const revenueCatStatus = await getRevenueCatStatus();
      const nextState: SubscriptionState = revenueCatStatus.isPremium
        ? { isPremium: true, source: 'store', isRevenueCatConfigured: revenueCatStatus.isConfigured }
        : getFallbackState(savedState, revenueCatStatus.isConfigured);

      setState(nextState);
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(nextState));
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
      const saved = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
      const savedState = saved ? JSON.parse(saved) as SubscriptionState : DEFAULT_STATE;
      setState(getFallbackState(savedState, false));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  const buyPremium = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await purchasePremium();
      const nextState: SubscriptionState = {
        isPremium: result.isPremium,
        source: result.isPremium ? 'store' : 'free',
        isRevenueCatConfigured: true,
      };
      setState(nextState);
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(nextState));
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const restoreSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await restorePremium();
      const nextState: SubscriptionState = {
        isPremium: result.isPremium,
        source: result.isPremium ? 'store' : 'free',
        isRevenueCatConfigured: true,
      };
      setState(nextState);
      await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(nextState));
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setDevelopmentPremium = useCallback(async (enabled: boolean) => {
    const nextState: SubscriptionState = enabled
      ? { isPremium: true, source: 'development', isRevenueCatConfigured: state.isRevenueCatConfigured }
      : { ...DEFAULT_STATE, isRevenueCatConfigured: state.isRevenueCatConfigured };
    setState(nextState);
    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(nextState));
  }, [state.isRevenueCatConfigured]);

  return {
    isPremium: state.isPremium,
    subscriptionSource: state.source,
    isRevenueCatConfigured: state.isRevenueCatConfigured,
    isLoading,
    refreshSubscription,
    buyPremium,
    restoreSubscription,
    setDevelopmentPremium,
  };
}

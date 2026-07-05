import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const todayKey = () => new Date().toISOString().slice(0, 10);

export function useDailyLimit(storageKey: string, limit: number, disabled = false) {
  const [used, setUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadUsage = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(storageKey);
      if (!saved) {
        setUsed(0);
        return;
      }

      const parsed = JSON.parse(saved) as { date: string; used: number };
      setUsed(parsed.date === todayKey() ? parsed.used : 0);
    } catch (error) {
      console.error('Failed to load daily usage:', error);
      setUsed(0);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    void Promise.resolve().then(loadUsage);
  }, [loadUsage]);

  const increment = useCallback(async () => {
    if (disabled) return;
    const nextUsed = used + 1;
    setUsed(nextUsed);
    await AsyncStorage.setItem(storageKey, JSON.stringify({ date: todayKey(), used: nextUsed }));
  }, [disabled, storageKey, used]);

  const grantExtraUse = useCallback(async (amount = 1) => {
    if (disabled) return;
    const nextUsed = Math.max(used - amount, 0);
    setUsed(nextUsed);
    await AsyncStorage.setItem(storageKey, JSON.stringify({ date: todayKey(), used: nextUsed }));
  }, [disabled, storageKey, used]);

  const remaining = disabled ? Infinity : Math.max(limit - used, 0);

  return {
    used,
    remaining,
    limit,
    isLoading,
    canUse: disabled || remaining > 0,
    increment,
    grantExtraUse,
    refreshUsage: loadUsage,
  };
}

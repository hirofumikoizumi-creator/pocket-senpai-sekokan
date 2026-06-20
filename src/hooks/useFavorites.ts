import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteItem } from '../types';

const FAVORITES_KEY = '@pocket_senpai_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(FAVORITES_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFavorites();
  }, [loadFavorites]);

  const addFavorite = useCallback(async (item: Omit<FavoriteItem, 'savedAt'>) => {
    try {
      const newItem: FavoriteItem = {
        ...item,
        savedAt: new Date().toISOString(),
      };
      const updated = [newItem, ...favorites.filter(f => f.id !== item.id)];
      setFavorites(updated);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to add favorite:', error);
    }
  }, [favorites]);

  const removeFavorite = useCallback(async (id: string) => {
    try {
      const updated = favorites.filter(f => f.id !== id);
      setFavorites(updated);
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  }, [favorites]);

  const isFavorite = useCallback((id: string) => {
    return favorites.some(f => f.id === id);
  }, [favorites]);

  const toggleFavorite = useCallback(async (item: Omit<FavoriteItem, 'savedAt'>) => {
    if (isFavorite(item.id)) {
      await removeFavorite(item.id);
    } else {
      await addFavorite(item);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    refreshFavorites: loadFavorites,
  };
}

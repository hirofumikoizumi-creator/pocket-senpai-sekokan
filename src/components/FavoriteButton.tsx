import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FavoriteItem } from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { useSubscription } from '../hooks/useSubscription';
import { FREE_PLAN_LIMITS } from '../constants/plans';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../utils/theme';

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, 'savedAt'>;
  compact?: boolean;
}

export function FavoriteButton({ item, compact = false }: FavoriteButtonProps) {
  const router = useRouter();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const { isPremium } = useSubscription();
  const active = isFavorite(item.id);

  const handlePress = () => {
    if (!active && !isPremium && favorites.length >= FREE_PLAN_LIMITS.favorites) {
      Alert.alert(
        'お気に入り上限に達しました',
        `無料プランではお気に入り登録は${FREE_PLAN_LIMITS.favorites}件までです。プレミアムでは無制限に保存できます。`,
        [
          { text: 'あとで', style: 'cancel' },
          { text: 'プレミアムを見る', onPress: () => router.push('/premium' as any) },
        ]
      );
      return;
    }

    toggleFavorite(item);
  };

  return (
    <TouchableOpacity
      style={[styles.button, compact && styles.compactButton, active && styles.activeButton]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={active ? 'お気に入りから削除' : 'お気に入り登録'}
    >
      <MaterialCommunityIcons
        name={active ? 'heart' : 'heart-outline'}
        size={compact ? 22 : 18}
        color={active ? COLORS.secondary : COLORS.textSecondary}
      />
      {!compact && (
        <Text style={[styles.text, active && styles.activeText]}>
          {active ? 'お気に入り済み' : 'お気に入り登録'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  compactButton: {
    alignSelf: 'center',
    width: 40,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  activeButton: {
    borderColor: '#FFD1E0',
    backgroundColor: '#FFF5F9',
  },
  text: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeText: {
    color: COLORS.secondary,
  },
});

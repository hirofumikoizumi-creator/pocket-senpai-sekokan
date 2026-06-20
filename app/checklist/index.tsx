import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/utils/theme';
import { checklistData } from '../../src/data/checklists';
import { ChecklistCategory, ChecklistItem } from '../../src/types';
import { Disclaimer } from '../../src/components/Disclaimer';

const STORAGE_KEY = '@pocket_senpai_checklists';

export default function ChecklistScreen() {
  const [categories, setCategories] = useState<ChecklistCategory[]>(checklistData);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadChecklistState = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const savedState = JSON.parse(saved) as Record<string, boolean>;
        const updated = checklistData.map(category => ({
          ...category,
          items: category.items.map(item => ({
            ...item,
            checked: savedState[item.id] || false,
          })),
        }));
        setCategories(updated);
      }
    } catch (error) {
      console.error('Failed to load checklist state:', error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadChecklistState();
  }, [loadChecklistState]);

  const saveChecklistState = async (updatedCategories: ChecklistCategory[]) => {
    try {
      const state: Record<string, boolean> = {};
      updatedCategories.forEach(category => {
        category.items.forEach(item => {
          state[item.id] = item.checked;
        });
      });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save checklist state:', error);
    }
  };

  const toggleItem = (categoryId: string, itemId: string) => {
    const updated = categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => {
            if (item.id === itemId) {
              return { ...item, checked: !item.checked };
            }
            return item;
          }),
        };
      }
      return category;
    });
    setCategories(updated);
    saveChecklistState(updated);
  };

  const resetCategory = (categoryId: string) => {
    const updated = categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => ({ ...item, checked: false })),
        };
      }
      return category;
    });
    setCategories(updated);
    saveChecklistState(updated);
  };

  const getProgress = (items: ChecklistItem[]) => {
    const checked = items.filter(i => i.checked).length;
    return { checked, total: items.length };
  };

  const renderCategory = ({ item }: { item: ChecklistCategory }) => {
    const isExpanded = expandedId === item.id;
    const progress = getProgress(item.items);
    const progressPercent = progress.total > 0 ? (progress.checked / progress.total) * 100 : 0;

    return (
      <View style={styles.categoryCard}>
        <TouchableOpacity
          style={styles.categoryHeader}
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.categoryLeft}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name={item.icon as any} size={22} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.categoryTitle}>{item.title}</Text>
              <Text style={styles.progressText}>
                {progress.checked}/{progress.total} 完了
              </Text>
            </View>
          </View>
          <View style={styles.categoryRight}>
            {/* プログレスバー */}
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
            <MaterialCommunityIcons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={COLORS.textSecondary}
            />
          </View>
        </TouchableOpacity>

        {/* 展開時のアイテム一覧 */}
        {isExpanded && (
          <View style={styles.itemsContainer}>
            {item.items.map((checkItem) => (
              <TouchableOpacity
                key={checkItem.id}
                style={styles.checkItem}
                onPress={() => toggleItem(item.id, checkItem.id)}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name={checkItem.checked ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                  size={22}
                  color={checkItem.checked ? COLORS.success : COLORS.textLight}
                />
                <Text style={[
                  styles.checkItemText,
                  checkItem.checked && styles.checkItemChecked,
                ]}>
                  {checkItem.text}
                </Text>
              </TouchableOpacity>
            ))}
            {/* リセットボタン */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => resetCategory(item.id)}
            >
              <MaterialCommunityIcons name="refresh" size={14} color={COLORS.textSecondary} />
              <Text style={styles.resetText}>リセット</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'チェックリスト',
          headerBackTitle: '戻る',
        }}
      />
      <View style={styles.container}>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Disclaimer />
              <Text style={styles.headerText}>
                現場ルールを確認しながら使う学習用チェックリストです
              </Text>
            </>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  headerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  categoryCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
    overflow: 'hidden',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  categoryRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    marginRight: SPACING.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
  itemsContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  checkItemText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
  },
  checkItemChecked: {
    color: COLORS.textLight,
    textDecorationLine: 'line-through',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    marginTop: SPACING.xs,
  },
  resetText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/utils/theme';
import { manuals } from '../../src/data/manuals';
import { Disclaimer } from '../../src/components/Disclaimer';

export default function ManualDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const manual = manuals.find(m => m.id === id);

  if (!manual) {
    return (
      <View style={styles.container}>
        <Text>データが見つかりません</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: manual.category,
          headerBackTitle: '戻る',
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Disclaimer />
        {/* タイトル */}
        <Text style={styles.title}>{manual.title}</Text>
        <Text style={styles.overview}>{manual.overview}</Text>

        {/* 手順 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="format-list-numbered" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>手順</Text>
          </View>
          {manual.steps.map((step) => (
            <View key={step.order} style={styles.stepCard}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.order}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 広告スペース（インライン） */}
        <View style={styles.adSpace}>
          <Text style={styles.adText}>広告スペース</Text>
        </View>

        {/* ポイント */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="lightbulb-outline" size={18} color="#FECA57" />
            <Text style={styles.sectionTitle}>ポイント</Text>
          </View>
          {manual.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <MaterialCommunityIcons name="check-circle-outline" size={16} color={COLORS.success} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* 注意点 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color={COLORS.warning} />
            <Text style={styles.sectionTitle}>注意点</Text>
          </View>
          {manual.cautions.map((caution, index) => (
            <View key={index} style={styles.cautionItem}>
              <MaterialCommunityIcons name="alert-outline" size={16} color={COLORS.warning} />
              <Text style={styles.cautionText}>{caution}</Text>
            </View>
          ))}
        </View>

        <Disclaimer compact />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  overview: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.white,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: 20,
  },
  cautionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
    backgroundColor: '#FFF8F0',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
  },
  cautionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: 20,
  },
  adSpace: {
    height: 50,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  adText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
});

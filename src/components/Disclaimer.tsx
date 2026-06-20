import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FULL_DISCLAIMER } from '../constants/safety';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../utils/theme';

type DisclaimerProps = {
  compact?: boolean;
};

export function Disclaimer({ compact = false }: DisclaimerProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <MaterialCommunityIcons name="information-outline" size={16} color={COLORS.primaryDark} />
      <Text style={styles.text}>{FULL_DISCLAIMER}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  compact: {
    marginBottom: SPACING.sm,
  },
  text: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    lineHeight: 17,
  },
});

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SPACING } from '../utils/theme';

type SourceNoteProps = {
  references?: string[];
  sourceNote?: string;
  compact?: boolean;
};

export function SourceNote({ references, sourceNote, compact = false }: SourceNoteProps) {
  if (!sourceNote && (!references || references.length === 0)) return null;

  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="book-open-page-variant-outline" size={15} color={COLORS.primaryDark} />
        <Text style={styles.title}>参考・根拠</Text>
      </View>
      {sourceNote ? <Text style={styles.note}>{sourceNote}</Text> : null}
      {references?.map((reference) => (
        <Text key={reference} style={styles.reference}>
          ・{reference}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  compact: {
    marginTop: SPACING.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    marginLeft: SPACING.xs,
  },
  note: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    lineHeight: 17,
    marginBottom: SPACING.xs,
  },
  reference: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    lineHeight: 17,
  },
});


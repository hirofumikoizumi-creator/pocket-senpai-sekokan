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
import { talkScripts } from '../../src/data/talks';
import { Disclaimer } from '../../src/components/Disclaimer';
import { FavoriteButton } from '../../src/components/FavoriteButton';
import { AdBanner } from '../../src/components/AdBanner';

export default function TalkDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const talk = talkScripts.find(t => t.id === id);

  if (!talk) {
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
          title: talk.category,
          headerBackTitle: '戻る',
        }}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Disclaimer />
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>{talk.title}</Text>
          <View style={styles.situationBox}>
            <MaterialCommunityIcons name="information-outline" size={14} color={COLORS.primary} />
            <Text style={styles.situationText}>{talk.situation}</Text>
          </View>
          <FavoriteButton
            item={{
              id: talk.id,
              type: 'talk',
              title: talk.title,
              category: talk.category,
            }}
          />
        </View>

        {/* 会話 */}
        <View style={styles.dialogueContainer}>
          {talk.dialogues.map((dialogue, index) => (
            <View
              key={index}
              style={[
                styles.dialogueRow,
                dialogue.speaker === 'field' ? styles.fieldRow : styles.counterpartRow,
              ]}
            >
              {/* アバター */}
              <View style={[
                styles.avatar,
                dialogue.speaker === 'field' ? styles.fieldAvatar : styles.counterpartAvatar,
              ]}>
                <MaterialCommunityIcons
                  name={dialogue.speaker === 'field' ? 'account-hard-hat' : 'account-tie-outline'}
                  size={16}
                  color={dialogue.speaker === 'field' ? COLORS.primary : '#FF6B9D'}
                />
              </View>

              {/* 吹き出し */}
              <View style={[
                styles.bubble,
                dialogue.speaker === 'field' ? styles.fieldBubble : styles.counterpartBubble,
              ]}>
                <Text style={styles.speakerLabel}>
                  {dialogue.speaker === 'field' ? '現場担当' : '相手'}
                </Text>
                <Text style={styles.dialogueText}>{dialogue.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <AdBanner style={styles.adSpace} />

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
  header: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  situationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  situationText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  dialogueContainer: {
    marginBottom: SPACING.lg,
  },
  dialogueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  fieldRow: {},
  counterpartRow: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldAvatar: {
    backgroundColor: COLORS.surfaceLight,
    marginRight: SPACING.sm,
  },
  counterpartAvatar: {
    backgroundColor: '#FFF0F5',
    marginLeft: SPACING.sm,
  },
  bubble: {
    flex: 1,
    maxWidth: '80%',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  fieldBubble: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 4,
    ...SHADOWS.sm,
  },
  counterpartBubble: {
    backgroundColor: '#F0FDF9',
    borderTopRightRadius: 4,
    ...SHADOWS.sm,
  },
  speakerLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  dialogueText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  adSpace: {
    height: 50,
    marginVertical: SPACING.md,
  },
});

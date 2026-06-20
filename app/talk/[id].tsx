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
        </View>

        {/* 会話 */}
        <View style={styles.dialogueContainer}>
          {talk.dialogues.map((dialogue, index) => (
            <View
              key={index}
              style={[
                styles.dialogueRow,
                dialogue.speaker === 'dh' ? styles.dhRow : styles.patientRow,
              ]}
            >
              {/* アバター */}
              <View style={[
                styles.avatar,
                dialogue.speaker === 'dh' ? styles.dhAvatar : styles.patientAvatar,
              ]}>
                <MaterialCommunityIcons
                  name={dialogue.speaker === 'dh' ? 'account-hard-hat' : 'account-tie-outline'}
                  size={16}
                  color={dialogue.speaker === 'dh' ? COLORS.primary : '#FF6B9D'}
                />
              </View>

              {/* 吹き出し */}
              <View style={[
                styles.bubble,
                dialogue.speaker === 'dh' ? styles.dhBubble : styles.patientBubble,
              ]}>
                <Text style={styles.speakerLabel}>
                  {dialogue.speaker === 'dh' ? '現場担当' : '相手'}
                </Text>
                <Text style={styles.dialogueText}>{dialogue.text}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 広告スペース */}
        <View style={styles.adSpace}>
          <Text style={styles.adText}>広告スペース</Text>
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
  dhRow: {},
  patientRow: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dhAvatar: {
    backgroundColor: COLORS.surfaceLight,
    marginRight: SPACING.sm,
  },
  patientAvatar: {
    backgroundColor: '#FFF0F5',
    marginLeft: SPACING.sm,
  },
  bubble: {
    flex: 1,
    maxWidth: '80%',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  dhBubble: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 4,
    ...SHADOWS.sm,
  },
  patientBubble: {
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

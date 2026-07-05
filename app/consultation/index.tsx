import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/utils/theme';
import { getAIResponse } from '../../src/services/aiService';
import { ConsultationResponse } from '../../src/types';
import { Disclaimer } from '../../src/components/Disclaimer';
import { getOnDeviceAIStatus, OnDeviceAIStatus } from '../../src/services/onDeviceAI';
import { FREE_PLAN_LIMITS } from '../../src/constants/plans';
import { PremiumPrompt } from '../../src/components/PremiumPrompt';
import { SourceNote } from '../../src/components/SourceNote';
import { useDailyLimit } from '../../src/hooks/useDailyLimit';
import { useSubscription } from '../../src/hooks/useSubscription';

const SENPAI_IMAGE = require('../../assets/characters/senpai-construction.png');

interface Message {
  id: string;
  type: 'user' | 'ai';
  text?: string;
  response?: ConsultationResponse;
  timestamp: Date;
}

const suggestedQuestions = [
  'KYの進め方が不安',
  '出来形写真の撮り漏れが怖い',
  '工程が遅れそう',
  '職長への報告が苦手',
  '施工計画書の読み方を知りたい',
  '施工管理技士の勉強方法',
];

export default function ConsultationScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAIStatus] = useState<OnDeviceAIStatus>('loading');
  const scrollViewRef = useRef<ScrollView>(null);
  const messageIdRef = useRef(0);
  const { isPremium } = useSubscription();
  const chatLimit = useDailyLimit('@pocket_senpai_daily_chat', FREE_PLAN_LIMITS.dailyChatMessages, isPremium);

  useEffect(() => {
    let mounted = true;
    getOnDeviceAIStatus().then((status) => {
      if (mounted) setAIStatus(status);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleSend = async (text?: string) => {
    const query = text || inputText.trim();
    if (!query || isLoading) return;
    if (!chatLimit.canUse) return;
    const nextMessageId = () => {
      messageIdRef.current += 1;
      return messageIdRef.current.toString();
    };

    const userMessage: Message = {
      id: nextMessageId(),
      type: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await getAIResponse(query);
      await chatLimit.increment();
      const aiMessage: Message = {
        id: nextMessageId(),
        type: 'ai',
        response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: nextMessageId(),
        type: 'ai',
        response: {
          id: 'error',
          category: 'エラー',
          keywords: [],
          conclusion: 'エラーが発生しました。もう一度お試しください。',
          fieldAction: '',
          fieldTalk: '',
          caution: '',
          senpaiMessage: '',
        },
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderAIResponse = (response: ConsultationResponse) => (
    <View style={styles.responseContainer}>
      {/* 結論 */}
      <View style={styles.responseSection}>
        <View style={styles.responseLabelRow}>
          <MaterialCommunityIcons name="lightbulb-outline" size={16} color={COLORS.primary} />
          <Text style={styles.responseLabel}>結論</Text>
        </View>
        <Text style={styles.responseText}>{response.conclusion}</Text>
      </View>

      {/* 現場での対応 */}
      {response.fieldAction && (
        <View style={styles.responseSection}>
          <View style={styles.responseLabelRow}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={16} color="#45B7D1" />
            <Text style={styles.responseLabel}>現場での対応</Text>
          </View>
          <Text style={styles.responseText}>{response.fieldAction}</Text>
        </View>
      )}

      {/* 現場での言い方 */}
      {response.fieldTalk && (
        <View style={styles.responseSection}>
          <View style={styles.responseLabelRow}>
            <MaterialCommunityIcons name="message-text-outline" size={16} color="#FF6B9D" />
            <Text style={styles.responseLabel}>現場での言い方</Text>
          </View>
          <View style={styles.talkBubble}>
            <Text style={styles.talkText}>{response.fieldTalk}</Text>
          </View>
        </View>
      )}

      {/* 注意点 */}
      {response.caution && (
        <View style={styles.responseSection}>
          <View style={styles.responseLabelRow}>
            <MaterialCommunityIcons name="alert-circle-outline" size={16} color={COLORS.warning} />
            <Text style={styles.responseLabel}>注意点</Text>
          </View>
          <Text style={styles.responseText}>{response.caution}</Text>
        </View>
      )}

      {/* 先輩から一言 */}
      {response.senpaiMessage && (
        <View style={[styles.responseSection, styles.senpaiSection]}>
          <View style={styles.responseLabelRow}>
            <MaterialCommunityIcons name="heart-outline" size={16} color={COLORS.secondary} />
            <Text style={styles.responseLabel}>先輩から一言</Text>
          </View>
          <Text style={styles.senpaiText}>{response.senpaiMessage}</Text>
        </View>
      )}

      <Disclaimer compact />
      <SourceNote references={response.references} sourceNote={response.sourceNote} compact />
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: '先輩相談AIチャット',
          headerTitle: '先輩相談AIチャット',
          headerBackTitle: '戻る',
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          <Disclaimer />
          <View style={styles.localModelNotice}>
            <MaterialCommunityIcons
              name={aiStatus === 'ready' ? 'chip' : 'shield-check-outline'}
              size={14}
              color={aiStatus === 'ready' ? COLORS.primaryDark : COLORS.textSecondary}
            />
            <Text style={styles.localModelText}>
              {aiStatus === 'ready'
                ? 'AIオンデバイス整形が有効です'
                : 'AIモデル未読込のため、監修済みテンプレートで安全に応答します'}
            </Text>
          </View>
          {!isPremium && (
            <Text style={styles.limitText}>
              本日の無料相談: {chatLimit.used} / {chatLimit.limit}回
            </Text>
          )}
          {!chatLimit.canUse && (
            <PremiumPrompt title="本日の無料相談は終了しました" message="プレミアムでは先輩相談を回数制限なく利用できます。" />
          )}
          {/* 初期表示 */}
          {messages.length === 0 && (
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeIconContainer}>
                <Image source={SENPAI_IMAGE} style={styles.welcomeSenpaiImage} resizeMode="contain" />
              </View>
              <Text style={styles.welcomeTitle}>先輩相談AIチャット</Text>
              <Text style={styles.welcomeSubtitle}>
                仕事の悩みや分からないことを{'\n'}気軽に聞いてみてね
              </Text>

              {/* 提案質問 */}
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsTitle}>こんなことを聞いてみよう</Text>
                {suggestedQuestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.suggestionChip, !chatLimit.canUse && styles.disabledChip]}
                    onPress={() => handleSend(question)}
                    disabled={!chatLimit.canUse}
                  >
                    <Text style={styles.suggestionText}>{question}</Text>
                    <MaterialCommunityIcons name="chevron-right" size={16} color={COLORS.textSecondary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* メッセージ一覧 */}
          {messages.map((message) => (
            <View key={message.id} style={styles.messageWrapper}>
              {message.type === 'user' ? (
                <View style={styles.userMessageContainer}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userText}>{message.text}</Text>
                  </View>
                </View>
              ) : (
                <View style={styles.aiMessageContainer}>
                  <View style={styles.aiAvatar}>
                    <Image source={SENPAI_IMAGE} style={styles.aiAvatarImage} resizeMode="cover" />
                  </View>
                  <View style={styles.aiBubble}>
                    {message.response && renderAIResponse(message.response)}
                  </View>
                </View>
              )}
            </View>
          ))}

          {/* ローディング */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={styles.aiAvatar}>
                <Image source={SENPAI_IMAGE} style={styles.aiAvatarImage} resizeMode="cover" />
              </View>
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingText}>先輩が考え中...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* 入力エリア */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="悩みや質問を入力してね..."
              placeholderTextColor={COLORS.textLight}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={200}
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={() => handleSend()}
              disabled={!inputText.trim() || isLoading || !chatLimit.canUse}
            >
              <MaterialCommunityIcons
                name="send"
                size={20}
                color={inputText.trim() && chatLimit.canUse ? COLORS.white : COLORS.textLight}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  localModelNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  localModelText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    lineHeight: 16,
  },
  limitText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.xs,
    textAlign: 'right',
    marginBottom: SPACING.sm,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  welcomeIconContainer: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  welcomeSenpaiImage: {
    width: 118,
    height: 118,
  },
  welcomeTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  suggestionsContainer: {
    width: '100%',
    marginTop: SPACING.xl,
  },
  suggestionsTitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    fontWeight: '500',
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  disabledChip: {
    opacity: 0.55,
  },
  suggestionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 1,
  },
  messageWrapper: {
    marginBottom: SPACING.md,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    borderBottomRightRadius: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    maxWidth: '80%',
  },
  userText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  aiMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    marginTop: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aiAvatarImage: {
    width: 38,
    height: 38,
  },
  aiBubble: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderTopLeftRadius: 4,
    padding: SPACING.md,
    ...SHADOWS.sm,
  },
  responseContainer: {},
  responseSection: {
    marginBottom: SPACING.md,
  },
  responseLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  responseLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  responseText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  talkBubble: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B9D',
  },
  talkText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  senpaiSection: {
    backgroundColor: '#FFF5F9',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  senpaiText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    borderTopLeftRadius: 4,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...SHADOWS.sm,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  inputContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.xl,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    maxHeight: 100,
    paddingVertical: SPACING.sm,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.border,
  },
});

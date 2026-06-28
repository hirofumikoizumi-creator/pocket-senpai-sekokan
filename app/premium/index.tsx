import React from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SHADOWS, SPACING } from '../../src/utils/theme';
import { FREE_PLAN_LIMITS, PREMIUM_PLAN } from '../../src/constants/plans';
import { REVENUECAT_ENTITLEMENT_ID, REVENUECAT_OFFERING_ID } from '../../src/services/revenueCat';
import { useSubscription } from '../../src/hooks/useSubscription';

const premiumBenefits = [
  '先輩相談を回数制限なく利用',
  'ミニ学習クイズを1日の制限なく利用',
  'お気に入り登録を無制限に保存',
  '広告を非表示',
  '現場での言い方・注意点をいつでも確認',
];

const freeLimits = [
  `先輩相談1日${FREE_PLAN_LIMITS.dailyChatMessages}回`,
  `クイズ1日${FREE_PLAN_LIMITS.dailyQuizQuestions}問`,
  `お気に入り${FREE_PLAN_LIMITS.favorites}件まで`,
  '広告表示あり',
];

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return '不明なエラーが発生しました。';
}

export default function PremiumScreen() {
  const {
    isPremium,
    subscriptionSource,
    isRevenueCatConfigured,
    isLoading,
    buyPremium,
    restoreSubscription,
    setDevelopmentPremium,
  } = useSubscription();

  const handlePurchase = async () => {
    try {
      const result = await buyPremium();
      if (result.isPremium) {
        Alert.alert('購入が完了しました', 'ポケット先輩プレミアムが有効になりました。');
      } else {
        Alert.alert('購入を確認できませんでした', `RevenueCatのEntitlement「${REVENUECAT_ENTITLEMENT_ID}」が有効になっているか確認してください。`);
      }
    } catch (error) {
      Alert.alert('購入できませんでした', getErrorMessage(error));
    }
  };

  const handleRestore = async () => {
    try {
      const result = await restoreSubscription();
      if (result.isPremium) {
        Alert.alert('購入を復元しました', 'ポケット先輩プレミアムが有効になりました。');
      } else {
        Alert.alert('復元できる購入がありません', '同じApple IDで購入済みか確認してください。');
      }
    } catch (error) {
      Alert.alert('復元できませんでした', getErrorMessage(error));
    }
  };

  const handleDevelopmentToggle = () => {
    Alert.alert(
      '開発確認用',
      isPremium ? '無料プラン表示に戻しますか？' : 'プレミアム状態として画面表示を確認しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: isPremium ? '無料に戻す' : '有効にする',
          onPress: () => setDevelopmentPremium(!isPremium),
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'プレミアム', headerBackTitle: '戻る' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={styles.crownCircle}>
            <MaterialCommunityIcons name="crown-outline" size={38} color={COLORS.primaryDark} />
          </View>
          <Text style={styles.title}>{PREMIUM_PLAN.name}</Text>
          <Text style={styles.price}>{PREMIUM_PLAN.priceLabel}</Text>
          <Text style={styles.description}>
            現場で迷った時の確認と学習を、回数を気にせず使えるプランです。
          </Text>
          {isPremium && (
            <View style={styles.activeBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.primaryDark} />
              <Text style={styles.activeBadgeText}>プレミアム有効</Text>
            </View>
          )}
        </View>

        {!isRevenueCatConfigured && (
          <View style={styles.setupNotice}>
            <MaterialCommunityIcons name="information-outline" size={18} color={COLORS.warning} />
            <Text style={styles.setupNoticeText}>
              RevenueCat APIキー未設定です。EAS環境変数 REVENUECAT_IOS_API_KEY / REVENUECAT_ANDROID_API_KEY を設定し、Offering「{REVENUECAT_OFFERING_ID}」とEntitlement「{REVENUECAT_ENTITLEMENT_ID}」を作成してください。
            </Text>
          </View>
        )}

        <View style={[styles.section, styles.premiumSection]}>
          <Text style={styles.sectionTitle}>有料プランでできること</Text>
          {premiumBenefits.map((item) => (
            <View key={item} style={styles.row}>
              <MaterialCommunityIcons name="check-circle" size={19} color={COLORS.primary} />
              <Text style={styles.benefitText}>{item}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>無料プラン</Text>
          {freeLimits.map((item) => (
            <View key={item} style={styles.row}>
              <MaterialCommunityIcons name="check-circle-outline" size={18} color={COLORS.textLight} />
              <Text style={styles.freeText}>{item}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={[styles.purchaseButton, isLoading && styles.disabledButton]} onPress={handlePurchase} activeOpacity={0.75} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.purchaseText}>{PREMIUM_PLAN.priceLabel}で始める</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore} activeOpacity={0.75} disabled={isLoading}>
          <Text style={styles.restoreText}>購入を復元</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.devButton} onPress={handleDevelopmentToggle} activeOpacity={0.75}>
          <Text style={styles.devText}>
            開発確認: {isPremium ? `プレミアム有効 (${subscriptionSource})` : '無料プラン'}
          </Text>
        </TouchableOpacity>
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
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  crownCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  price: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: SPACING.sm,
    fontWeight: '700',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
  },
  activeBadgeText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    marginLeft: SPACING.xs,
  },
  setupNotice: {
    flexDirection: 'row',
    backgroundColor: '#FFF8F0',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  setupNoticeText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
    marginLeft: SPACING.sm,
  },
  section: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  premiumSection: {
    borderWidth: 1,
    borderColor: '#CDEFE9',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  freeText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '600',
    lineHeight: 22,
  },
  benefitText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '700',
    lineHeight: 22,
  },
  purchaseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    ...SHADOWS.sm,
  },
  disabledButton: {
    opacity: 0.7,
  },
  purchaseText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  restoreText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  devButton: {
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  devText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
});

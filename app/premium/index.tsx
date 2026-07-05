import React from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BORDER_RADIUS, COLORS, FONT_SIZES, SHADOWS, SPACING } from '../../src/utils/theme';
import { FREE_PLAN_LIMITS, PREMIUM_PLAN } from '../../src/constants/plans';
import { REVENUECAT_ENTITLEMENT_ID, REVENUECAT_OFFERING_ID } from '../../src/services/revenueCat';
import { useSubscription } from '../../src/hooks/useSubscription';

const premiumBenefits = [
  '先輩相談AIチャットの1日回数制限を解除',
  'ミニ学習クイズの1日回数制限を解除',
  'お気に入り保存数の上限を解除',
  '無料プランの広告を非表示',
];

const proFeatureCards = [
  {
    title: '先輩相談AIチャット',
    description: '安全・品質・工程・報告の悩みを、回数制限なく相談できます。',
  },
  {
    title: '学習と復習',
    description: 'クイズとお気に入りを使って、弱点分野を繰り返し確認できます。',
  },
  {
    title: '広告なし',
    description: '無料プランで表示される広告を非表示にして、確認作業に集中できます。',
  },
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
        <View style={styles.appHeader}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>P</Text>
          </View>
          <View style={styles.appHeaderText}>
            <Text style={styles.appName}>ポケット先輩</Text>
            <Text style={styles.appTagline}>施工管理をスマートに</Text>
          </View>
        </View>

        <View style={styles.heroIntro}>
          <Text style={styles.title}>{PREMIUM_PLAN.name}</Text>
          <Text style={styles.description}>先輩相談AIチャット、クイズ、お気に入りを制限なく使い、広告なしで学習できます。</Text>
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
          <View style={styles.planHeader}>
            <Text style={styles.sectionTitle}>月額プラン</Text>
            <View style={styles.cancelBadge}>
              <Text style={styles.cancelBadgeText}>いつでも解約可能</Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>¥500</Text>
            <Text style={styles.priceSuffix}>/ 月</Text>
          </View>
          {premiumBenefits.map((item) => (
            <View key={item} style={styles.row}>
              <MaterialCommunityIcons name="check-circle" size={19} color={COLORS.primary} />
              <Text style={styles.benefitText}>{item}</Text>
            </View>
          ))}
          <TouchableOpacity style={[styles.purchaseButton, isLoading && styles.disabledButton]} onPress={handlePurchase} activeOpacity={0.75} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.purchaseText}>月額プランを購入</Text>}
          </TouchableOpacity>
          <Text style={styles.appleNotice}>購入はApple IDで安全に処理されます</Text>
          {isPremium && (
            <View style={styles.activeBadge}>
              <MaterialCommunityIcons name="check-circle" size={16} color={COLORS.primaryDark} />
              <Text style={styles.activeBadgeText}>プレミアム有効</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proで使えること</Text>
          {proFeatureCards.map((item) => (
            <View key={item.title} style={styles.featureCard}>
              <Text style={styles.featureTitle}>{item.title}</Text>
              <Text style={styles.featureDescription}>{item.description}</Text>
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

        <View style={styles.footerLinks}>
          <TouchableOpacity style={styles.footerLink} onPress={handleRestore} activeOpacity={0.75} disabled={isLoading}>
            <Text style={styles.restoreText}>購入を復元</Text>
          </TouchableOpacity>
        </View>

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
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  appIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    ...SHADOWS.sm,
  },
  appIconText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.title,
    fontWeight: '800',
  },
  appHeaderText: {
    flex: 1,
  },
  appName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.text,
  },
  appTagline: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    fontWeight: '600',
  },
  heroIntro: {
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    lineHeight: 25,
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
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  cancelBadge: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  cancelBadgeText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  price: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.text,
  },
  priceSuffix: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
    marginBottom: SPACING.xs,
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
    marginTop: SPACING.lg,
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
  appleNotice: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  featureCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  featureTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
  },
  featureDescription: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    lineHeight: 19,
    marginTop: SPACING.xs,
  },
  footerLinks: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  footerLink: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  restoreText: {
    color: COLORS.primaryDark,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
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

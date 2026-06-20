import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../src/utils/theme';
import { Disclaimer } from '../src/components/Disclaimer';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 3) / 2;

interface MenuCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  route: string;
  color: string;
}

const menuCards: MenuCard[] = [
  {
    id: '1',
    title: '先輩相談',
    subtitle: '困った時に聞いてみよう',
    icon: 'chat-processing-outline',
    route: '/consultation',
    color: '#4ECDC4',
  },
  {
    id: '2',
    title: '現場トーク集',
    subtitle: '報告・共有の参考に',
    icon: 'message-text-outline',
    route: '/talk',
    color: '#FF6B9D',
  },
  {
    id: '3',
    title: '業務別マニュアル',
    subtitle: '手順を確認',
    icon: 'book-open-variant',
    route: '/manual',
    color: '#45B7D1',
  },
  {
    id: '4',
    title: 'チェックリスト',
    subtitle: '準備を確認',
    icon: 'clipboard-check-outline',
    route: '/checklist',
    color: '#96CEB4',
  },
  {
    id: '5',
    title: 'ミニ学習クイズ',
    subtitle: '知識をチェック',
    icon: 'lightbulb-outline',
    route: '/quiz',
    color: '#FFEAA7',
  },
  {
    id: '6',
    title: 'お気に入り',
    subtitle: '保存した内容',
    icon: 'heart-outline',
    route: '/favorites',
    color: '#DDA0DD',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ヘッダー */}
      <View style={styles.header}>
        <View>
          <Text style={styles.appTitle}>ポケット先輩</Text>
          <Text style={styles.appSubtitle}>建設・土木の施工管理学習サポート</Text>
        </View>
        <View style={styles.headerIcon}>
          <MaterialCommunityIcons name="hard-hat" size={28} color={COLORS.primary} />
        </View>
      </View>

      <View style={styles.disclaimerWrapper}>
        <Disclaimer compact />
      </View>

      {/* メニューカード */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsGrid}>
          {menuCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              onPress={() => router.push(card.route as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIconContainer, { backgroundColor: card.color + '20' }]}>
                <MaterialCommunityIcons
                  name={card.icon as any}
                  size={28}
                  color={card.color}
                />
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 広告スペース（バナー広告用） */}
        <View style={styles.adBanner}>
          <Text style={styles.adText}>広告スペース</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  appTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    color: COLORS.text,
  },
  appSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimerWrapper: {
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.sm,
  },
  scrollView: {
    flex: 1,
  },
  cardsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  adBanner: {
    height: 50,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  adText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../../src/utils/theme';
import { getQuizCategories, getQuizzesByCategory } from '../../src/data/quizzes';
import { Quiz } from '../../src/types';
import { Disclaimer } from '../../src/components/Disclaimer';

type QuizState = 'category' | 'playing' | 'result';

export default function QuizScreen() {
  const [state, setState] = useState<QuizState>('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentQuizzes, setCurrentQuizzes] = useState<Quiz[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  const categories = getQuizCategories();

  const startQuiz = (category: string) => {
    const quizzes = getQuizzesByCategory(category);
    setSelectedCategory(category);
    setCurrentQuizzes(quizzes);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setState('playing');
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === currentQuizzes[currentIndex].correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= currentQuizzes.length) {
      setState('result');
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetQuiz = () => {
    setState('category');
    setSelectedCategory('');
    setCurrentQuizzes([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const categoryColors: Record<string, string> = {
    '安全ルール': '#F6AD55',
    '品質管理': '#45B7D1',
    '工程管理': '#4ECDC4',
    '書類・記録': '#96CEB4',
    '試験学習': '#DDA0DD',
  };

  // カテゴリ選択画面
  if (state === 'category') {
    return (
      <>
        <Stack.Screen options={{ title: 'ミニ学習クイズ', headerBackTitle: '戻る' }} />
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Disclaimer />
          <Text style={styles.headerText}>カテゴリを選んでクイズに挑戦しよう</Text>
          {categories.map((category) => {
            const count = getQuizzesByCategory(category).length;
            const color = categoryColors[category] || COLORS.primary;
            return (
              <TouchableOpacity
                key={category}
                style={styles.categoryCard}
                onPress={() => startQuiz(category)}
                activeOpacity={0.7}
              >
                <View style={[styles.categoryIcon, { backgroundColor: color + '20' }]}>
                  <MaterialCommunityIcons name="lightbulb-outline" size={24} color={color} />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <Text style={styles.categoryCount}>{count}問</Text>
                </View>
                <MaterialCommunityIcons name="play-circle-outline" size={24} color={color} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </>
    );
  }

  // クイズ実施画面
  if (state === 'playing') {
    const quiz = currentQuizzes[currentIndex];
    return (
      <>
        <Stack.Screen options={{ title: selectedCategory, headerBackTitle: '戻る' }} />
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Disclaimer />
          {/* プログレス */}
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>
              {currentIndex + 1} / {currentQuizzes.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((currentIndex + 1) / currentQuizzes.length) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* 問題 */}
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{quiz.question}</Text>
          </View>

          {/* 選択肢 */}
          {quiz.options.map((option, index) => {
            let optionStyle = styles.optionDefault;
            let textStyle = styles.optionTextDefault;

            if (selectedAnswer !== null) {
              if (index === quiz.correctIndex) {
                optionStyle = styles.optionCorrect;
                textStyle = styles.optionTextCorrect;
              } else if (index === selectedAnswer && index !== quiz.correctIndex) {
                optionStyle = styles.optionWrong;
                textStyle = styles.optionTextWrong;
              }
            }

            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, optionStyle]}
                onPress={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                activeOpacity={0.7}
              >
                <View style={styles.optionLabel}>
                  <Text style={[styles.optionLabelText, textStyle]}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text style={[styles.optionText, textStyle]}>{option}</Text>
                {selectedAnswer !== null && index === quiz.correctIndex && (
                  <MaterialCommunityIcons name="check-circle" size={20} color={COLORS.success} />
                )}
                {selectedAnswer !== null && index === selectedAnswer && index !== quiz.correctIndex && (
                  <MaterialCommunityIcons name="close-circle" size={20} color={COLORS.error} />
                )}
              </TouchableOpacity>
            );
          })}

          {/* 解説 */}
          {showExplanation && (
            <View style={styles.explanationCard}>
              <View style={styles.explanationHeader}>
                <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={COLORS.primary} />
                <Text style={styles.explanationTitle}>解説</Text>
              </View>
              <Text style={styles.explanationText}>{quiz.explanation}</Text>
            </View>
          )}

          {/* 次へボタン */}
          {selectedAnswer !== null && (
            <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
              <Text style={styles.nextButtonText}>
                {currentIndex + 1 >= currentQuizzes.length ? '結果を見る' : '次の問題'}
              </Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color={COLORS.white} />
            </TouchableOpacity>
          )}
        </ScrollView>
      </>
    );
  }

  // 結果画面
  return (
    <>
      <Stack.Screen options={{ title: '結果', headerBackTitle: '戻る' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.resultContent}>
        <Disclaimer />
        <View style={styles.resultCard}>
          <MaterialCommunityIcons
            name={score >= currentQuizzes.length * 0.7 ? 'trophy' : 'emoticon-outline'}
            size={60}
            color={score >= currentQuizzes.length * 0.7 ? '#FECA57' : COLORS.primary}
          />
          <Text style={styles.resultTitle}>
            {score >= currentQuizzes.length * 0.7 ? 'すごい！' : 'お疲れさま！'}
          </Text>
          <Text style={styles.resultScore}>
            {score} / {currentQuizzes.length} 正解
          </Text>
          <Text style={styles.resultMessage}>
            {score >= currentQuizzes.length * 0.7
              ? 'よく勉強できていますね！この調子で頑張りましょう。'
              : '間違えた問題を復習して、もう一度チャレンジしてみましょう！'}
          </Text>
        </View>

        {/* リワード広告スペース */}
        <View style={styles.rewardAdSpace}>
          <MaterialCommunityIcons name="play-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.rewardAdText}>動画を見て追加解説を見る</Text>
          <Text style={styles.rewardAdSubtext}>（広告スペース）</Text>
        </View>

        <TouchableOpacity style={styles.retryButton} onPress={() => startQuiz(selectedCategory)}>
          <MaterialCommunityIcons name="refresh" size={18} color={COLORS.primary} />
          <Text style={styles.retryButtonText}>もう一度挑戦</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={resetQuiz}>
          <Text style={styles.backButtonText}>カテゴリ選択に戻る</Text>
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
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  headerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.sm,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryCount: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: SPACING.lg,
  },
  progressLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  questionCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  questionText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 28,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  optionDefault: {},
  optionCorrect: {
    borderColor: COLORS.success,
    backgroundColor: '#F0FFF4',
  },
  optionWrong: {
    borderColor: COLORS.error,
    backgroundColor: '#FFF5F5',
  },
  optionLabel: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  optionLabelText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  optionTextDefault: {},
  optionTextCorrect: {
    color: COLORS.success,
    fontWeight: '600',
  },
  optionTextWrong: {
    color: COLORS.error,
  },
  explanationCard: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  explanationTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.xs,
  },
  explanationText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md,
    marginTop: SPACING.lg,
  },
  nextButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.white,
    marginRight: SPACING.sm,
  },
  resultContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    alignItems: 'center',
  },
  resultCard: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    ...SHADOWS.md,
  },
  resultTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  resultScore: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  resultMessage: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 22,
  },
  rewardAdSpace: {
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  rewardAdText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.primary,
    marginTop: SPACING.sm,
  },
  rewardAdSubtext: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    width: '100%',
  },
  retryButtonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: SPACING.sm,
  },
  backButton: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
});

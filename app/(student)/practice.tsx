import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { UsageCounter } from '@/components/ui/UsageCounter';
import { PaywallModal } from '@/components/ui/PaywallModal';
import { useAuthStore } from '@/store/authStore';
import { useUsageStore } from '@/store/usageStore';
import { generateQuestions } from '@/services/questionService';
import {
  EXAM_TYPES,
  SUBJECTS_BY_EXAM,
  CHAPTERS,
  DIFFICULTIES,
  QUESTION_TYPES,
  QUESTION_COUNTS,
  FREE_TIER_LIMITS,
} from '@/constants/taxonomy';
import { DIFFICULTY_COLORS } from '@/constants/theme';
import { ExamType, Subject, Difficulty, QuestionType, Question } from '@/types';

export default function PracticeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { practiceCount, incrementPractice, isPracticeLimitReached } = useUsageStore();
  const isPremium = user?.tier !== 'free';

  const [examType, setExamType] = useState<ExamType | ''>('');
  const [subject, setSubject] = useState<Subject | ''>('');
  const [chapter, setChapter] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [paywallVisible, setPaywallVisible] = useState(false);

  // Practice session state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const availableSubjects = examType ? SUBJECTS_BY_EXAM[examType as ExamType] : [];
  const availableChapters = subject ? CHAPTERS[subject as Subject] : [];
  const canStart = examType && subject && chapter && difficulty;
  const limitBlocked = !isPremium && isPracticeLimitReached();

  async function handleStart() {
    if (!canStart) return;
    if (limitBlocked) {
      setPaywallVisible(true);
      return;
    }
    setLoading(true);
    try {
      const qs = await generateQuestions({
        subject: subject as Subject,
        chapter,
        examType: examType as ExamType,
        difficulty: difficulty as Difficulty,
        type: 'MCQ',
        count: isPremium ? count : Math.min(count, FREE_TIER_LIMITS.dailyGenerations),
      });
      setQuestions(qs);
      setCurrentIdx(0);
      setAnswers({});
      setSubmitted(false);
      setShowResult(false);
      if (!isPremium) incrementPractice();
    } catch {
      Alert.alert('Error', 'Could not generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function selectAnswer(qId: string, answer: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: answer }));
  }

  function handleSubmit() {
    Alert.alert('Submit Practice', 'Submit and see your answers?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Submit', onPress: () => { setSubmitted(true); setShowResult(true); } },
    ]);
  }

  function handleReset() {
    setQuestions([]);
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  }

  const currentQ = questions[currentIdx];

  // Show configuration form
  if (questions.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
        <PaywallModal
          visible={paywallVisible}
          onClose={() => setPaywallVisible(false)}
          onUpgrade={() => {
            setPaywallVisible(false);
            router.push('/settings' as any);
          }}
          feature="Self Practice"
          limitMessage={`You've used ${FREE_TIER_LIMITS.weeklyPracticeTests} free practice sessions this week. Upgrade to Premium for unlimited practice.`}
        />

        <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, color: '#fff', letterSpacing: -0.5 }}>Self Practice</Text>
          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 6 }}>
            Generate questions tailored to you
          </Text>
          {!isPremium && (
            <UsageCounter
              used={practiceCount}
              limit={FREE_TIER_LIMITS.weeklyPracticeTests}
              period="this week"
              onUpgrade={() => setPaywallVisible(true)}
            />
          )}
        </LinearGradient>

        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingTop: 24, paddingBottom: 40 }}>
          <Card>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130', marginBottom: 20 }}>Configure Session</Text>
            <Select label="Exam Type" value={examType} options={EXAM_TYPES} onSelect={(v) => { setExamType(v as ExamType); setSubject(''); setChapter(''); }} placeholder="Select exam type..." />
            <Select label="Subject" value={subject} options={availableSubjects} onSelect={(v) => { setSubject(v as Subject); setChapter(''); }} placeholder={examType ? 'Select subject...' : 'Select exam type first'} />
            <Select label="Chapter" value={chapter} options={availableChapters} onSelect={setChapter} placeholder={subject ? 'Select chapter...' : 'Select subject first'} />
            <Select label="Difficulty" value={difficulty} options={DIFFICULTIES as unknown as string[]} onSelect={(v) => setDifficulty(v as Difficulty)} placeholder="Select difficulty..." />

            <View style={{ marginBottom: 4 }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#4A5B8C', marginBottom: 10 }}>Questions</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {QUESTION_COUNTS.slice(0, isPremium ? undefined : 3).map((n) => (
                  <TouchableOpacity
                    key={n}
                    onPress={() => setCount(n)}
                    style={{
                      width: 52,
                      height: 44,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: count === n ? 0 : 1,
                      borderColor: '#E8EDF8',
                      overflow: 'hidden',
                    }}
                  >
                    {count === n ? (
                      <LinearGradient colors={['#7B5CFF', '#4F8FFF']} style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#fff' }}>{n}</Text>
                      </LinearGradient>
                    ) : (
                      <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#4A5B8C' }}>{n}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>

          <View style={{ marginTop: 20 }}>
            {loading ? (
              <LoadingSpinner message="Generating questions with AI..." />
            ) : (
              <Button
                label={limitBlocked ? 'Weekly limit reached' : 'Start Practice'}
                onPress={handleStart}
                fullWidth
                size="lg"
                disabled={!canStart}
                icon={<Ionicons name={limitBlocked ? 'lock-closed' : 'sparkles'} size={18} color="#fff" />}
              />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Show result summary
  if (submitted && showResult) {
    const correctCount = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
    const pct = Math.round((correctCount / questions.length) * 100);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
          {/* Score card */}
          <LinearGradient colors={pct >= 70 ? ['#22D3A3', '#0D9488'] : pct >= 50 ? ['#FBBF24', '#D97706'] : ['#F87171', '#EF4444']} style={{ borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 48, color: '#fff' }}>{pct}%</Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 16, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
              {correctCount} / {questions.length} correct
            </Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
              {chapter} · {difficulty}
            </Text>
          </LinearGradient>

          {/* Question breakdown */}
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130', marginBottom: 14 }}>Review Answers</Text>
          <View style={{ gap: 12 }}>
            {questions.map((q, i) => {
              const isCorrect = answers[q.id] === q.correctAnswer;
              return (
                <Card key={q.id}>
                  <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: isCorrect ? '#ECFDF9' : '#FEF2F2', alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name={isCorrect ? 'checkmark' : 'close'} size={16} color={isCorrect ? '#22D3A3' : '#F87171'} />
                    </View>
                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#0D1130', flex: 1, lineHeight: 20 }}>
                      {i + 1}. {q.content}
                    </Text>
                  </View>
                  {!isCorrect && answers[q.id] && (
                    <View style={{ backgroundColor: '#FEF2F2', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                      <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#F87171' }}>
                        Your answer: {String(answers[q.id])}
                      </Text>
                    </View>
                  )}
                  <View style={{ backgroundColor: '#ECFDF9', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                    <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#22D3A3' }}>
                      Correct: {String(q.correctAnswer)}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: '#EEF4FF', borderRadius: 10, padding: 10 }}>
                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#4A5B8C' }}>{q.explanation}</Text>
                  </View>
                </Card>
              );
            })}
          </View>

          <View style={{ marginTop: 24 }}>
            <Button label="Practice Again" onPress={handleReset} fullWidth size="lg" />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Show active question
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      {/* Header */}
      <View style={{ backgroundColor: '#07090F', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={handleReset} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="close" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#fff' }}>
            {currentIdx + 1} / {questions.length}
          </Text>
          <TouchableOpacity onPress={handleSubmit} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, backgroundColor: '#22D3A3' }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13, color: '#fff' }}>Submit</Text>
          </TouchableOpacity>
        </View>
        {/* Progress */}
        <View style={{ marginTop: 12, height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
          <View style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, height: '100%', backgroundColor: '#7B5CFF', borderRadius: 2 }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <Badge label={currentQ.difficulty} color={DIFFICULTY_COLORS[currentQ.difficulty]} size="sm" />
          <Badge label={currentQ.chapter} color="#4A5B8C" size="sm" />
        </View>

        <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 16, color: '#0D1130', lineHeight: 26, marginBottom: 24 }}>
          {currentIdx + 1}. {currentQ.content}
        </Text>

        {currentQ.options?.map((opt, oi) => {
          const isSelected = answers[currentQ.id] === opt;
          return (
            <TouchableOpacity
              key={oi}
              onPress={() => selectAnswer(currentQ.id, opt)}
              activeOpacity={0.85}
              style={{ marginBottom: 12 }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                borderRadius: 14,
                padding: 16,
                backgroundColor: isSelected ? '#F3EFFE' : '#fff',
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? '#7B5CFF' : '#E8EDF8',
              }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: isSelected ? '#7B5CFF' : '#F5F7FF', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 13, color: isSelected ? '#fff' : '#8899BB' }}>
                    {String.fromCharCode(65 + oi)}
                  </Text>
                </View>
                <Text style={{ flex: 1, fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: isSelected ? '#7B5CFF' : '#0D1130', lineHeight: 20 }}>
                  {opt}
                </Text>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color="#7B5CFF" />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Navigation */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E8EDF8', flexDirection: 'row', gap: 12, paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 28 }}>
        <TouchableOpacity
          onPress={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          style={{ flex: 1, backgroundColor: '#F5F7FF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', opacity: currentIdx === 0 ? 0.4 : 1 }}
        >
          <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#4A5B8C' }}>← Previous</Text>
        </TouchableOpacity>
        {currentIdx < questions.length - 1 ? (
          <TouchableOpacity
            onPress={() => setCurrentIdx((i) => i + 1)}
            style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
          >
            <LinearGradient colors={['#7B5CFF', '#4F8FFF']} style={{ paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#fff' }}>Next →</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSubmit} style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
            <LinearGradient colors={['#22D3A3', '#16B892']} style={{ paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#fff' }}>Finish ✓</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

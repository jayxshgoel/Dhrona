import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getAttemptsByStudent } from '@/services/testService';
import { getTestById } from '@/services/testService';
import { getQuestionById } from '@/services/questionService';
import { useAuthStore } from '@/store/authStore';
import { DIFFICULTY_COLORS } from '@/constants/theme';

export default function ResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const attempts = getAttemptsByStudent(user?.id ?? 'student-1');
  const attempt = attempts.find((a) => a.id === id);

  if (!attempt) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: '#8899BB' }}>Result not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#7B5CFF' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const test = getTestById(attempt.testId);
  const questions = (test?.questionIds ?? []).map((qid) => getQuestionById(qid)).filter(Boolean);
  const pct = Math.round((attempt.score / attempt.totalMarks) * 100);

  const correct = questions.filter((q) => q && attempt.answers[q.id] === q.correctAnswer).length;
  const wrong = questions.filter((q) => q && q.id in attempt.answers && attempt.answers[q.id] !== q.correctAnswer).length;
  const skipped = questions.length - correct - wrong;

  const gradientColors: [string, string] =
    pct >= 70 ? ['#22D3A3', '#16B892'] : pct >= 50 ? ['#FBBF24', '#D97706'] : ['#F87171', '#EF4444'];

  const minutes = Math.floor(attempt.timeTaken / 60);
  const seconds = attempt.timeTaken % 60;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Score hero */}
        <LinearGradient colors={gradientColors} style={{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 40, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>
            {test?.title ?? 'Test Result'}
          </Text>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 64, color: '#fff', lineHeight: 68 }}>{pct}%</Text>
          <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 18, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
            {attempt.score} / {attempt.totalMarks} marks
          </Text>

          {attempt.rank && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 7 }}>
              <Ionicons name="trophy" size={15} color="#fff" />
              <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#fff' }}>
                Rank #{attempt.rank} · {attempt.percentile}th percentile
              </Text>
            </View>
          )}

          {/* Stats row */}
          <View style={{ flexDirection: 'row', gap: 20, marginTop: 24 }}>
            {[
              { label: 'Correct', value: correct, color: '#fff' },
              { label: 'Wrong', value: wrong, color: '#fff' },
              { label: 'Skipped', value: skipped, color: '#fff' },
              { label: 'Time', value: `${minutes}:${String(seconds).padStart(2, '0')}`, color: '#fff' },
            ].map((s) => (
              <View key={s.label} style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: '#fff' }}>{s.value}</Text>
                <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Question review */}
        <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#0D1130', marginBottom: 16 }}>Question Review</Text>
          <View style={{ gap: 12 }}>
            {questions.map((q, i) => {
              if (!q) return null;
              const yourAnswer = attempt.answers[q.id];
              const isCorrect = yourAnswer === q.correctAnswer;
              const isSkipped = yourAnswer === undefined;

              return (
                <Card key={q.id}>
                  {/* Status bar */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F0F4FF',
                  }}>
                    <View style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      backgroundColor: isSkipped ? '#F5F7FF' : isCorrect ? '#ECFDF9' : '#FEF2F2',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Ionicons
                        name={isSkipped ? 'remove' : isCorrect ? 'checkmark' : 'close'}
                        size={15}
                        color={isSkipped ? '#8899BB' : isCorrect ? '#22D3A3' : '#F87171'}
                      />
                    </View>
                    <Badge label={q.difficulty} color={DIFFICULTY_COLORS[q.difficulty]} size="sm" />
                    <Badge label={q.chapter} color="#4A5B8C" size="sm" />
                  </View>

                  <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#0D1130', lineHeight: 22, marginBottom: 12 }}>
                    {i + 1}. {q.content}
                  </Text>

                  {/* Answers */}
                  {!isSkipped && !isCorrect && (
                    <View style={{ backgroundColor: '#FEF2F2', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                      <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#F87171' }}>
                        Your answer: {String(yourAnswer)}
                      </Text>
                    </View>
                  )}
                  {isSkipped && (
                    <View style={{ backgroundColor: '#F5F7FF', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                      <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB' }}>Skipped</Text>
                    </View>
                  )}
                  <View style={{ backgroundColor: '#ECFDF9', borderRadius: 10, padding: 10, marginBottom: 8 }}>
                    <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#22D3A3' }}>
                      ✓ Correct: {String(q.correctAnswer)}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: '#EEF4FF', borderRadius: 10, padding: 10 }}>
                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#4A5B8C', lineHeight: 18 }}>
                      💡 {q.explanation}
                    </Text>
                  </View>
                </Card>
              );
            })}
          </View>

          <View style={{ marginTop: 24 }}>
            <Button label="Back to Tests" onPress={() => router.replace('/(student)/tests')} fullWidth size="lg" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

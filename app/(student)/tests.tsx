import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { getTestsForStudent, getAttemptsByStudent } from '@/services/testService';
import { EXAM_COLORS } from '@/constants/theme';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function StudentTestsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const batchIds = (user as any)?.batchIds ?? ['batch-1'];
  const [tab, setTab] = useState<'upcoming' | 'completed'>('upcoming');

  const allTests = getTestsForStudent(user?.id ?? 'student-1', batchIds);
  const attempts = getAttemptsByStudent(user?.id ?? 'student-1');
  const attemptedIds = new Set(attempts.map((a) => a.testId));

  const upcoming = allTests.filter((t) => !attemptedIds.has(t.id));
  const completed = allTests.filter((t) => attemptedIds.has(t.id));

  const displayed = tab === 'upcoming' ? upcoming : completed;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      {/* Header */}
      <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, color: '#fff', letterSpacing: -0.5 }}>My Tests</Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
          {(['upcoming', 'completed'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={{
                paddingHorizontal: 20,
                paddingVertical: 8,
                borderRadius: 999,
                backgroundColor: tab === t ? '#7B5CFF' : 'rgba(255,255,255,0.1)',
              }}
            >
              <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: tab === t ? '#fff' : '#8899BB' }}>
                {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Completed (${completed.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {displayed.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title={tab === 'upcoming' ? 'No upcoming tests' : 'No completed tests'}
          description={tab === 'upcoming' ? 'Your teacher will assign tests here' : 'Complete a test to see results'}
        />
      ) : (
        <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}>
          <View style={{ gap: 12 }}>
            {displayed.map((test) => {
              const attempt = attempts.find((a) => a.testId === test.id);
              const pct = attempt ? Math.round((attempt.score / attempt.totalMarks) * 100) : null;

              return (
                <Card key={test.id}>
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                    <Badge label={test.examType} color={EXAM_COLORS[test.examType]} size="sm" />
                    {test.subject && <Badge label={test.subject} color="#4A5B8C" size="sm" />}
                  </View>

                  <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 15, color: '#0D1130', marginBottom: 10 }}>
                    {test.title}
                  </Text>

                  <View style={{ flexDirection: 'row', gap: 16, marginBottom: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="time-outline" size={13} color="#8899BB" />
                      <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB' }}>{test.config.timeLimit} min</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="help-circle-outline" size={13} color="#8899BB" />
                      <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB' }}>{test.questionIds.length} questions</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons name="trophy-outline" size={13} color="#8899BB" />
                      <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB' }}>{test.config.totalMarks} marks</Text>
                    </View>
                  </View>

                  {pct !== null && attempt && (
                    <View style={{ backgroundColor: pct >= 70 ? '#ECFDF9' : pct >= 50 ? '#FFFBEB' : '#FEF2F2', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: pct >= 70 ? '#22D3A3' : pct >= 50 ? '#FBBF24' : '#F87171' }}>
                        {pct}%
                      </Text>
                      <View>
                        <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#0D1130' }}>
                          {attempt.score}/{attempt.totalMarks} marks
                        </Text>
                        {attempt.rank && (
                          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#4A5B8C' }}>Rank #{attempt.rank}</Text>
                        )}
                      </View>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {tab === 'upcoming' ? (
                      <TouchableOpacity
                        onPress={() => router.push(`/(student)/test/${test.id}`)}
                        style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
                      >
                        <LinearGradient colors={['#7B5CFF', '#4F8FFF']} style={{ paddingVertical: 12, alignItems: 'center' }}>
                          <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#fff' }}>Start Test</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          const a = attempts.find((a) => a.testId === test.id);
                          if (a) router.push(`/(student)/results/${a.id}`);
                        }}
                        style={{ flex: 1, backgroundColor: '#F5F7FF', borderRadius: 12, paddingVertical: 12, alignItems: 'center' }}
                      >
                        <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#4A5B8C' }}>View Results</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </Card>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

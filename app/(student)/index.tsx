import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { getTestsForStudent, getAttemptsByStudent } from '@/services/testService';
import { EXAM_COLORS } from '@/constants/theme';

export default function StudentDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const batchIds = (user as any)?.batchIds ?? [];
  const assignedTests = getTestsForStudent(user?.id ?? 'student-1', batchIds);
  const attempts = getAttemptsByStudent(user?.id ?? 'student-1');

  const upcoming = assignedTests.filter(
    (t) => !attempts.find((a) => a.testId === t.id) && t.status === 'published',
  );
  const recent = attempts.slice(0, 3);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, a) => acc + (a.score / a.totalMarks) * 100, 0) / attempts.length)
      : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      {/* Header */}
      <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB' }}>{greeting},</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: '#fff', marginTop: 2, letterSpacing: -0.5 }}>
              {user?.name ?? 'Student'}
            </Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#7B5CFF', marginTop: 2 }}>
              {(user as any)?.examType ?? 'JEE Mains'}
            </Text>
          </View>
          <TouchableOpacity style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(123,92,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="notifications-outline" size={20} color="#7B5CFF" />
          </TouchableOpacity>
        </View>

        {/* Quick stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          {[
            { label: 'Tests taken', value: attempts.length, icon: 'checkmark-circle' as const, color: '#22D3A3' },
            { label: 'Avg. score', value: `${avgScore}%`, icon: 'trophy' as const, color: '#FBBF24' },
            { label: 'Upcoming', value: upcoming.length, icon: 'time' as const, color: '#7B5CFF' },
          ].map((s) => (
            <View
              key={s.label}
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(123,92,255,0.15)' }}
            >
              <Ionicons name={s.icon} size={16} color={s.color} />
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: '#fff', marginTop: 4 }}>{s.value}</Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#8899BB' }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}>
        {/* Upcoming test banner */}
        {upcoming.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push(`/(student)/test/${upcoming[0].id}`)}
            activeOpacity={0.9}
            style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}
          >
            <LinearGradient colors={['#7B5CFF', '#4F8FFF']} style={{ padding: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#22D3A3' }} />
                <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.5 }}>
                  UPCOMING TEST
                </Text>
              </View>
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 17, color: '#fff', letterSpacing: -0.3 }} numberOfLines={2}>
                {upcoming[0].title}
              </Text>
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.6)" />
                  <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                    {upcoming[0].config.timeLimit} min
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="help-circle-outline" size={13} color="rgba(255,255,255,0.6)" />
                  <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                    {upcoming[0].questionIds.length} questions
                  </Text>
                </View>
              </View>
              <View style={{ marginTop: 16, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#fff' }}>Start Test →</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Practice CTA */}
        <Card style={{ marginBottom: 24, backgroundColor: '#F3EFFE', borderWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#7B5CFF', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="sparkles" size={24} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130' }}>Practice with AI</Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#4A5B8C', marginTop: 2 }}>
                Generate custom questions instantly
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/(student)/practice')}
              style={{ backgroundColor: '#7B5CFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 }}
            >
              <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 12, color: '#fff' }}>Start</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Recent Results */}
        {recent.length > 0 && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130' }}>Recent Results</Text>
              <TouchableOpacity onPress={() => router.push('/(student)/tests')}>
                <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#7B5CFF' }}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={{ gap: 10 }}>
              {recent.map((attempt) => {
                const pct = Math.round((attempt.score / attempt.totalMarks) * 100);
                const test = getTestsForStudent('student-1', ['batch-1', 'batch-2']).find((t) => t.id === attempt.testId);
                return (
                  <TouchableOpacity
                    key={attempt.id}
                    onPress={() => router.push(`/(student)/results/${attempt.id}`)}
                    activeOpacity={0.85}
                  >
                    <Card>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                        <View
                          style={{
                            width: 52,
                            height: 52,
                            borderRadius: 16,
                            backgroundColor: pct >= 70 ? '#ECFDF9' : pct >= 50 ? '#FFFBEB' : '#FEF2F2',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: pct >= 70 ? '#22D3A3' : pct >= 50 ? '#FBBF24' : '#F87171' }}>
                            {pct}%
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#0D1130' }} numberOfLines={1}>
                            {test?.title ?? 'Practice Test'}
                          </Text>
                          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}>
                            {attempt.score}/{attempt.totalMarks} marks
                            {attempt.rank ? ` · Rank #${attempt.rank}` : ''}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color="#C7D2E8" />
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

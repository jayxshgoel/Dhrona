import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MOCK_STUDENT, MOCK_ATTEMPTS, MOCK_TESTS } from '@/services/mock/data';
import { EXAM_COLORS } from '@/constants/theme';

export default function ChildDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const child = MOCK_STUDENT;
  const attempts = MOCK_ATTEMPTS.filter((a) => a.studentId === child.id);
  const avgScore =
    attempts.length > 0
      ? Math.round(attempts.reduce((acc, a) => acc + (a.score / a.totalMarks) * 100, 0) / attempts.length)
      : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      {/* Header */}
      <LinearGradient colors={['#22D3A3', '#16B892']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 28, color: '#fff' }}>{child.name[0]}</Text>
          </View>
          <View>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: '#fff', letterSpacing: -0.5 }}>{child.name}</Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
              {child.examType} aspirant
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, backgroundColor: child.tier === 'free' ? 'rgba(255,255,255,0.2)' : 'rgba(123,92,255,0.4)' }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 11, color: '#fff' }}>
                  {child.tier === 'free' ? 'Free Plan' : 'Premium'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
          {[
            { label: 'Tests', value: attempts.length },
            { label: 'Avg Score', value: `${avgScore}%` },
            { label: 'Best Rank', value: attempts.length > 0 ? `#${Math.min(...attempts.map((a) => a.rank ?? 99))}` : '—' },
          ].map((s) => (
            <View key={s.label} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 14, padding: 12, alignItems: 'center' }}>
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: '#fff' }}>{s.value}</Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}>
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130', marginBottom: 14 }}>Test History</Text>

        {attempts.length === 0 ? (
          <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
            <Ionicons name="document-text-outline" size={36} color="#C7D2E8" />
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 10 }}>No tests completed yet</Text>
          </Card>
        ) : (
          <View style={{ gap: 12 }}>
            {attempts.map((attempt) => {
              const test = MOCK_TESTS.find((t) => t.id === attempt.testId);
              const pct = Math.round((attempt.score / attempt.totalMarks) * 100);
              const minutes = Math.floor(attempt.timeTaken / 60);

              return (
                <Card key={attempt.id}>
                  {test && (
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                      <Badge label={test.examType} color={EXAM_COLORS[test.examType]} size="sm" />
                      {test.subject && <Badge label={test.subject} color="#4A5B8C" size="sm" />}
                    </View>
                  )}
                  <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#0D1130', marginBottom: 12 }}>
                    {test?.title ?? 'Test'}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    {/* Score donut-like indicator */}
                    <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: pct >= 70 ? '#ECFDF9' : pct >= 50 ? '#FFFBEB' : '#FEF2F2', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: pct >= 70 ? '#22D3A3' : pct >= 50 ? '#FBBF24' : '#F87171' }}>
                        {pct}%
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB' }}>Score</Text>
                        <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#0D1130' }}>
                          {attempt.score}/{attempt.totalMarks}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB' }}>Time taken</Text>
                        <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#0D1130' }}>
                          {minutes} min
                        </Text>
                      </View>
                      {attempt.rank && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB' }}>Batch rank</Text>
                          <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#0D1130' }}>
                            #{attempt.rank} · {attempt.percentile}th %ile
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

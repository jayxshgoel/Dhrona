import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { useChildrenStore } from '@/store/childrenStore';
import { MOCK_ATTEMPTS, MOCK_TESTS } from '@/services/mock/data';

const CHILD_ACCENT_COLORS = ['#22D3A3', '#7B5CFF', '#4F8FFF', '#FBBF24', '#F87171'];

export default function ParentDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { children, selectedChildId, selectChild } = useChildrenStore();

  const child = children.find((c) => c.id === selectedChildId) ?? children[0];
  const childAttempts = MOCK_ATTEMPTS.filter((a) => a.studentId === child?.id);
  const upcomingTests = MOCK_TESTS.filter(
    (t) => t.status === 'published' && !childAttempts.find((a) => a.testId === t.id),
  );

  const avgScore =
    childAttempts.length > 0
      ? Math.round(childAttempts.reduce((acc, a) => acc + (a.score / a.totalMarks) * 100, 0) / childAttempts.length)
      : 0;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 }}>

        {/* Top row: greeting + settings */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB' }}>{greeting},</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: '#fff', marginTop: 2, letterSpacing: -0.5 }}>
              {user?.name ?? 'Parent'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings' as any)}
            style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(34,211,163,0.15)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="person-circle-outline" size={22} color="#22D3A3" />
          </TouchableOpacity>
        </View>

        {/* ── Children switcher ─────────────────────────────────────── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingRight: 4 }}
            style={{ flex: 1 }}
          >
            {children.map((c, idx) => {
              const isActive = c.id === selectedChildId;
              const color = CHILD_ACCENT_COLORS[idx % CHILD_ACCENT_COLORS.length];
              return (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => selectChild(c.id)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor: isActive ? color + '30' : 'rgba(255,255,255,0.07)',
                    borderWidth: 1.5,
                    borderColor: isActive ? color : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: isActive ? color : 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 11, color: '#fff' }}>
                      {c.name[0]}
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: isActive ? '#fff' : '#8899BB' }}>
                    {c.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Add child button */}
          <TouchableOpacity
            onPress={() => router.push('/(parent)/link-child' as any)}
            style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(34,211,163,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(34,211,163,0.25)', flexShrink: 0 }}
          >
            <Ionicons name="add" size={20} color="#22D3A3" />
          </TouchableOpacity>
        </View>

      </LinearGradient>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}>

        {child ? (
          <>
            {/* Child detail link */}
            <TouchableOpacity
              onPress={() => router.push(`/(parent)/child/${child.id}`)}
              activeOpacity={0.85}
              style={{ marginBottom: 20 }}
            >
              <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#22D3A3', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: '#fff' }}>{child.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130' }}>{child.name}</Text>
                  <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}>
                    {child.examType} · {child.tier === 'free' ? 'Free Plan' : 'Premium'}
                  </Text>
                </View>
                <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#22D3A3' }}>Full report →</Text>
              </Card>
            </TouchableOpacity>

            {/* Performance overview */}
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130', marginBottom: 12 }}>Performance Overview</Text>
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
              {[
                { label: 'Tests Taken', value: childAttempts.length, icon: 'checkmark-circle' as const, color: '#22D3A3' },
                { label: 'Avg Score', value: `${avgScore}%`, icon: 'bar-chart' as const, color: '#7B5CFF' },
                { label: 'Upcoming', value: upcomingTests.length, icon: 'time' as const, color: '#FBBF24' },
              ].map((s) => (
                <Card key={s.label} style={{ flex: 1, alignItems: 'center', paddingVertical: 16 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: s.color + '18', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                    <Ionicons name={s.icon} size={18} color={s.color} />
                  </View>
                  <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: '#0D1130' }}>{s.value}</Text>
                  <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#8899BB', textAlign: 'center', marginTop: 2 }}>{s.label}</Text>
                </Card>
              ))}
            </View>

            {/* Upgrade banner */}
            {user?.tier === 'free' && (
              <TouchableOpacity onPress={() => router.push('/(parent)/subscription')} activeOpacity={0.9} style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 24 }}>
                <LinearGradient colors={['#7B5CFF', '#4F8FFF']} style={{ padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="diamond" size={22} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#fff' }}>Upgrade to Premium</Text>
                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                      Unlimited practice · Full analytics · ₹299/month
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            )}

            {/* Recent tests */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130' }}>Recent Tests</Text>
              <TouchableOpacity onPress={() => router.push(`/(parent)/child/${child.id}`)}>
                <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#22D3A3' }}>View all</Text>
              </TouchableOpacity>
            </View>

            {childAttempts.length === 0 ? (
              <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
                <Ionicons name="document-text-outline" size={36} color="#C7D2E8" />
                <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 10 }}>
                  No tests taken yet
                </Text>
              </Card>
            ) : (
              <View style={{ gap: 10 }}>
                {childAttempts.slice(0, 3).map((attempt) => {
                  const test = MOCK_TESTS.find((t) => t.id === attempt.testId);
                  const pct = Math.round((attempt.score / attempt.totalMarks) * 100);
                  return (
                    <Card key={attempt.id}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                        <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: pct >= 70 ? '#ECFDF9' : pct >= 50 ? '#FFFBEB' : '#FEF2F2', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: pct >= 70 ? '#22D3A3' : pct >= 50 ? '#FBBF24' : '#F87171' }}>
                            {pct}%
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#0D1130' }} numberOfLines={1}>
                            {test?.title ?? 'Test'}
                          </Text>
                          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}>
                            {attempt.score}/{attempt.totalMarks} marks{attempt.rank ? ` · Rank #${attempt.rank}` : ''}
                          </Text>
                        </View>
                        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: pct >= 70 ? '#ECFDF9' : pct >= 50 ? '#FFFBEB' : '#FEF2F2' }}>
                          <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 11, color: pct >= 70 ? '#22D3A3' : pct >= 50 ? '#FBBF24' : '#F87171' }}>
                            {pct >= 70 ? 'Good' : pct >= 50 ? 'Average' : 'Needs Work'}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </View>
            )}

            {/* Upcoming tests */}
            {upcomingTests.length > 0 && (
              <>
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130', marginTop: 24, marginBottom: 12 }}>Upcoming Tests</Text>
                <View style={{ gap: 10 }}>
                  {upcomingTests.slice(0, 2).map((t) => (
                    <Card key={t.id}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="calendar" size={20} color="#4F8FFF" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#0D1130' }} numberOfLines={1}>{t.title}</Text>
                          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}>
                            {t.config.timeLimit} min · {t.questionIds.length} questions
                          </Text>
                        </View>
                        <Badge label={t.examType} color="#4F8FFF" size="sm" />
                      </View>
                    </Card>
                  ))}
                </View>
              </>
            )}
          </>
        ) : (
          /* No children linked yet */
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <Ionicons name="people-outline" size={36} color="#4F8FFF" />
            </View>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: '#0D1130', textAlign: 'center' }}>
              No children linked yet
            </Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: '#8899BB', textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
              Link your child's Dhrona account to monitor their progress.
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(parent)/link-child' as any)}
              activeOpacity={0.85}
              style={{ marginTop: 24, borderRadius: 14, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={['#22D3A3', '#0D9488']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 14, paddingHorizontal: 28, flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <Ionicons name="add-circle-outline" size={18} color="#fff" />
                <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 14, color: '#fff' }}>Link a Child</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

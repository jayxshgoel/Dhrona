import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuthStore } from '@/store/authStore';
import { getTestsByTeacher } from '@/services/testService';
import { getBatchesByTeacher } from '@/services/batchService';
import { getQuestionBank } from '@/services/questionService';
import { EXAM_COLORS } from '@/constants/theme';

export default function TeacherDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const tests = getTestsByTeacher(user?.id ?? 'teacher-1');
  const batches = getBatchesByTeacher(user?.id ?? 'teacher-1');
  const questions = getQuestionBank();

  const activeTests = tests.filter((t) => t.status === 'published' || t.status === 'active');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      {/* Header */}
      <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB' }}>{greeting},</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: '#fff', marginTop: 2, letterSpacing: -0.5 }}>{user?.name ?? 'Teacher'}</Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#4F8FFF', marginTop: 2 }}>
              {(user as any)?.institution ?? 'Aakash Institute'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings' as any)}
            style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: 'rgba(79,143,255,0.15)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="person-circle-outline" size={22} color="#4F8FFF" />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          {[
            { label: 'Tests', value: tests.length, icon: 'document-text' as const },
            { label: 'Questions', value: questions.length, icon: 'help-circle' as const },
            { label: 'Batches', value: batches.length, icon: 'people' as const },
          ].map((s) => (
            <View
              key={s.label}
              style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(79,143,255,0.15)' }}
            >
              <Ionicons name={s.icon} size={16} color="#4F8FFF" />
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: '#fff', marginTop: 4 }}>{s.value}</Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#8899BB' }}>{s.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingBottom: 32, paddingTop: 20 }}>
        {/* Quick Actions */}
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130', marginBottom: 12 }}>Quick Actions</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
          <TouchableOpacity
            onPress={() => router.push('/(teacher)/generate')}
            activeOpacity={0.85}
            style={{ flex: 1, borderRadius: 20, overflow: 'hidden' }}
          >
            <LinearGradient colors={['#4F8FFF', '#7B5CFF']} style={{ padding: 18, alignItems: 'center', gap: 8 }}>
              <Ionicons name="sparkles" size={24} color="#fff" />
              <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#fff', textAlign: 'center' }}>Generate Questions</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(teacher)/test-builder')}
            activeOpacity={0.85}
            style={{ flex: 1, backgroundColor: '#0D1130', borderRadius: 20, padding: 18, alignItems: 'center', gap: 8 }}
          >
            <Ionicons name="add-circle" size={24} color="#fff" />
            <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#fff', textAlign: 'center' }}>Create Test</Text>
          </TouchableOpacity>
        </View>

        {/* Active Tests */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130' }}>Active Tests</Text>
          <TouchableOpacity onPress={() => router.push('/(teacher)/tests')}>
            <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#4F8FFF' }}>See all</Text>
          </TouchableOpacity>
        </View>

        {activeTests.length === 0 ? (
          <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
            <Ionicons name="document-text-outline" size={36} color="#C7D2E8" />
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 8 }}>No active tests</Text>
          </Card>
        ) : (
          <View style={{ gap: 10, marginBottom: 24 }}>
            {activeTests.slice(0, 3).map((test) => (
              <Card key={test.id}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, marginRight: 12 }}>
                    <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#0D1130' }} numberOfLines={2}>
                      {test.title}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                      <Badge label={test.examType} color={EXAM_COLORS[test.examType]} size="sm" />
                      <Badge label={`${test.questionIds.length}Q`} color="#4A5B8C" size="sm" />
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: test.status === 'published' ? '#FFFBEB' : '#ECFDF9' }}>
                      <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 11, color: test.status === 'published' ? '#92400E' : '#065F46' }}>
                        {test.status === 'published' ? 'Upcoming' : 'Live'}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#8899BB' }}>{test.config.timeLimit} min</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Batches */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130' }}>My Batches</Text>
          <TouchableOpacity onPress={() => router.push('/(teacher)/batches')}>
            <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#4F8FFF' }}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={{ gap: 10 }}>
          {batches.map((batch) => (
            <Card key={batch.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="people" size={20} color="#4F8FFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#0D1130' }}>{batch.name}</Text>
                  <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}>
                    {batch.studentIds.length} students · {batch.examType}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#C7D2E8" />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { getTestsByTeacher, updateTestStatus } from '@/services/testService';
import { EXAM_COLORS } from '@/constants/theme';
import { Test } from '@/types';

type Tab = 'upcoming' | 'active' | 'completed' | 'draft';

const TABS: { key: Tab; label: string }[] = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'draft', label: 'Drafts' },
];

function statusToTab(status: Test['status']): Tab {
  if (status === 'published') return 'upcoming';
  if (status === 'active') return 'active';
  if (status === 'completed') return 'completed';
  return 'draft';
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TeacherTestsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [refreshKey, setRefreshKey] = useState(0);

  const allTests = getTestsByTeacher(user?.id ?? 'teacher-1');
  const filtered = allTests.filter((t) => statusToTab(t.status) === activeTab);

  function handlePublish(id: string) {
    Alert.alert('Publish Test', 'Publish this test to students?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Publish',
        onPress: () => { updateTestStatus(id, 'published'); setRefreshKey((k) => k + 1); },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, color: '#fff', letterSpacing: -0.5 }}>My Tests</Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 4 }}>{allTests.length} tests total</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(teacher)/test-builder')}
            style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#4F8FFF', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.1)' }}
              >
                <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: activeTab === tab.key ? '#0D1130' : '#8899BB' }}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      {filtered.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title={`No ${activeTab} tests`}
          description="Create a new test to get started"
          actionLabel="Create Test"
          onAction={() => router.push('/(teacher)/test-builder')}
        />
      ) : (
        <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="gap-3">
            {filtered.map((test) => (
              <Card key={test.id} padding="md">
                <View className="flex-row gap-2 mb-2">
                  <Badge label={test.examType} color={EXAM_COLORS[test.examType]} size="sm" />
                  {test.subject && (
                    <Badge label={test.subject} color="#64748B" size="sm" />
                  )}
                </View>
                <Text className="text-gray-900 font-semibold text-base mb-1">{test.title}</Text>

                <View className="flex-row gap-4 mb-3">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="help-circle-outline" size={14} color="#94A3B8" />
                    <Text className="text-gray-400 text-xs">{test.questionIds.length} questions</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="time-outline" size={14} color="#94A3B8" />
                    <Text className="text-gray-400 text-xs">{test.config.timeLimit} min</Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="trophy-outline" size={14} color="#94A3B8" />
                    <Text className="text-gray-400 text-xs">{test.config.totalMarks} marks</Text>
                  </View>
                </View>

                {test.scheduledAt && (
                  <View className="flex-row items-center gap-1 mb-3">
                    <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
                    <Text className="text-gray-400 text-xs">{formatDate(test.scheduledAt)}</Text>
                  </View>
                )}

                <View className="flex-row gap-2 pt-3 border-t border-gray-100">
                  {test.status === 'draft' && (
                    <TouchableOpacity
                      onPress={() => handlePublish(test.id)}
                      className="flex-1 bg-teal-600 py-2.5 rounded-xl items-center"
                    >
                      <Text className="text-white text-sm font-semibold">Publish</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity className="flex-1 bg-gray-100 py-2.5 rounded-xl items-center">
                    <Text className="text-gray-700 text-sm font-semibold">View Details</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

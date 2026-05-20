import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';

const ROLES: {
  role: UserRole;
  label: string;
  icon: string;
  description: string;
  perks: string[];
  accent: string;
}[] = [
  {
    role: 'teacher',
    label: 'Teacher',
    icon: '👨‍🏫',
    description: 'Create AI-powered questions and assign tests to batches',
    perks: ['AI Generator', 'Test Builder', 'Batch Management', 'Student Tracking'],
    accent: '#4F8FFF',
  },
  {
    role: 'student',
    label: 'Student',
    icon: '🎓',
    description: 'Practice with AI questions and take assigned tests',
    perks: ['Self-Practice', 'Assigned Tests', 'Scores & Solutions', 'Progress View'],
    accent: '#7B5CFF',
  },
  {
    role: 'parent',
    label: 'Parent',
    icon: '👨‍👩‍👧',
    description: "Monitor your child's progress and manage subscription",
    perks: ["Test History", 'Score Reports', 'Push Alerts', 'Subscription'],
    accent: '#22D3A3',
  },
];

export default function RoleScreen() {
  const router = useRouter();
  const { selectRole } = useAuthStore();
  const [selected, setSelected] = useState<UserRole | null>(null);

  function handleContinue() {
    if (!selected) return;
    selectRole(selected);
    router.replace(`/(${selected})` as any);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32 }}>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 28, color: '#fff', letterSpacing: -0.5 }}>I am a...</Text>
          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 8 }}>
            Choose your role to personalise your experience
          </Text>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20, paddingTop: 20, gap: 14 }}>
          {ROLES.map(({ role, label, icon, description, perks, accent }) => {
            const isSelected = selected === role;
            return (
              <TouchableOpacity
                key={role}
                onPress={() => setSelected(role)}
                activeOpacity={0.85}
                style={{
                  backgroundColor: isSelected ? accent + '10' : '#fff',
                  borderRadius: 20,
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? accent : '#E8EDF8',
                  padding: 18,
                  elevation: isSelected ? 6 : 1,
                  shadowColor: isSelected ? accent : '#000',
                  shadowOpacity: isSelected ? 0.18 : 0.04,
                  shadowRadius: 12,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                  <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: isSelected ? accent : '#F5F7FF', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 28 }}>{icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: isSelected ? accent : '#0D1130' }}>{label}</Text>
                      {isSelected && (
                        <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: accent, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ color: '#fff', fontSize: 11, fontFamily: 'PlusJakartaSans_700Bold' }}>✓</Text>
                        </View>
                      )}
                    </View>
                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#4A5B8C', marginTop: 2 }}>{description}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                  {perks.map((p) => (
                    <View
                      key={p}
                      style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: isSelected ? accent + '18' : '#F5F7FF' }}
                    >
                      <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 11, color: isSelected ? accent : '#4A5B8C' }}>{p}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={{ marginTop: 8, marginBottom: 32 }}>
            <Button label="Continue" onPress={handleContinue} fullWidth size="lg" disabled={!selected} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

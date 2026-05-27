import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { useChildrenStore } from '@/store/childrenStore';
import { Student, ExamType } from '@/types';

// ---------------------------------------------------------------------------
// Mock student lookup — replace with a real API call:
//   GET /api/students/find?phone=+91XXXXXXXXXX
// Returns the student's public profile if they have a Dhrona account.
// ---------------------------------------------------------------------------
const DEMO_STUDENTS: Record<string, { name: string; examType: ExamType }> = {
  '9999999999': { name: 'Priya Sharma', examType: 'NEET' },
  '9876543211': { name: 'Arjun Patel', examType: 'JEE Mains' },
};

async function findStudentByPhone(phone: string): Promise<Student | null> {
  await new Promise((r) => setTimeout(r, 1400));
  const demo = DEMO_STUDENTS[phone] ?? { name: 'Riya Verma', examType: 'JEE Mains' as ExamType };
  return {
    id: `student-${phone}`,
    phone: `+91${phone}`,
    name: demo.name,
    role: 'student',
    tier: 'free',
    batchIds: [],
    examType: demo.examType,
  };
}

type Step = 'input' | 'found' | 'linked';

export default function LinkChildScreen() {
  const router = useRouter();
  const { addChild, children } = useChildrenStore();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundStudent, setFoundStudent] = useState<Student | null>(null);
  const [step, setStep] = useState<Step>('input');

  async function handleFind() {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const student = await findStudentByPhone(phone);
      if (student) {
        setFoundStudent(student);
        setStep('found');
      } else {
        setError('No Dhrona account found with this number. Ask your child to sign up first.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleLink() {
    if (!foundStudent) return;
    addChild(foundStudent);
    setStep('linked');
  }

  function handleDone() {
    router.back();
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Header */}
        <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}
            >
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </TouchableOpacity>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: '#fff', letterSpacing: -0.3 }}>
              Link a Child
            </Text>
          </View>
          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', lineHeight: 20 }}>
            Enter your child's registered phone number to link their account to yours.
          </Text>
        </LinearGradient>

        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingTop: 24, paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
        >

          {/* ── Step: LINKED ─────────────────────────────────────────── */}
          {step === 'linked' && foundStudent && (
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
              <LinearGradient
                colors={['#22D3A3', '#0D9488']}
                style={{ width: 80, height: 80, borderRadius: 26, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}
              >
                <Ionicons name="checkmark" size={42} color="#fff" />
              </LinearGradient>

              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: '#0D1130', textAlign: 'center', letterSpacing: -0.4 }}>
                Account Linked!
              </Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: '#4A5B8C', textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
                {foundStudent.name}'s account has been linked.{'\n'}You can now monitor their progress from your dashboard.
              </Text>

              <Card style={{ width: '100%', marginTop: 28 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: '#22D3A3', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 22, color: '#fff' }}>
                      {foundStudent.name[0]}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#0D1130' }}>{foundStudent.name}</Text>
                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}>
                      {foundStudent.examType} · Free Plan
                    </Text>
                  </View>
                </View>
              </Card>

              <TouchableOpacity
                onPress={handleDone}
                activeOpacity={0.85}
                style={{ marginTop: 28, width: '100%', borderRadius: 16, overflow: 'hidden' }}
              >
                <LinearGradient
                  colors={['#22D3A3', '#0D9488']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={{ paddingVertical: 16, alignItems: 'center' }}
                >
                  <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#fff' }}>
                    Go to Dashboard →
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* ── Step: FOUND ──────────────────────────────────────────── */}
          {step === 'found' && foundStudent && (
            <View>
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, color: '#0D1130', marginBottom: 12 }}>
                Student found
              </Text>

              <Card style={{ marginBottom: 20, borderWidth: 2, borderColor: '#22D3A3' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: '#22D3A3', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, color: '#fff' }}>
                      {foundStudent.name[0]}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#0D1130' }}>{foundStudent.name}</Text>
                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 2 }}>
                      {foundStudent.examType} · {foundStudent.phone}
                    </Text>
                  </View>
                  <Ionicons name="checkmark-circle" size={22} color="#22D3A3" />
                </View>
              </Card>

              {/* Already linked warning */}
              {children.find((c) => c.id === foundStudent.id) && (
                <View style={{ flexDirection: 'row', gap: 10, backgroundColor: '#FFFBEB', borderRadius: 12, padding: 12, marginBottom: 16, alignItems: 'flex-start' }}>
                  <Ionicons name="warning-outline" size={16} color="#FBBF24" style={{ marginTop: 1 }} />
                  <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#92400E', flex: 1 }}>
                    This account is already linked to your profile.
                  </Text>
                </View>
              )}

              <View style={{ gap: 10 }}>
                <TouchableOpacity
                  onPress={handleLink}
                  disabled={!!children.find((c) => c.id === foundStudent.id)}
                  activeOpacity={0.85}
                  style={{ borderRadius: 16, overflow: 'hidden', opacity: children.find((c) => c.id === foundStudent.id) ? 0.5 : 1 }}
                >
                  <LinearGradient
                    colors={['#22D3A3', '#0D9488']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{ paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                  >
                    <Ionicons name="link" size={18} color="#fff" />
                    <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#fff' }}>
                      Link {foundStudent.name.split(' ')[0]}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => { setStep('input'); setFoundStudent(null); setPhone(''); }}
                  style={{ paddingVertical: 14, alignItems: 'center' }}
                >
                  <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#8899BB' }}>
                    Search different number
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ── Step: INPUT ──────────────────────────────────────────── */}
          {step === 'input' && (
            <View>
              <Card>
                <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#4A5B8C', marginBottom: 8 }}>
                  Child's phone number
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#E8EDF8', borderRadius: 14, overflow: 'hidden', marginBottom: 4 }}>
                  <View style={{ paddingHorizontal: 14, paddingVertical: 14, backgroundColor: '#F5F7FF', borderRightWidth: 1, borderRightColor: '#E8EDF8' }}>
                    <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#4A5B8C' }}>+91</Text>
                  </View>
                  <TextInput
                    value={phone}
                    onChangeText={(t) => { setPhone(t.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                    placeholder="10-digit mobile number"
                    placeholderTextColor="#C7D2E8"
                    keyboardType="number-pad"
                    maxLength={10}
                    style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 14, fontFamily: 'PlusJakartaSans_500Medium', fontSize: 15, color: '#0D1130' }}
                  />
                  {phone.length === 10 && (
                    <Ionicons name="checkmark-circle" size={20} color="#22D3A3" style={{ marginRight: 14 }} />
                  )}
                </View>

                {error ? (
                  <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#F87171', marginTop: 6 }}>
                    {error}
                  </Text>
                ) : null}
              </Card>

              <View style={{ marginTop: 20 }}>
                {loading ? (
                  <View style={{ alignItems: 'center', paddingVertical: 20, gap: 12 }}>
                    <ActivityIndicator size="large" color="#22D3A3" />
                    <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB' }}>
                      Looking up account...
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={handleFind}
                    disabled={phone.length !== 10}
                    activeOpacity={0.85}
                    style={{ borderRadius: 16, overflow: 'hidden', opacity: phone.length !== 10 ? 0.45 : 1 }}
                  >
                    <LinearGradient
                      colors={['#22D3A3', '#0D9488']}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={{ paddingVertical: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                    >
                      <Ionicons name="search" size={18} color="#fff" />
                      <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#fff' }}>
                        Find Student
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </View>

              {/* Info note */}
              <View style={{ marginTop: 24, flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                <Ionicons name="information-circle-outline" size={16} color="#8899BB" style={{ marginTop: 1 }} />
                <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', flex: 1, lineHeight: 18 }}>
                  Your child must already have a Dhrona account. They will be notified when you link their account.
                </Text>
              </View>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

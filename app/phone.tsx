import { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export default function PhoneScreen() {
  const router = useRouter();
  const { setPhone, sendOtp, isLoading } = useAuthStore();
  const [phone, setPhoneValue] = useState('');
  const [error, setError] = useState('');

  function validate() {
    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number');
      return false;
    }
    setError('');
    return true;
  }

  async function handleContinue() {
    if (!validate()) return;
    const fullPhone = '+91' + phone;
    setPhone(fullPhone);
    try {
      await sendOtp(fullPhone);
      router.push('/otp');
    } catch (e: any) {
      setError(e.message ?? 'Failed to send OTP. Try again.');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {/* Header gradient */}
          <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36 }}>
            <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 26, color: '#fff', letterSpacing: -0.5 }}>Enter your mobile</Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 6 }}>
                We'll send a 6-digit OTP to verify
              </Text>
            </View>
          </LinearGradient>

          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 28 }}>
            {/* Phone row */}
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, flexDirection: 'row', gap: 6, alignItems: 'center', borderWidth: 1, borderColor: '#E8EDF8' }}>
                <Text style={{ fontSize: 18 }}>🇮🇳</Text>
                <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#0D1130' }}>+91</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  value={phone}
                  onChangeText={(t) => { setPhoneValue(t.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                  keyboardType="phone-pad"
                  placeholder="9876543210"
                  maxLength={10}
                  error={error}
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                />
              </View>
            </View>

            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#8899BB', marginTop: 8 }}>
              By continuing you agree to Dhrona's Terms & Privacy Policy
            </Text>

            <View style={{ marginTop: 28 }}>
              <Button label="Send OTP" onPress={handleContinue} fullWidth size="lg" disabled={phone.length !== 10} loading={isLoading} />
            </View>

            {/* Divider */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 28 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E8EDF8' }} />
              <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB' }}>or</Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E8EDF8' }} />
            </View>

            <TouchableOpacity
              onPress={() => {}}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 14, marginTop: 16, borderWidth: 1, borderColor: '#E8EDF8' }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 18 }}>G</Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#0D1130' }}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

const OTP_LENGTH = 6;

export default function OtpScreen() {
  const router = useRouter();
  const { pendingPhone, verifyOtp, isLoading } = useAuthStore();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(30);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  function handleChange(text: string, index: number) {
    const digit = text.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function handleKeyPress(key: string, index: number) {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  async function handleVerify() {
    const code = otp.join('');
    if (code.length !== OTP_LENGTH) return;
    try {
      await verifyOtp(code);
      router.push('/role');
    } catch (e: any) {
      setOtp(Array(OTP_LENGTH).fill(''));
      inputs.current[0]?.focus();
    }
  }

  const full = otp.every((d) => d !== '');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 36 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 26, color: '#fff', letterSpacing: -0.5 }}>Verify OTP</Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 6 }}>
              Sent to {pendingPhone || '+91 98765 43210'}
            </Text>
          </View>
        </LinearGradient>

        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 36 }}>
          {/* OTP boxes */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                value={digit}
                onChangeText={(t) => handleChange(t, i)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                style={{
                  width: 48,
                  height: 56,
                  borderRadius: 14,
                  borderWidth: digit ? 2 : 1.5,
                  borderColor: digit ? '#4F8FFF' : '#E8EDF8',
                  textAlign: 'center',
                  fontSize: 22,
                  fontFamily: 'SpaceGrotesk_700Bold',
                  color: '#0D1130',
                  backgroundColor: digit ? '#EEF4FF' : '#fff',
                }}
              />
            ))}
          </View>

          {/* Resend */}
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            {timer > 0 ? (
              <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB' }}>
                Resend OTP in{' '}
                <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', color: '#4F8FFF' }}>{timer}s</Text>
              </Text>
            ) : (
              <TouchableOpacity onPress={() => setTimer(30)}>
                <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#4F8FFF' }}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>

          <Button label="Verify & Continue" onPress={handleVerify} fullWidth size="lg" loading={isLoading} disabled={!full} />

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

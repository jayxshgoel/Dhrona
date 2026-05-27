import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';
import { PLAN_DETAILS, PlanId } from '@/services/paymentService';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { planId, paymentId } = useLocalSearchParams<{ planId: PlanId; paymentId: string }>();

  const plan = planId ? PLAN_DETAILS[planId] : null;

  function handleContinue() {
    if (user?.role) {
      router.replace(`/(${user.role})` as any);
    } else {
      router.replace('/');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        {/* Success animation placeholder — swap for Lottie later */}
        <LinearGradient
          colors={['#22D3A3', '#0D9488']}
          style={{ width: 96, height: 96, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}
        >
          <Ionicons name="checkmark" size={52} color="#fff" />
        </LinearGradient>

        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 26, color: '#0D1130', textAlign: 'center', letterSpacing: -0.5 }}>
          Welcome to Premium!
        </Text>
        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 15, color: '#4A5B8C', textAlign: 'center', marginTop: 10, lineHeight: 23 }}>
          Your payment was successful. All premium features are now unlocked.
        </Text>

        {/* Plan summary card */}
        {plan && (
          <View style={{ marginTop: 32, width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#E8EDF8' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <LinearGradient
                colors={['#7B5CFF', '#4F8FFF']}
                style={{ width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="diamond" size={22} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#8899BB' }}>Active plan</Text>
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#0D1130', marginTop: 1 }}>
                  {plan.label}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: '#7B5CFF' }}>{plan.amountDisplay}</Text>
                <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB' }}>{plan.period}</Text>
              </View>
            </View>

            {paymentId && (
              <View style={{ marginTop: 14, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#F0F4FF' }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#8899BB' }}>
                  Payment ID: {paymentId}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Unlocked features */}
        <View style={{ marginTop: 24, width: '100%', gap: 10 }}>
          {[
            'Unlimited AI question generation',
            'Unlimited self-practice tests',
            'Full performance dashboard',
          ].map((f) => (
            <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Ionicons name="checkmark-circle" size={18} color="#22D3A3" />
              <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#0D1130' }}>{f}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* CTA */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 36 }}>
        <TouchableOpacity onPress={handleContinue} activeOpacity={0.85} style={{ borderRadius: 16, overflow: 'hidden' }}>
          <LinearGradient
            colors={['#22D3A3', '#0D9488']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 17, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#fff', letterSpacing: -0.2 }}>
              Start using Premium →
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

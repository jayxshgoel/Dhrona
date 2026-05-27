import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';
import { openRazorpayCheckout, PlanId } from '@/services/paymentService';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    color: '#8899BB',
    features: [
      '5 AI question generations / day',
      '2 practice tests / week',
      'Take all teacher-assigned tests',
      'Basic score view',
    ],
    missing: ['Performance dashboard', 'AI answer analysis', 'Weak topic detection'],
  },
  {
    id: 'monthly',
    name: 'Student Premium',
    price: '₹299',
    period: '/month',
    color: '#7B5CFF',
    badge: 'Most Popular',
    features: [
      'Unlimited AI question generation',
      'Unlimited practice tests',
      'Full performance dashboard',
      'Weak topic detection & alerts',
      'Progress reports shared with parents',
      'Priority support',
    ],
    missing: [],
  },
  {
    id: 'annual',
    name: 'Student Premium',
    price: '₹2,499',
    period: '/year',
    color: '#4F8FFF',
    badge: 'Save 30%',
    features: [
      'Everything in Monthly Premium',
      'Save ₹1,089 vs monthly',
      'Priority support year-round',
    ],
    missing: [],
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selected, setSelected] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const currentTier = user?.tier ?? 'free';

  async function handleUpgrade() {
    if (!selected || selected === 'free' || paying) return;
    setPaying(true);
    try {
      const result = await openRazorpayCheckout(
        selected as PlanId,
        user?.phone ?? '',
        user?.name ?? '',
      );
      router.replace({
        pathname: '/payment-success' as any,
        params: { planId: selected, paymentId: result.razorpay_payment_id },
      });
    } catch (err: any) {
      const code = String(err?.code ?? '');
      const description = err?.description as string | undefined;
      // code 0 = user cancelled — navigate to failure screen only for real errors
      if (code !== '0') {
        router.push({
          pathname: '/payment-failure' as any,
          params: { code, description },
        });
      }
    } finally {
      setPaying(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      {/* Header */}
      <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 }}>
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, color: '#fff', letterSpacing: -0.5 }}>Subscription</Text>
        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 6 }}>
          Upgrade to unlock unlimited practice and analytics
        </Text>

        {/* Current plan */}
        <View style={{ marginTop: 16, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(34,211,163,0.2)' }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#22D3A3', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="diamond" size={18} color="#fff" />
          </View>
          <View>
            <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#8899BB' }}>Current Plan</Text>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#fff', marginTop: 1 }}>
              {currentTier === 'free' ? 'Free Tier' : currentTier === 'premium' ? 'Student Premium' : 'Institution'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}>
        <View style={{ gap: 14 }}>
          {PLANS.map((plan) => {
            const isSelected = selected === plan.id;
            const isCurrent = currentTier === plan.id || (currentTier === 'premium' && plan.id !== 'free');

            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelected(plan.id)}
                activeOpacity={0.85}
                disabled={plan.id === 'free'}
              >
                <Card style={{ borderWidth: isSelected ? 2 : 1, borderColor: isSelected ? plan.color : '#E8EDF8' }}>
                  {plan.badge && (
                    <View style={{ position: 'absolute', top: -1, right: 16, backgroundColor: plan.color, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, transform: [{ translateY: -12 }] }}>
                      <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 11, color: '#fff' }}>{plan.badge}</Text>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                    <View>
                      <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB' }}>{plan.name}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2, marginTop: 2 }}>
                        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 28, color: plan.id === 'free' ? '#8899BB' : plan.color }}>
                          {plan.price}
                        </Text>
                        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB' }}>{plan.period}</Text>
                      </View>
                    </View>
                    {isCurrent ? (
                      <View style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: '#ECFDF9' }}>
                        <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 11, color: '#22D3A3' }}>Current</Text>
                      </View>
                    ) : (
                      <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: isSelected ? 0 : 2, borderColor: plan.color, backgroundColor: isSelected ? plan.color : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                        {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                      </View>
                    )}
                  </View>

                  <View style={{ gap: 6 }}>
                    {plan.features.map((f) => (
                      <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="checkmark-circle" size={16} color="#22D3A3" />
                        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#0D1130', flex: 1 }}>{f}</Text>
                      </View>
                    ))}
                    {plan.missing.map((f) => (
                      <View key={f} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="close-circle" size={16} color="#E8EDF8" />
                        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#C7D2E8', flex: 1 }}>{f}</Text>
                      </View>
                    ))}
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>

        {selected && selected !== 'free' && (
          <View style={{ marginTop: 24 }}>
            <TouchableOpacity
              onPress={handleUpgrade}
              disabled={paying}
              activeOpacity={0.85}
              style={{ borderRadius: 16, overflow: 'hidden', opacity: paying ? 0.7 : 1 }}
            >
              <LinearGradient
                colors={['#7B5CFF', '#4F8FFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 17, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}
              >
                {paying ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="lock-closed" size={16} color="#fff" />
                )}
                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#fff', letterSpacing: -0.2 }}>
                  {paying ? 'Opening payment...' : 'Upgrade Now →'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#8899BB', textAlign: 'center', marginTop: 12 }}>
              Secure payment via Razorpay · Cancel anytime
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

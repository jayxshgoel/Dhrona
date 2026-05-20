import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

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
  const { user } = useAuthStore();
  const [selected, setSelected] = useState<string | null>(null);
  const currentTier = user?.tier ?? 'free';

  function handleUpgrade() {
    if (!selected || selected === 'free') return;
    Alert.alert(
      'Upgrade to Premium',
      'This will redirect to Razorpay for payment. In demo mode, payment is simulated.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pay Now', onPress: () => Alert.alert('Payment Successful!', 'Welcome to Dhrona Premium! 🎉') },
      ],
    );
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
            <Button label="Upgrade Now →" onPress={handleUpgrade} fullWidth size="lg" />
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#8899BB', textAlign: 'center', marginTop: 12 }}>
              Secure payment via Razorpay. Cancel anytime.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import { View, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';

const ERROR_MESSAGES: Record<string, string> = {
  '0':         'Payment was cancelled.',
  '2':         'Network error — please check your connection and try again.',
  default:     'Something went wrong with your payment. You have not been charged.',
};

export default function PaymentFailureScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { code, description } = useLocalSearchParams<{ code?: string; description?: string }>();

  const message = code ? (ERROR_MESSAGES[code] ?? ERROR_MESSAGES.default) : ERROR_MESSAGES.default;
  const isCancelled = code === '0';

  function handleRetry() {
    router.back();
  }

  function handleDismiss() {
    if (user?.role) {
      router.replace(`/(${user.role})` as any);
    } else {
      router.replace('/');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
        {/* Icon */}
        <View
          style={{ width: 96, height: 96, borderRadius: 32, backgroundColor: isCancelled ? '#F1F5F9' : '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}
        >
          <Ionicons
            name={isCancelled ? 'close-circle-outline' : 'warning-outline'}
            size={52}
            color={isCancelled ? '#8899BB' : '#F87171'}
          />
        </View>

        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, color: '#0D1130', textAlign: 'center', letterSpacing: -0.4 }}>
          {isCancelled ? 'Payment Cancelled' : 'Payment Failed'}
        </Text>
        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 15, color: '#4A5B8C', textAlign: 'center', marginTop: 10, lineHeight: 23 }}>
          {description ?? message}
        </Text>

        {/* Reassurance */}
        {!isCancelled && (
          <View style={{ marginTop: 24, backgroundColor: '#FFF7ED', borderRadius: 14, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start', width: '100%' }}>
            <Ionicons name="shield-checkmark" size={20} color="#F59E0B" style={{ marginTop: 1 }} />
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#92400E', flex: 1, lineHeight: 20 }}>
              You have not been charged. If money was deducted, it will be refunded within 5–7 business days.
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 36, gap: 12 }}>
        <TouchableOpacity onPress={handleRetry} activeOpacity={0.85} style={{ borderRadius: 16, overflow: 'hidden' }}>
          <LinearGradient
            colors={['#7B5CFF', '#4F8FFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 17, alignItems: 'center' }}
          >
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#fff', letterSpacing: -0.2 }}>
              Try Again
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDismiss} style={{ paddingVertical: 14, alignItems: 'center' }}>
          <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#8899BB' }}>
            Maybe later
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  { icon: '✦', label: 'AI Question Generator', desc: 'JEE · NEET · CBSE exam-quality questions' },
  { icon: '◈', label: 'Smart Test Builder', desc: 'Timed tests with instant scoring' },
  { icon: '◉', label: 'Live Score & Solutions', desc: 'Rank, percentile, and explanations' },
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#07090F', '#0D1130', '#141E45']} className="flex-1">
      {/* Decorative blobs */}
      <View
        style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: '#4F8FFF', opacity: 0.12 }}
      />
      <View
        style={{ position: 'absolute', bottom: 140, left: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: '#7B5CFF', opacity: 0.1 }}
      />

      <SafeAreaView className="flex-1 justify-between px-6 py-8">
        {/* Logo */}
        <View className="items-center mt-12">
          <LinearGradient
            colors={['#4F8FFF', '#7B5CFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}
          >
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 36, color: '#fff' }}>D</Text>
          </LinearGradient>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 40, letterSpacing: -1.5, color: '#fff', lineHeight: 44 }}>
            Dhrona
          </Text>
          <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: '#8899BB', marginTop: 8, textAlign: 'center', letterSpacing: 0.4 }}>
            AI-powered learning ecosystem{'\n'}for India's next toppers
          </Text>
        </View>

        {/* Feature list */}
        <View style={{ gap: 16 }}>
          {FEATURES.map((f) => (
            <View key={f.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <View
                style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(79,143,255,0.12)', borderWidth: 1, borderColor: 'rgba(79,143,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 18, color: '#4F8FFF' }}>{f.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#EEF2FF' }}>{f.label}</Text>
                <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View style={{ gap: 12 }}>
          <Button label="Get Started" onPress={() => router.push('/phone')} fullWidth size="lg" />
          <Pressable onPress={() => router.push('/phone')} style={{ alignItems: 'center', paddingVertical: 10 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB' }}>
              Already have an account?{' '}
              <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', color: '#4F8FFF' }}>Sign In</Text>
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

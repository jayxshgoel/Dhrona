import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/store/authStore';

const ROLE_ACCENT: Record<string, string> = {
  teacher: '#4F8FFF',
  student: '#7B5CFF',
  parent: '#22D3A3',
};

const ROLE_LABEL: Record<string, string> = {
  teacher: 'Teacher',
  student: 'Student',
  parent: 'Parent',
};

const TIER_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  free:        { label: 'Free Plan',    bg: '#F1F5F9', color: '#4A5B8C' },
  premium:     { label: 'Premium',      bg: '#FFF7ED', color: '#C2410C' },
  institution: { label: 'Institution',  bg: '#EEF4FF', color: '#4F8FFF' },
};

function MenuRow({
  icon,
  label,
  onPress,
  accent,
  danger,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  accent: string;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16 }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          backgroundColor: danger ? '#FEF2F2' : accent + '18',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={18} color={danger ? '#F87171' : accent} />
      </View>
      <Text
        style={{
          flex: 1,
          fontFamily: 'PlusJakartaSans_500Medium',
          fontSize: 14,
          color: danger ? '#F87171' : '#0D1130',
        }}
      >
        {label}
      </Text>
      {!danger && <Ionicons name="chevron-forward" size={16} color="#C7D2E8" />}
    </TouchableOpacity>
  );
}

function SectionDivider({ title }: { title: string }) {
  return (
    <Text
      style={{
        fontFamily: 'PlusJakartaSans_600SemiBold',
        fontSize: 11,
        color: '#8899BB',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        paddingHorizontal: 4,
        marginTop: 24,
        marginBottom: 6,
      }}
    >
      {title}
    </Text>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const accent = ROLE_ACCENT[user?.role ?? 'student'];
  const roleLabel = ROLE_LABEL[user?.role ?? 'student'];
  const tierConfig = TIER_CONFIG[user?.tier ?? 'free'];
  const initial = (user?.name ?? '?')[0].toUpperCase();
  const formattedPhone = user?.phone
    ? user.phone.replace(/^\+91/, '+91 ').replace(/(\d{5})(\d{5})$/, '$1 $2')
    : '—';

  function handleLogout() {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  }

  function handleComingSoon() {
    Alert.alert('Coming soon', 'This feature will be available in a future update.');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      {/* Header */}
      <LinearGradient
        colors={['#07090F', '#141E45']}
        style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}
          >
            <Ionicons name="arrow-back" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: '#fff', letterSpacing: -0.3 }}>
            Account
          </Text>
        </View>

        {/* Avatar + identity */}
        <View style={{ alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 24,
              backgroundColor: accent,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 3,
              borderColor: 'rgba(255,255,255,0.15)',
            }}
          >
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 30, color: '#fff' }}>
              {initial}
            </Text>
          </View>

          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: '#fff', letterSpacing: -0.3 }}>
            {user?.name ?? 'User'}
          </Text>
          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB' }}>
            {formattedPhone}
          </Text>

          {/* Role + Tier badges */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
            <View style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: accent + '22', borderWidth: 1, borderColor: accent + '44' }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: accent }}>
                {roleLabel}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' }}>
              <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#fff' }}>
                {tierConfig.label}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 48, paddingTop: 8 }}
      >
        <SectionDivider title="Account" />
        <Card padding="none" style={{ overflow: 'hidden' }}>
          <MenuRow icon="person-outline" label="Edit Profile" onPress={handleComingSoon} accent={accent} />
          <View style={{ height: 1, backgroundColor: '#F0F4FF', marginLeft: 66 }} />
          <MenuRow icon="lock-closed-outline" label="Privacy" onPress={handleComingSoon} accent={accent} />
        </Card>

        {user?.tier === 'free' && user.role !== 'teacher' && (
          <>
            <SectionDivider title="Plan" />
            <TouchableOpacity
              onPress={() =>
                user.role === 'parent'
                  ? router.push('/(parent)/subscription')
                  : handleComingSoon()
              }
              activeOpacity={0.85}
              style={{ borderRadius: 16, overflow: 'hidden' }}
            >
              <LinearGradient
                colors={['#7B5CFF', '#4F8FFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="diamond" size={18} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, color: '#fff' }}>
                    Upgrade to Premium
                  </Text>
                  <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                    Unlimited practice · Full analytics
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        <SectionDivider title="Support" />
        <Card padding="none" style={{ overflow: 'hidden' }}>
          <MenuRow icon="help-circle-outline" label="Help & Support" onPress={handleComingSoon} accent={accent} />
          <View style={{ height: 1, backgroundColor: '#F0F4FF', marginLeft: 66 }} />
          <MenuRow icon="information-circle-outline" label="About Dhrona" onPress={handleComingSoon} accent={accent} />
        </Card>

        <SectionDivider title="Session" />
        <Card padding="none" style={{ overflow: 'hidden' }}>
          <MenuRow icon="log-out-outline" label="Log Out" onPress={handleLogout} accent={accent} danger />
        </Card>

        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#C7D2E8', textAlign: 'center', marginTop: 32 }}>
          Dhrona v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

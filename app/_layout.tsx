import '../global.css';
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import {
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
  useFonts as useSG,
} from '@expo-google-fonts/space-grotesk';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts as usePJS,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useAuthStore } from '@/store/authStore';

function AuthGate() {
  const { isAuthenticated, user, isLoading, loadSession } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inRoleArea =
      segments[0] === '(teacher)' ||
      segments[0] === '(student)' ||
      segments[0] === '(parent)';

    if (isAuthenticated && user && !inRoleArea) {
      router.replace(`/(${user.role})` as any);
    } else if (!isAuthenticated && inRoleArea) {
      router.replace('/');
    }
  }, [isAuthenticated, user, segments, isLoading]);

  return null;
}

export default function RootLayout() {
  const [sgLoaded] = useSG({ SpaceGrotesk_600SemiBold, SpaceGrotesk_700Bold });
  const [pjsLoaded] = usePJS({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!sgLoaded || !pjsLoaded) {
    return <View className="flex-1 bg-surface-light" />;
  }

  return (
    <>
      <StatusBar style="light" />
      <AuthGate />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="phone" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="role" />
        <Stack.Screen name="(teacher)" />
        <Stack.Screen name="(student)" />
        <Stack.Screen name="(parent)" />
      </Stack>
    </>
  );
}

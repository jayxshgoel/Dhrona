import '../global.css';
import { useEffect, useRef, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import * as Notifications from 'expo-notifications';
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
import { setupNotificationHandler, requestAndRegisterPushToken } from '@/lib/notifications';
import { NotificationBanner, BannerNotification } from '@/components/ui/NotificationBanner';

// Set up foreground notification behaviour once at module load time
setupNotificationHandler();

function AuthGate() {
  const { isAuthenticated, user, isLoading, loadSession } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const tokenRegistered = useRef(false);

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

  // Request push notification permission once per session when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user && !tokenRegistered.current) {
      tokenRegistered.current = true;
      requestAndRegisterPushToken(user.id);
    }
  }, [isAuthenticated, user?.id]);

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

  const [banner, setBanner] = useState<BannerNotification | null>(null);

  // Foreground notification listener — shows in-app banner instead of system alert
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      if (title) {
        setBanner({
          id: notification.request.identifier,
          title,
          body: body ?? '',
        });
      }
    });
    return () => subscription.remove();
  }, []);

  if (!sgLoaded || !pjsLoaded) {
    return <View className="flex-1 bg-surface-light" />;
  }

  return (
    <View style={{ flex: 1 }}>
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
        <Stack.Screen name="settings" />
        <Stack.Screen name="payment-success" />
        <Stack.Screen name="payment-failure" />
      </Stack>
      <NotificationBanner
        notification={banner}
        onDismiss={() => setBanner(null)}
      />
    </View>
  );
}

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';

// Controls how notifications behave when the app is in the foreground.
// Must be called once before any notification is received.
export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: false,  // we handle foreground display ourselves via NotificationBanner
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

// Requests permission and returns the Expo push token, or null if denied.
export async function requestAndRegisterPushToken(userId: string): Promise<string | null> {
  // Physical device required — simulators can't receive push notifications
  const existingPerms = await Notifications.getPermissionsAsync() as any;
  let granted: boolean = existingPerms.granted ?? existingPerms.status === 'granted';

  if (!granted && existingPerms.canAskAgain !== false) {
    const newPerms = await Notifications.requestPermissionsAsync() as any;
    granted = newPerms.granted ?? newPerms.status === 'granted';
  }

  if (!granted) return null;

  // Android requires a notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Dhrona Notifications',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4F8FFF',
    });
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: 'dhrona',  // TODO: replace with your EAS project ID from app.json / eas.json
  });

  const token = tokenData.data;
  await savePushToken(userId, token);
  return token;
}

// Saves the push token to Supabase profiles.
// NOTE: requires a `push_token` text column on the profiles table.
// Backend migration: ALTER TABLE profiles ADD COLUMN push_token text;
async function savePushToken(userId: string, token: string) {
  await (supabase.from('profiles') as any)
    .update({ push_token: token })
    .eq('id', userId);
}

import { useEffect, useRef } from 'react';
import { Animated, View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface BannerNotification {
  id: string;
  title: string;
  body: string;
}

interface NotificationBannerProps {
  notification: BannerNotification | null;
  onDismiss: () => void;
}

const AUTO_DISMISS_MS = 4000;

export function NotificationBanner({ notification, onDismiss }: NotificationBannerProps) {
  const translateY = useRef(new Animated.Value(-120)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!notification) return;

    // Slide in
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();

    // Auto-dismiss
    timerRef.current = setTimeout(() => dismiss(), AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [notification?.id]);

  function dismiss() {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(translateY, {
      toValue: -120,
      duration: 280,
      useNativeDriver: true,
    }).start(() => onDismiss());
  }

  if (!notification) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: Platform.OS === 'ios' ? 54 : 16,
        left: 16,
        right: 16,
        zIndex: 999,
        transform: [{ translateY }],
      }}
    >
      <View
        style={{
          backgroundColor: '#07090F',
          borderRadius: 18,
          paddingVertical: 14,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
          borderWidth: 1,
          borderColor: 'rgba(79,143,255,0.2)',
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            backgroundColor: 'rgba(79,143,255,0.15)',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Ionicons name="notifications" size={18} color="#4F8FFF" />
        </View>

        {/* Text */}
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#fff' }}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text
            style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}
            numberOfLines={2}
          >
            {notification.body}
          </Text>
        </View>

        {/* Dismiss */}
        <TouchableOpacity onPress={dismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="close" size={16} color="#4A5B8C" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

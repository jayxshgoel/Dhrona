import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ message, size = 'large', color = '#7B5CFF', fullScreen = false }: LoadingSpinnerProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', gap: 12, flex: fullScreen ? 1 : 0, paddingVertical: fullScreen ? 0 : 48, backgroundColor: fullScreen ? '#F5F7FF' : 'transparent' }}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', textAlign: 'center' }}>{message}</Text>
      )}
    </View>
  );
}

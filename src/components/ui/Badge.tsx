import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  label: string;
  color?: string;
  size?: 'sm' | 'md';
  gradient?: boolean;
}

export function Badge({ label, color = '#4F8FFF', size = 'sm' }: BadgeProps) {
  const textSize = size === 'sm' ? 11 : 12;
  const padH = size === 'sm' ? 10 : 12;
  const padV = size === 'sm' ? 3 : 4;

  return (
    <View
      style={{
        backgroundColor: color + '18',
        borderRadius: 999,
        paddingHorizontal: padH,
        paddingVertical: padV,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color, fontSize: textSize, fontFamily: 'PlusJakartaSans_700Bold' }}>
        {label}
      </Text>
    </View>
  );
}

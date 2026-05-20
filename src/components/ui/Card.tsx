import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  glass?: boolean;
}

const paddingMap = { none: 0, sm: 12, md: 16, lg: 24 };

export function Card({ children, padding = 'md', glass = false, style, ...props }: CardProps) {
  const p = paddingMap[padding];

  return (
    <View
      style={[
        {
          backgroundColor: glass ? 'rgba(255,255,255,0.65)' : '#FFFFFF',
          borderRadius: 20,
          padding: p,
          borderWidth: glass ? 1 : 0.5,
          borderColor: glass ? 'rgba(255,255,255,0.85)' : '#E8EDF8',
          elevation: 2,
          shadowColor: '#4F8FFF',
          shadowOpacity: 0.06,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

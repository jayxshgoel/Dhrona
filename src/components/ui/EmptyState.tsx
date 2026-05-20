import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = 'document-outline', title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 24 }}>
      <View style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Ionicons name={icon} size={32} color="#8899BB" />
      </View>
      <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 17, color: '#0D1130', textAlign: 'center', marginBottom: 8 }}>{title}</Text>
      {description && (
        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', textAlign: 'center', marginBottom: 24 }}>{description}</Text>
      )}
      {actionLabel && onAction && <Button label={actionLabel} onPress={onAction} />}
    </View>
  );
}

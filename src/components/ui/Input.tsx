import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export function Input({ label, error, rightIcon, onRightIconPress, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontSize: 13, fontFamily: 'PlusJakartaSans_600SemiBold', color: '#4A5B8C', marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          borderWidth: focused ? 1.5 : 1,
          borderColor: error ? '#F87171' : focused ? '#4F8FFF' : '#E8EDF8',
          paddingHorizontal: 16,
          elevation: focused ? 3 : 0,
          shadowColor: '#4F8FFF',
          shadowOpacity: focused ? 0.12 : 0,
          shadowRadius: 8,
        }}
      >
        <TextInput
          style={[{ flex: 1, paddingVertical: 13, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#0D1130' }, style]}
          placeholderTextColor="#8899BB"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress}>{rightIcon}</TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={{ color: '#F87171', fontSize: 11, fontFamily: 'PlusJakartaSans_500Medium', marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
}

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'mint';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const sizeStyles: Record<Size, { container: string; text: string; paddingH: number; paddingV: number }> = {
  sm: { container: 'rounded-btn', text: 'text-sm', paddingH: 16, paddingV: 8 },
  md: { container: 'rounded-btn', text: 'text-sm', paddingH: 20, paddingV: 12 },
  lg: { container: 'rounded-btn', text: 'text-base', paddingH: 24, paddingV: 14 },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const s = sizeStyles[size];
  const isDisabled = disabled || loading;

  const content = loading ? (
    <ActivityIndicator size="small" color={variant === 'outline' || variant === 'ghost' ? '#4F8FFF' : '#fff'} />
  ) : (
    <View className="flex-row items-center gap-2">
      {icon}
      <Text
        style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: size === 'sm' ? 13 : size === 'lg' ? 15 : 14, color: variant === 'outline' ? '#4F8FFF' : variant === 'ghost' ? '#4A5B8C' : '#fff' }}
      >
        {label}
      </Text>
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[{ opacity: isDisabled ? 0.5 : 1, alignSelf: fullWidth ? 'stretch' : 'flex-start' }, style as any]}
        {...props}
      >
        <LinearGradient
          colors={['#4F8FFF', '#7B5CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingHorizontal: s.paddingH,
            paddingVertical: s.paddingV,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'mint') {
    return (
      <TouchableOpacity
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[{
          backgroundColor: '#22D3A3',
          paddingHorizontal: s.paddingH,
          paddingVertical: s.paddingV,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDisabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        }, style as any]}
        {...props}
      >
        {content}
      </TouchableOpacity>
    );
  }

  const bgStyles: Record<Exclude<Variant, 'primary' | 'mint'>, object> = {
    secondary: { backgroundColor: '#0D1130' },
    outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: '#4F8FFF' },
    ghost: { backgroundColor: 'transparent' },
    danger: { backgroundColor: '#F87171' },
  };

  return (
    <TouchableOpacity
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[{
        paddingHorizontal: s.paddingH,
        paddingVertical: s.paddingV,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isDisabled ? 0.5 : 1,
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        ...(bgStyles[variant as Exclude<Variant, 'primary' | 'mint'>] ?? {}),
      }, style as any]}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
}

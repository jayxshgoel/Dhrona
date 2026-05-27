import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UsageCounterProps {
  used: number;
  limit: number;
  period: 'today' | 'this week';
  onUpgrade: () => void;
}

export function UsageCounter({ used, limit, period, onUpgrade }: UsageCounterProps) {
  const remaining = Math.max(0, limit - used);
  const isExhausted = remaining === 0;
  const isLow = remaining <= 1 && !isExhausted;

  const color = isExhausted ? '#F87171' : isLow ? '#FBBF24' : '#22D3A3';
  const bg = isExhausted ? 'rgba(248,113,113,0.12)' : isLow ? 'rgba(251,191,36,0.12)' : 'rgba(34,211,163,0.12)';
  const borderColor = isExhausted ? 'rgba(248,113,113,0.3)' : isLow ? 'rgba(251,191,36,0.3)' : 'rgba(34,211,163,0.3)';

  return (
    <TouchableOpacity
      onPress={isExhausted ? onUpgrade : undefined}
      activeOpacity={isExhausted ? 0.75 : 1}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        alignSelf: 'flex-start',
        backgroundColor: bg,
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor,
        marginTop: 10,
      }}
    >
      <Ionicons
        name={isExhausted ? 'lock-closed' : 'flash'}
        size={12}
        color={color}
      />
      <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color }}>
        {isExhausted
          ? `Limit reached — Upgrade for unlimited`
          : `${remaining} / ${limit} remaining ${period}`}
      </Text>
    </TouchableOpacity>
  );
}

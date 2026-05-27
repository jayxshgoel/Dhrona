import { Modal, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature: string;
  limitMessage: string;
}

const BENEFITS = [
  { icon: 'infinite' as const,       text: 'Unlimited AI question generation' },
  { icon: 'sparkles' as const,       text: 'Unlimited self-practice tests' },
  { icon: 'bar-chart' as const,      text: 'Full performance dashboard & insights' },
];

export function PaywallModal({ visible, onClose, onUpgrade, feature, limitMessage }: PaywallModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(7,9,15,0.6)', justifyContent: 'flex-end' }}
      >
        {/* Bottom sheet — stop backdrop tap propagating into sheet */}
        <Pressable onPress={() => {}} style={{ backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40 }}>
          {/* Drag handle */}
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E8EDF8', alignSelf: 'center', marginBottom: 24 }} />

          {/* Lock icon */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <LinearGradient
              colors={['#7B5CFF', '#4F8FFF']}
              style={{ width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="diamond" size={28} color="#fff" />
            </LinearGradient>
          </View>

          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: '#0D1130', textAlign: 'center', letterSpacing: -0.3 }}>
            Upgrade to Premium
          </Text>
          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: '#4A5B8C', textAlign: 'center', marginTop: 8, lineHeight: 21 }}>
            {limitMessage}
          </Text>

          {/* Benefits */}
          <View style={{ marginTop: 24, gap: 14 }}>
            {BENEFITS.map((b) => (
              <View key={b.text} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={b.icon} size={17} color="#4F8FFF" />
                </View>
                <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#0D1130', flex: 1 }}>
                  {b.text}
                </Text>
                <Ionicons name="checkmark-circle" size={18} color="#22D3A3" />
              </View>
            ))}
          </View>

          {/* Price note */}
          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', textAlign: 'center', marginTop: 20 }}>
            Starting at ₹299 / month · Cancel anytime
          </Text>

          {/* CTA */}
          <TouchableOpacity
            onPress={onUpgrade}
            activeOpacity={0.85}
            style={{ marginTop: 20, borderRadius: 16, overflow: 'hidden' }}
          >
            <LinearGradient
              colors={['#7B5CFF', '#4F8FFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingVertical: 16, alignItems: 'center' }}
            >
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 15, color: '#fff', letterSpacing: -0.2 }}>
                Upgrade Now
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={{ marginTop: 14, paddingVertical: 8, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 14, color: '#8899BB' }}>
              Maybe later
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

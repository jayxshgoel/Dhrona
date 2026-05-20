import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectProps {
  label?: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function Select({ label, value, options, onSelect, placeholder = 'Select...' }: SelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#4A5B8C', marginBottom: 6 }}>{label}</Text>
      )}
      <TouchableOpacity
        onPress={() => setOpen(true)}
        activeOpacity={0.7}
        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E8EDF8', paddingHorizontal: 16, paddingVertical: 13 }}
      >
        <Text style={{ flex: 1, fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: value ? '#0D1130' : '#8899BB' }}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#8899BB" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={() => setOpen(false)} />
        <SafeAreaView style={{ backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '65%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F4FF' }}>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: '#0D1130' }}>{label ?? 'Select'}</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons name="close" size={22} color="#8899BB" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={options}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => { onSelect(item); setOpen(false); }}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F5F7FF', backgroundColor: value === item ? '#EEF4FF' : 'transparent' }}
                activeOpacity={0.7}
              >
                <Text style={{ flex: 1, fontFamily: value === item ? 'PlusJakartaSans_600SemiBold' : 'PlusJakartaSans_400Regular', fontSize: 14, color: value === item ? '#4F8FFF' : '#0D1130' }}>
                  {item}
                </Text>
                {value === item && <Ionicons name="checkmark" size={18} color="#4F8FFF" />}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

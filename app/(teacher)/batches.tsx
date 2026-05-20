import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useAuthStore } from '@/store/authStore';
import { getBatchesByTeacher, createBatch, MOCK_STUDENT_NAMES } from '@/services/batchService';
import { EXAM_TYPES } from '@/constants/taxonomy';
import { ExamType } from '@/types';

export default function BatchesScreen() {
  const { user } = useAuthStore();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newExam, setNewExam] = useState<ExamType | ''>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const batches = getBatchesByTeacher(user?.id ?? 'teacher-1');

  function handleCreate() {
    if (!newName.trim() || !newExam) return;
    createBatch({
      name: newName.trim(),
      teacherId: user?.id ?? 'teacher-1',
      studentIds: [],
      examType: newExam as ExamType,
      description: `${newExam} batch`,
    });
    setNewName('');
    setNewExam('');
    setShowCreate(false);
    setRefreshKey((k) => k + 1);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      {/* Header */}
      <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, color: '#fff', letterSpacing: -0.5 }}>Batches</Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 4 }}>
              {batches.length} batches · {batches.reduce((acc, b) => acc + b.studentIds.length, 0)} students
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowCreate(true)}
            style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#4F8FFF', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="add" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingTop: 20, paddingBottom: 32 }}>
        {batches.length === 0 ? (
          <Card style={{ alignItems: 'center', paddingVertical: 40 }}>
            <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <Ionicons name="people" size={28} color="#4F8FFF" />
            </View>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#0D1130', marginBottom: 6 }}>No batches yet</Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', textAlign: 'center', marginBottom: 20 }}>
              Create a batch to start assigning tests to groups of students
            </Text>
            <Button label="Create Batch" onPress={() => setShowCreate(true)} />
          </Card>
        ) : (
          <View style={{ gap: 12 }}>
            {batches.map((batch) => {
              const isExpanded = expandedId === batch.id;
              return (
                <Card key={batch.id}>
                  <TouchableOpacity onPress={() => setExpandedId(isExpanded ? null : batch.id)} activeOpacity={0.8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                      <LinearGradient
                        colors={['#4F8FFF', '#7B5CFF']}
                        style={{ width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Ionicons name="people" size={22} color="#fff" />
                      </LinearGradient>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#0D1130' }}>{batch.name}</Text>
                        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}>
                          {batch.studentIds.length} students · {batch.examType}
                        </Text>
                      </View>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color="#C7D2E8" />
                    </View>
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: '#F0F4FF', paddingTop: 16 }}>
                      <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12, color: '#8899BB', letterSpacing: 0.5, marginBottom: 10 }}>
                        STUDENTS
                      </Text>
                      {batch.studentIds.length === 0 ? (
                        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB' }}>No students yet</Text>
                      ) : (
                        <View style={{ gap: 8 }}>
                          {batch.studentIds.map((sid) => (
                            <View key={sid} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                              <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: '#EEF4FF', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 13, color: '#4F8FFF' }}>
                                  {(MOCK_STUDENT_NAMES[sid] ?? 'S')[0]}
                                </Text>
                              </View>
                              <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: '#0D1130' }}>
                                {MOCK_STUDENT_NAMES[sid] ?? `Student ${sid}`}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Create Batch Modal */}
      <Modal visible={showCreate} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }} onPress={() => setShowCreate(false)} />
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 }}>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: '#0D1130', marginBottom: 20 }}>Create Batch</Text>
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#4A5B8C', marginBottom: 6 }}>Batch Name</Text>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="e.g. JEE Mains 2027 — Batch A"
              placeholderTextColor="#8899BB"
              style={{ backgroundColor: '#F5F7FF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 13, fontSize: 14, fontFamily: 'PlusJakartaSans_400Regular', color: '#0D1130', borderWidth: 1, borderColor: '#E8EDF8' }}
            />
          </View>
          <Select label="Exam Type" value={newExam} options={EXAM_TYPES} onSelect={(v) => setNewExam(v as ExamType)} placeholder="Select exam type..." />
          <Button label="Create Batch" onPress={handleCreate} fullWidth size="lg" disabled={!newName.trim() || !newExam} />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

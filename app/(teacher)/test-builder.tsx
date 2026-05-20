import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { getQuestionBank } from '@/services/questionService';
import { getBatchesByTeacher } from '@/services/batchService';
import { createTest } from '@/services/testService';
import { useAuthStore } from '@/store/authStore';
import { EXAM_TYPES } from '@/constants/taxonomy';
import { DIFFICULTY_COLORS, EXAM_COLORS } from '@/constants/theme';
import { ExamType, Question } from '@/types';

const STEPS = ['Details', 'Questions', 'Configure', 'Assign'];

export default function TestBuilderScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [step, setStep] = useState(0);

  // Step 1: Details
  const [title, setTitle] = useState('');
  const [examType, setExamType] = useState<ExamType | ''>('');

  // Step 2: Questions
  const [selectedQIds, setSelectedQIds] = useState<string[]>([]);

  // Step 3: Config
  const [timeLimit, setTimeLimit] = useState('60');
  const [marksPerQ, setMarksPerQ] = useState('4');
  const [negativeMarking, setNegativeMarking] = useState(false);

  // Step 4: Assign
  const [selectedBatchIds, setSelectedBatchIds] = useState<string[]>([]);

  const allQuestions = getQuestionBank();
  const batches = getBatchesByTeacher(user?.id ?? 'teacher-1');
  const selectedQuestions = allQuestions.filter((q) => selectedQIds.includes(q.id));

  function toggleQuestion(id: string) {
    setSelectedQIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }

  function toggleBatch(id: string) {
    setSelectedBatchIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  }

  function canProceed() {
    if (step === 0) return title.trim().length > 0 && !!examType;
    if (step === 1) return selectedQIds.length > 0;
    if (step === 2) return parseInt(timeLimit) >= 10;
    return selectedBatchIds.length > 0;
  }

  function handleNext() {
    if (!canProceed()) return;
    if (step < 3) { setStep(step + 1); return; }
    handlePublish();
  }

  function handlePublish() {
    const marks = parseInt(marksPerQ) * selectedQIds.length;
    createTest({
      title,
      examType: examType as ExamType,
      createdBy: user?.id ?? 'teacher-1',
      batchIds: selectedBatchIds,
      questionIds: selectedQIds,
      config: {
        timeLimit: parseInt(timeLimit),
        marksPerQuestion: parseInt(marksPerQ),
        negativeMarking,
        negativeMarksFraction: negativeMarking ? 0.25 : 0,
        totalMarks: marks,
      },
      scheduledAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 7 * 86400000).toISOString(),
      status: 'published',
    });
    Alert.alert('Test Published!', `"${title}" has been assigned to ${selectedBatchIds.length} batch(es).`, [
      { text: 'Done', onPress: () => router.replace('/(teacher)/tests') },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      {/* Header */}
      <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : router.back()} style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: '#fff', letterSpacing: -0.5 }}>Create Test</Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}>
              Step {step + 1} of 4 — {STEPS[step]}
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 20 }}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={{ flex: 1, height: 3, borderRadius: 99, backgroundColor: i <= step ? '#4F8FFF' : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }} contentContainerStyle={{ paddingTop: 24, paddingBottom: 100 }}>
        {/* Step 1: Details */}
        {step === 0 && (
          <View style={{ gap: 0 }}>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#0D1130', marginBottom: 16 }}>Test Details</Text>
            <Input label="Test Title" value={title} onChangeText={setTitle} placeholder="e.g. JEE Mains — Physics Mock Test 1" />
            <Select label="Exam Type" value={examType} options={EXAM_TYPES} onSelect={(v) => setExamType(v as ExamType)} placeholder="Select exam type..." />
          </View>
        )}

        {/* Step 2: Select Questions */}
        {step === 1 && (
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#0D1130' }}>Select Questions</Text>
              <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 13, color: '#8899BB' }}>{selectedQIds.length} selected</Text>
            </View>
            {allQuestions.length === 0 ? (
              <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB' }}>No questions in bank yet</Text>
                <TouchableOpacity onPress={() => router.push('/(teacher)/generate')} style={{ marginTop: 12 }}>
                  <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#4F8FFF' }}>Generate questions →</Text>
                </TouchableOpacity>
              </Card>
            ) : (
              <View style={{ gap: 10 }}>
                {allQuestions.map((q) => {
                  const isSelected = selectedQIds.includes(q.id);
                  return (
                    <TouchableOpacity key={q.id} onPress={() => toggleQuestion(q.id)} activeOpacity={0.85}>
                      <Card style={{ borderWidth: isSelected ? 2 : 0.5, borderColor: isSelected ? '#4F8FFF' : '#E8EDF8' }}>
                        <View style={{ flexDirection: 'row', gap: 12 }}>
                          <View style={{ width: 24, height: 24, borderRadius: 8, borderWidth: isSelected ? 0 : 2, borderColor: '#C7D2E8', backgroundColor: isSelected ? '#4F8FFF' : 'transparent', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                            {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
                          </View>
                          <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
                              <Badge label={q.subject} color="#4F8FFF" size="sm" />
                              <Badge label={q.difficulty} color={DIFFICULTY_COLORS[q.difficulty]} size="sm" />
                            </View>
                            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#0D1130', lineHeight: 20 }} numberOfLines={2}>
                              {q.content}
                            </Text>
                            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#8899BB', marginTop: 4 }}>{q.chapter}</Text>
                          </View>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Step 3: Configure */}
        {step === 2 && (
          <View>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#0D1130', marginBottom: 20 }}>Test Configuration</Text>
            <Input label="Time Limit (minutes)" value={timeLimit} onChangeText={setTimeLimit} keyboardType="number-pad" placeholder="60" />
            <Input label="Marks per Question" value={marksPerQ} onChangeText={setMarksPerQ} keyboardType="number-pad" placeholder="4" />

            <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#4A5B8C', marginBottom: 8 }}>Negative Marking</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
              {[true, false].map((val) => (
                <TouchableOpacity
                  key={String(val)}
                  onPress={() => setNegativeMarking(val)}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: negativeMarking === val ? 2 : 1,
                    borderColor: negativeMarking === val ? '#4F8FFF' : '#E8EDF8',
                    backgroundColor: negativeMarking === val ? '#EEF4FF' : '#fff',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: negativeMarking === val ? '#4F8FFF' : '#8899BB' }}>
                    {val ? 'Yes (-1/4)' : 'No'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Summary */}
            <Card style={{ backgroundColor: '#EEF4FF' }}>
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, color: '#4F8FFF', marginBottom: 12 }}>Summary</Text>
              {[
                ['Questions', `${selectedQIds.length}`],
                ['Total Marks', `${parseInt(marksPerQ) * selectedQIds.length}`],
                ['Duration', `${timeLimit} minutes`],
                ['Negative Marking', negativeMarking ? '-1/4 per wrong' : 'None'],
              ].map(([label, value]) => (
                <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#4A5B8C' }}>{label}</Text>
                  <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13, color: '#0D1130' }}>{value}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Step 4: Assign */}
        {step === 3 && (
          <View>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 16, color: '#0D1130', marginBottom: 8 }}>Assign to Batches</Text>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginBottom: 20 }}>
              Select which batches will see this test
            </Text>
            <View style={{ gap: 10 }}>
              {batches.map((batch) => {
                const isSelected = selectedBatchIds.includes(batch.id);
                return (
                  <TouchableOpacity key={batch.id} onPress={() => toggleBatch(batch.id)} activeOpacity={0.85}>
                    <Card style={{ borderWidth: isSelected ? 2 : 0.5, borderColor: isSelected ? '#4F8FFF' : '#E8EDF8' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                        <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: isSelected ? '#EEF4FF' : '#F5F7FF', alignItems: 'center', justifyContent: 'center' }}>
                          <Ionicons name="people" size={20} color={isSelected ? '#4F8FFF' : '#8899BB'} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 14, color: '#0D1130' }}>{batch.name}</Text>
                          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 12, color: '#8899BB', marginTop: 2 }}>
                            {batch.studentIds.length} students · {batch.examType}
                          </Text>
                        </View>
                        {isSelected && <Ionicons name="checkmark-circle" size={22} color="#4F8FFF" />}
                      </View>
                    </Card>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer button */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E8EDF8', paddingHorizontal: 20, paddingVertical: 16, paddingBottom: 28 }}>
        <Button
          label={step === 3 ? 'Publish Test' : 'Continue'}
          onPress={handleNext}
          fullWidth
          size="lg"
          disabled={!canProceed()}
        />
      </View>
    </SafeAreaView>
  );
}

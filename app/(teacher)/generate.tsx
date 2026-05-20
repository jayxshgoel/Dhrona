import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  EXAM_TYPES,
  SUBJECTS_BY_EXAM,
  CHAPTERS,
  DIFFICULTIES,
  QUESTION_TYPES,
  QUESTION_COUNTS,
} from '@/constants/taxonomy';
import { DIFFICULTY_COLORS, SUBJECT_COLORS } from '@/constants/theme';
import { generateQuestions, saveQuestionsToBank } from '@/services/questionService';
import { Question, ExamType, Subject, Difficulty, QuestionType } from '@/types';

export default function GenerateScreen() {
  const [examType, setExamType] = useState<ExamType | ''>('');
  const [subject, setSubject] = useState<Subject | ''>('');
  const [chapter, setChapter] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');
  const [qType, setQType] = useState<QuestionType | ''>('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<Question[]>([]);
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const availableSubjects = examType ? SUBJECTS_BY_EXAM[examType as ExamType] : [];
  const availableChapters = subject ? CHAPTERS[subject as Subject] : [];

  const canGenerate = examType && subject && chapter && difficulty && qType;

  async function handleGenerate() {
    if (!canGenerate) return;
    setLoading(true);
    setGenerated([]);
    setSaved(false);
    setAccepted(new Set());
    try {
      const qs = await generateQuestions({
        subject: subject as Subject,
        chapter,
        examType: examType as ExamType,
        difficulty: difficulty as Difficulty,
        type: qType as QuestionType,
        count,
      });
      setGenerated(qs);
      setAccepted(new Set(qs.map((q) => q.id)));
    } catch {
      Alert.alert('Error', 'Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function toggleAccept(id: string) {
    setAccepted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSaveToBank() {
    const toSave = generated.filter((q) => accepted.has(q.id));
    saveQuestionsToBank(toSave);
    setSaved(true);
    Alert.alert('Saved!', `${toSave.length} questions added to your Question Bank.`);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24 }}>
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, color: '#fff', letterSpacing: -0.5 }}>AI Question Generator</Text>
          <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 6 }}>
            Generate exam-quality questions instantly
          </Text>
        </LinearGradient>

        <View className="px-5 pt-5 gap-0">
          {/* Form */}
          <Card padding="md" className="mb-5">
            <Text className="text-gray-900 font-bold text-base mb-4">Configure Generation</Text>

            <Select
              label="Exam Type"
              value={examType}
              options={EXAM_TYPES}
              onSelect={(v) => { setExamType(v as ExamType); setSubject(''); setChapter(''); }}
              placeholder="Select exam type..."
            />
            <Select
              label="Subject"
              value={subject}
              options={availableSubjects}
              onSelect={(v) => { setSubject(v as Subject); setChapter(''); }}
              placeholder={examType ? 'Select subject...' : 'Select exam type first'}
            />
            <Select
              label="Chapter"
              value={chapter}
              options={availableChapters}
              onSelect={setChapter}
              placeholder={subject ? 'Select chapter...' : 'Select subject first'}
            />
            <Select
              label="Difficulty"
              value={difficulty}
              options={DIFFICULTIES as unknown as string[]}
              onSelect={(v) => setDifficulty(v as Difficulty)}
              placeholder="Select difficulty..."
            />
            <Select
              label="Question Type"
              value={qType}
              options={QUESTION_TYPES as unknown as string[]}
              onSelect={(v) => setQType(v as QuestionType)}
              placeholder="Select question type..."
            />

            {/* Count picker */}
            <View className="mb-2">
              <Text className="text-sm font-medium text-gray-700 mb-2">Number of Questions</Text>
              <View className="flex-row flex-wrap gap-2">
                {QUESTION_COUNTS.map((n) => (
                  <TouchableOpacity
                    key={n}
                    onPress={() => setCount(n)}
                    className={`w-12 h-10 rounded-xl items-center justify-center border ${
                      count === n
                        ? 'bg-teal-600 border-teal-600'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <Text className={`text-sm font-semibold ${count === n ? 'text-white' : 'text-gray-700'}`}>
                      {n}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Card>

          <Button
            label="Generate Questions"
            onPress={handleGenerate}
            fullWidth
            size="lg"
            disabled={!canGenerate}
            icon={<Ionicons name="sparkles" size={18} color="#fff" />}
          />
        </View>

        {/* Loading state */}
        {loading && (
          <View className="mt-8">
            <LoadingSpinner message="Generating questions with AI..." />
          </View>
        )}

        {/* Results */}
        {!loading && generated.length > 0 && (
          <View className="px-5 mt-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-gray-900 font-bold text-base">
                {generated.length} Questions Generated
              </Text>
              <Text className="text-gray-400 text-sm">{accepted.size} selected</Text>
            </View>

            <View className="gap-3 mb-5">
              {generated.map((q, i) => {
                const isAccepted = accepted.has(q.id);
                const isExpanded = expandedId === q.id;
                return (
                  <Card key={q.id} padding="md">
                    <View className="flex-row items-start gap-3">
                      {/* Checkbox */}
                      <TouchableOpacity
                        onPress={() => toggleAccept(q.id)}
                        className={`w-6 h-6 rounded-md border-2 items-center justify-center mt-0.5 ${
                          isAccepted ? 'bg-teal-500 border-teal-500' : 'border-gray-300'
                        }`}
                      >
                        {isAccepted && <Ionicons name="checkmark" size={14} color="#fff" />}
                      </TouchableOpacity>

                      <View className="flex-1">
                        <View className="flex-row gap-2 mb-2">
                          <Badge label={q.difficulty} color={DIFFICULTY_COLORS[q.difficulty]} size="sm" />
                          <Badge label={q.type} color="#64748B" size="sm" />
                        </View>
                        <Text className="text-gray-800 text-sm leading-5">
                          {i + 1}. {q.content}
                        </Text>

                        {isExpanded && q.options && (
                          <View className="mt-3 gap-2">
                            {q.options.map((opt, oi) => (
                              <View
                                key={oi}
                                className={`px-3 py-2 rounded-lg ${
                                  opt === q.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                                }`}
                              >
                                <Text
                                  className={`text-sm ${
                                    opt === q.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-700'
                                  }`}
                                >
                                  {String.fromCharCode(65 + oi)}. {opt}
                                  {opt === q.correctAnswer && ' ✓'}
                                </Text>
                              </View>
                            ))}
                            <View className="bg-teal-50 rounded-lg p-3 mt-1">
                              <Text className="text-teal-800 text-xs font-medium mb-1">Explanation</Text>
                              <Text className="text-teal-700 text-sm">{q.explanation}</Text>
                            </View>
                          </View>
                        )}

                        <TouchableOpacity
                          onPress={() => setExpandedId(isExpanded ? null : q.id)}
                          className="flex-row items-center gap-1 mt-2"
                        >
                          <Text className="text-teal-600 text-xs font-medium">
                            {isExpanded ? 'Show less' : 'Show answer & explanation'}
                          </Text>
                          <Ionicons
                            name={isExpanded ? 'chevron-up' : 'chevron-down'}
                            size={12}
                            color="#0D9488"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>

            {!saved && (
              <Button
                label={`Save ${accepted.size} to Question Bank`}
                onPress={handleSaveToBank}
                fullWidth
                size="lg"
                variant="secondary"
                disabled={accepted.size === 0}
              />
            )}
            {saved && (
              <View className="bg-green-50 border border-green-200 rounded-2xl p-4 flex-row items-center gap-3">
                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                <Text className="text-green-700 font-medium">Saved to Question Bank!</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

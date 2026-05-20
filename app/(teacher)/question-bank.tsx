import { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { getQuestionBank, deleteQuestion } from '@/services/questionService';
import { DIFFICULTY_COLORS, SUBJECT_COLORS } from '@/constants/theme';
import { Difficulty, Subject } from '@/types';
import { useRouter } from 'expo-router';

const FILTER_SUBJECTS: (Subject | 'All')[] = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];
const FILTER_DIFFICULTIES: (Difficulty | 'All')[] = ['All', 'Easy', 'Medium', 'Hard', 'Previous Year'];

export default function QuestionBankScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterSubject, setFilterSubject] = useState<Subject | 'All'>('All');
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | 'All'>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const questions = useMemo(() => {
    let qs = getQuestionBank();
    if (filterSubject !== 'All') qs = qs.filter((q) => q.subject === filterSubject);
    if (filterDifficulty !== 'All') qs = qs.filter((q) => q.difficulty === filterDifficulty);
    if (search.trim()) {
      const lower = search.toLowerCase();
      qs = qs.filter(
        (q) =>
          q.content.toLowerCase().includes(lower) ||
          q.chapter.toLowerCase().includes(lower) ||
          q.subject.toLowerCase().includes(lower),
      );
    }
    return qs;
  }, [search, filterSubject, filterDifficulty, refreshKey]);

  function handleDelete(id: string) {
    Alert.alert('Delete Question', 'Are you sure you want to delete this question?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteQuestion(id);
          setRefreshKey((k) => k + 1);
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <LinearGradient colors={['#07090F', '#141E45']} style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 24, color: '#fff', letterSpacing: -0.5 }}>Question Bank</Text>
        <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginTop: 4 }}>{questions.length} questions saved</Text>

        {/* Search */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 14, marginTop: 14 }}>
          <Ionicons name="search" size={18} color="#8899BB" />
          <TextInput
            style={{ flex: 1, paddingVertical: 12, color: '#fff', marginLeft: 8, fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14 }}
            placeholder="Search questions, chapters..."
            placeholderTextColor="#8899BB"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#8899BB" />
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Subject filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="py-3"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {FILTER_SUBJECTS.map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setFilterSubject(s)}
            className={`px-4 py-1.5 rounded-full border ${
              filterSubject === s
                ? 'bg-teal-600 border-teal-600'
                : 'bg-white border-gray-200'
            }`}
          >
            <Text
              className={`text-sm font-medium ${filterSubject === s ? 'text-white' : 'text-gray-600'}`}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
        <View className="w-px h-full bg-gray-200 mx-1" />
        {FILTER_DIFFICULTIES.map((d) => (
          <TouchableOpacity
            key={d}
            onPress={() => setFilterDifficulty(d)}
            className={`px-4 py-1.5 rounded-full border ${
              filterDifficulty === d
                ? 'border-transparent'
                : 'bg-white border-gray-200'
            }`}
            style={filterDifficulty === d && d !== 'All'
              ? { backgroundColor: DIFFICULTY_COLORS[d] + '20', borderColor: DIFFICULTY_COLORS[d] }
              : filterDifficulty === d
              ? { backgroundColor: '#1B2A4A', borderColor: '#1B2A4A' }
              : {}
            }
          >
            <Text
              className={`text-sm font-medium`}
              style={{ color: filterDifficulty === d && d !== 'All' ? DIFFICULTY_COLORS[d] : filterDifficulty === d ? '#fff' : '#4B5563' }}
            >
              {d}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {questions.length === 0 ? (
        <EmptyState
          icon="library-outline"
          title="No questions found"
          description="Generate questions with AI and save them here"
          actionLabel="Generate Questions"
          onAction={() => router.push('/(teacher)/generate')}
        />
      ) : (
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="gap-3">
            {questions.map((q, i) => {
              const isExpanded = expandedId === q.id;
              return (
                <Card key={q.id} padding="md">
                  <View className="flex-row gap-2 mb-2">
                    <Badge label={q.subject} color={SUBJECT_COLORS[q.subject]} size="sm" />
                    <Badge label={q.difficulty} color={DIFFICULTY_COLORS[q.difficulty]} size="sm" />
                    <Badge label={q.type} color="#64748B" size="sm" />
                  </View>

                  <Text className="text-xs text-gray-400 mb-1">{q.chapter}</Text>
                  <Text className="text-gray-800 text-sm leading-5" numberOfLines={isExpanded ? undefined : 2}>
                    {i + 1}. {q.content}
                  </Text>

                  {isExpanded && (
                    <View className="mt-3">
                      {q.options?.map((opt, oi) => (
                        <View
                          key={oi}
                          className={`flex-row items-start gap-2 px-3 py-2 mb-1 rounded-lg ${
                            opt === q.correctAnswer ? 'bg-green-50' : 'bg-gray-50'
                          }`}
                        >
                          <Text
                            className={`text-sm font-bold ${opt === q.correctAnswer ? 'text-green-600' : 'text-gray-500'}`}
                          >
                            {String.fromCharCode(65 + oi)}.
                          </Text>
                          <Text
                            className={`text-sm flex-1 ${opt === q.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-700'}`}
                          >
                            {opt}
                          </Text>
                          {opt === q.correctAnswer && (
                            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                          )}
                        </View>
                      ))}
                      <View className="bg-blue-50 rounded-lg p-3 mt-2">
                        <Text className="text-blue-800 text-xs font-semibold mb-1">💡 Explanation</Text>
                        <Text className="text-blue-700 text-sm">{q.explanation}</Text>
                      </View>
                    </View>
                  )}

                  <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <TouchableOpacity
                      onPress={() => setExpandedId(isExpanded ? null : q.id)}
                      className="flex-row items-center gap-1"
                    >
                      <Text className="text-teal-600 text-xs font-medium">
                        {isExpanded ? 'Collapse' : 'View Answer'}
                      </Text>
                      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={12} color="#0D9488" />
                    </TouchableOpacity>
                    <View className="flex-row gap-4">
                      <TouchableOpacity onPress={() => handleDelete(q.id)}>
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Card>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

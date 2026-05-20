import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getTestById, submitAttempt } from '@/services/testService';
import { getQuestionById } from '@/services/questionService';
import { useAuthStore } from '@/store/authStore';
import { DIFFICULTY_COLORS } from '@/constants/theme';
import { Question } from '@/types';

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

type Status = 'unanswered' | 'answered' | 'flagged';

export default function TestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();

  const test = getTestById(id);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPalette, setShowPalette] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!test) return;
    setTimeLeft(test.config.timeLimit * 60);
    const qs = test.questionIds
      .map((qid) => getQuestionById(qid))
      .filter(Boolean) as Question[];
    setQuestions(qs);
  }, [test?.id]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft((t) => {
      if (t <= 1) { handleSubmit(); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(id);
  }, [timeLeft > 0]);

  const handleSubmit = useCallback(() => {
    if (!test || submitting) return;
    setSubmitting(true);
    const timeTaken = test.config.timeLimit * 60 - timeLeft;
    const attempt = submitAttempt(
      test.id,
      user?.id ?? 'student-1',
      answers,
      Array.from(flagged),
      timeTaken,
    );
    router.replace(`/(student)/results/${attempt.id}`);
  }, [test, answers, flagged, timeLeft, submitting]);

  function confirmSubmit() {
    const answered = Object.keys(answers).length;
    Alert.alert(
      'Submit Test',
      `You've answered ${answered} of ${questions.length} questions. Submit now?`,
      [
        { text: 'Review', style: 'cancel' },
        { text: 'Submit', style: 'destructive', onPress: handleSubmit },
      ],
    );
  }

  if (!test) return <LoadingSpinner fullScreen message="Loading test..." />;
  if (questions.length === 0) return <LoadingSpinner fullScreen message="Preparing questions..." />;

  const currentQ = questions[currentIdx];
  const isAnswered = (qid: string) => qid in answers;
  const isFlagged = (qid: string) => flagged.has(qid);

  function getStatus(qid: string): Status {
    if (isFlagged(qid)) return 'flagged';
    if (isAnswered(qid)) return 'answered';
    return 'unanswered';
  }

  const statusColors = { answered: '#22D3A3', flagged: '#FBBF24', unanswered: '#E8EDF8' };
  const statusText = { answered: '#fff', flagged: '#fff', unanswered: '#8899BB' };

  const urgent = timeLeft < 300;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F7FF' }}>
      {/* Top bar */}
      <View style={{ backgroundColor: '#07090F', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Timer */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12, backgroundColor: urgent ? 'rgba(248,113,113,0.2)' : 'rgba(255,255,255,0.08)' }}>
            <Ionicons name="time" size={15} color={urgent ? '#F87171' : '#8899BB'} />
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 17, color: urgent ? '#F87171' : '#fff' }}>
              {formatTime(timeLeft)}
            </Text>
          </View>

          {/* Q counter */}
          <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, color: '#fff' }}>
            {currentIdx + 1} / {questions.length}
          </Text>

          {/* Palette & Submit */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={() => setShowPalette(true)}
              style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="grid" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={confirmSubmit}
              style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#22D3A3' }}
            >
              <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13, color: '#fff' }}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress */}
        <View style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 12 }}>
          <View style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, height: '100%', backgroundColor: '#7B5CFF', borderRadius: 2 }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Question header */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          <Badge label={currentQ.subject} color="#7B5CFF" size="sm" />
          <Badge label={currentQ.difficulty} color={DIFFICULTY_COLORS[currentQ.difficulty]} size="sm" />
          {isFlagged(currentQ.id) && <Badge label="Flagged" color="#FBBF24" size="sm" />}
        </View>

        <Text style={{ fontFamily: 'PlusJakartaSans_500Medium', fontSize: 16, color: '#0D1130', lineHeight: 26, marginBottom: 24 }}>
          {currentIdx + 1}. {currentQ.content}
        </Text>

        {/* Options */}
        {currentQ.options?.map((opt, oi) => {
          const isSelected = answers[currentQ.id] === opt;
          return (
            <TouchableOpacity
              key={oi}
              onPress={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: opt }))}
              activeOpacity={0.85}
              style={{ marginBottom: 12 }}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                borderRadius: 14,
                padding: 16,
                backgroundColor: isSelected ? '#F3EFFE' : '#fff',
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? '#7B5CFF' : '#E8EDF8',
              }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: isSelected ? '#7B5CFF' : '#F5F7FF', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 13, color: isSelected ? '#fff' : '#8899BB' }}>
                    {String.fromCharCode(65 + oi)}
                  </Text>
                </View>
                <Text style={{ flex: 1, fontFamily: 'PlusJakartaSans_400Regular', fontSize: 14, color: isSelected ? '#7B5CFF' : '#0D1130', lineHeight: 20 }}>
                  {opt}
                </Text>
                {isSelected && <Ionicons name="checkmark-circle" size={20} color="#7B5CFF" />}
              </View>
            </TouchableOpacity>
          );
        })}

        {currentQ.type === 'Integer Type' && (
          <View style={{ backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E8EDF8' }}>
            <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 13, color: '#8899BB', marginBottom: 8 }}>
              Enter your integer answer:
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: '#F5F7FF', borderRadius: 10, padding: 14, alignItems: 'center' }}
              onPress={() => Alert.prompt('Integer Answer', 'Enter your answer:', (val) => {
                if (val !== null) setAnswers((prev) => ({ ...prev, [currentQ.id]: parseInt(val) || 0 }));
              })}
            >
              <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 20, color: '#4A5B8C' }}>
                {answers[currentQ.id] !== undefined ? String(answers[currentQ.id]) : 'Tap to enter'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom navigation */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E8EDF8', paddingHorizontal: 20, paddingVertical: 12, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setFlagged((prev) => {
                const next = new Set(prev);
                if (next.has(currentQ.id)) next.delete(currentQ.id);
                else next.add(currentQ.id);
                return next;
              });
            }}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: isFlagged(currentQ.id) ? '#FFFBEB' : '#F5F7FF', borderRadius: 12, paddingVertical: 11, borderWidth: 1, borderColor: isFlagged(currentQ.id) ? '#FBBF24' : 'transparent' }}
          >
            <Ionicons name={isFlagged(currentQ.id) ? 'flag' : 'flag-outline'} size={16} color={isFlagged(currentQ.id) ? '#FBBF24' : '#8899BB'} />
            <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: isFlagged(currentQ.id) ? '#FBBF24' : '#8899BB' }}>
              {isFlagged(currentQ.id) ? 'Flagged' : 'Flag'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={currentIdx === 0}
            onPress={() => setCurrentIdx((i) => i - 1)}
            style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#F5F7FF', borderRadius: 12, paddingVertical: 11, opacity: currentIdx === 0 ? 0.4 : 1 }}
          >
            <Text style={{ fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13, color: '#4A5B8C' }}>← Prev</Text>
          </TouchableOpacity>
          {currentIdx < questions.length - 1 ? (
            <TouchableOpacity
              onPress={() => setCurrentIdx((i) => i + 1)}
              style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}
            >
              <LinearGradient colors={['#7B5CFF', '#4F8FFF']} style={{ paddingVertical: 12, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13, color: '#fff' }}>Next →</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={confirmSubmit} style={{ flex: 1, borderRadius: 12, overflow: 'hidden' }}>
              <LinearGradient colors={['#22D3A3', '#16B892']} style={{ paddingVertical: 12, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'PlusJakartaSans_700Bold', fontSize: 13, color: '#fff' }}>Finish ✓</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Question Palette Modal */}
      <Modal visible={showPalette} transparent animationType="slide">
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} onPress={() => setShowPalette(false)} />
        <View style={{ backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40, maxHeight: '70%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 18, color: '#0D1130' }}>Question Map</Text>
            <TouchableOpacity onPress={() => setShowPalette(false)}>
              <Ionicons name="close" size={22} color="#8899BB" />
            </TouchableOpacity>
          </View>

          {/* Legend */}
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 20 }}>
            {(['answered', 'flagged', 'unanswered'] as Status[]).map((s) => (
              <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 12, height: 12, borderRadius: 4, backgroundColor: statusColors[s] }} />
                <Text style={{ fontFamily: 'PlusJakartaSans_400Regular', fontSize: 11, color: '#4A5B8C', textTransform: 'capitalize' }}>{s}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {questions.map((q, i) => {
              const status = getStatus(q.id);
              return (
                <TouchableOpacity
                  key={q.id}
                  onPress={() => { setCurrentIdx(i); setShowPalette(false); }}
                  style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: statusColors[status], alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontFamily: 'SpaceGrotesk_700Bold', fontSize: 14, color: statusText[status] }}>{i + 1}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

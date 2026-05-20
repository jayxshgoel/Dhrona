import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TeacherLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F8FFF',
        tabBarInactiveTintColor: '#8899BB',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#E8EDF8',
          height: 62,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontFamily: 'PlusJakartaSans_600SemiBold' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="generate"
        options={{ title: 'Generate', tabBarIcon: ({ color, size }) => <Ionicons name="sparkles" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="question-bank"
        options={{ title: 'Bank', tabBarIcon: ({ color, size }) => <Ionicons name="library" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="tests"
        options={{ title: 'Tests', tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="batches"
        options={{ title: 'Batches', tabBarIcon: ({ color, size }) => <Ionicons name="people" size={size} color={color} /> }}
      />
      <Tabs.Screen name="test-builder" options={{ href: null }} />
    </Tabs>
  );
}

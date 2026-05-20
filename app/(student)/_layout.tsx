import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function StudentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#7B5CFF',
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
        name="practice"
        options={{ title: 'Practice', tabBarIcon: ({ color, size }) => <Ionicons name="sparkles" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="tests"
        options={{ title: 'My Tests', tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} /> }}
      />
      <Tabs.Screen name="test" options={{ href: null }} />
      <Tabs.Screen name="results" options={{ href: null }} />
    </Tabs>
  );
}

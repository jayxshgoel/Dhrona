import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ParentLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#22D3A3',
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
        options={{ title: 'Overview', tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} /> }}
      />
      <Tabs.Screen
        name="subscription"
        options={{ title: 'Subscription', tabBarIcon: ({ color, size }) => <Ionicons name="diamond" size={size} color={color} /> }}
      />
      <Tabs.Screen name="child" options={{ href: null }} />
      <Tabs.Screen name="link-child" options={{ href: null }} />
    </Tabs>
  );
}

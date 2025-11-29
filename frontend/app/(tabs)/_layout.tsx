import { activeColor, inActiveColor } from '@/constants/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inActiveColor,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="map" color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Wydarzenia',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="event-available" color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: 'Znajomi',
          tabBarIcon: ({ color }) => (
            <MaterialIcons size={28} name="emoji-people" color={color} />
          )
        }}
      />
    </Tabs>
  );
}

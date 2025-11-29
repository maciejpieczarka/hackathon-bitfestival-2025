import TabBarIcon from '@/components/tabBarIcon';
import { activeColor } from '@/constants/colors';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarStyle: {
          backgroundColor: 'white',
          borderRadius: 15,
          position: 'absolute',
          bottom: 40,
          height: 80,
          shadowColor: '#1a1a1a',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          elevation: 5,
          marginHorizontal: 20
        },
        tabBarItemStyle: {
          flexDirection: 'row',
          alignItems: 'center'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Odkrywaj',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              icon="explore"
              page="Odkrywaj"
              color={color}
              focused={focused}
            />
          )
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Grupy',
          tabBarIcon: ({ focused, color }) => (
            <TabBarIcon
              icon="groups"
              page="Grupy"
              color={color}
              focused={focused}
            />
          )
        }}
      />

      <Tabs.Screen
        name="friends"
        options={{
          title: 'Wydarzenia',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              icon="event-available"
              page="Wydarzenia"
              color={color}
              focused={focused}
            />
          )
        }}
      />
    </Tabs>
  );
}

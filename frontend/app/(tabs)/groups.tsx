import GroupCard from '@/components/groupCard';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Groups } from '@/constants/groups';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function GroupsPage() {
  //api
  const fetchGroups = async (
    mood: number,
    energy: number,
    collaborationStyle: number,
    userActivities: number[]
  ) => {
    const username = 'maciek@polsl.pl';
    const password = 'test';
    try {
      const response = await fetch(
        'http://192.168.3.138:8000/user_input_data',
        {
          method: 'POST',
          headers: {
            Authorization: 'Basic ' + btoa(username + ':' + password),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mood: mood,
            energy: energy,
            collaboration_style: collaborationStyle,
            activity: userActivities
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
    } catch (error) {}
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {/* Lista najlepszych dopasowan pobranych z api */}
        <ScrollView>
          <Box className="mx-6 my-6 flex gap-1 ">
            <Text size="lg">Odnajdź</Text>
            <Heading size="2xl">Społeczności dla siebie!</Heading>
          </Box>
          <Box className="mb-40 flex justify-between px-6 min-h-screen w-full">
            {Groups.map(group => {
              return (
                <GroupCard
                  key={group.id}
                  id={group.id}
                  group_category={group.group_category}
                  group_description={group.group_description}
                  group_name={group.group_name}
                  group_users={group.group_users}
                />
              );
            })}
          </Box>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

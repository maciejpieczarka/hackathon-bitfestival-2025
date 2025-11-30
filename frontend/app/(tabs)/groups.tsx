import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Group } from '@/constants/groups';
import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function GroupsPage() {
  const [groupsState, setGroupsState] = React.useState<Group[]>([]);

  //api
  useEffect(() => {
    const username = 'maciek@polsl.pl';
    const password = 'test';
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://192.168.3.138:8000/groups_unassigned`,
          {
            method: 'GET',
            headers: {
              Authorization: 'Basic ' + btoa(username + ':' + password),
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const groups = await response.json();
        setGroupsState(groups.groups);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);
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
            {groupsState.map(grupa => {
              return <Text key={grupa.id}>sdf d</Text>;
            })}
          </Box>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

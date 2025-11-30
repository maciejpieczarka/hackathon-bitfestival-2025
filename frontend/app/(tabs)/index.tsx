import QuizModal from '@/components/quizModal';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import UserCard from '@/components/userCard';
import { User } from '@/constants/users';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Tab() {
  const [showModal, setShowModal] = React.useState(false);
  const [usersState, setUsersState] = React.useState([]);

  //Sliders
  const insertUserData = async (
    mood: number,
    energy: number,
    collaborationStyle: number,
    userActivities: number[]
  ) => {
    const username = 'maciek@polsl.pl';
    const password = 'test';
    try {
      const response = await fetch(
        'http://10.186.102.194:8000/user_input_data',
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

      setUsersState(result.users);
    } catch (error) {}
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {/* Modal that opens once every 24h */}
        <QuizModal
          onFetch={insertUserData}
          isOpen={showModal}
          setIsOpen={setShowModal}
        />

        {/* Lista najlepszych dopasowan pobranych z api */}
        <ScrollView>
          <Box className="mx-6 my-6 flex gap-1 ">
            <Text size="lg">Odkrywaj</Text>
            <Heading size="2xl">Swoje idealne połączenia!</Heading>
          </Box>
          <Box className="mb-40 flex justify-between px-6 min-h-screen w-full">
            {usersState.length !== 0 ? (
              usersState.map((user: User) => {
                return (
                  <UserCard
                    key={user.id}
                    username={user.username}
                    id={user.id}
                    activities={user.activities}
                    description={user.description}
                  />
                );
              })
            ) : (
              <Box className="flex w-full h-screen">
                <Image
                  className="object-cover w-full"
                  alt="Not found"
                  source={require('@/assets/images/notfound.png')}
                />
              </Box>
            )}
          </Box>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

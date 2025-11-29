import QuizModal from '@/components/quizModal';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import UserCard from '@/components/userCard';
import { users } from '@/constants/users';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Tab() {
  const [showModal, setShowModal] = React.useState(false);

  //Sliders

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {/* Modal that opens once every 24h */}
        <QuizModal isOpen={showModal} setIsOpen={setShowModal} />

        {/* Lista najlepszych dopasowan pobranych z api */}
        <ScrollView>
          <Box className="mx-6 my-6 flex gap-1 ">
            <Text size="lg">Odkrywaj</Text>
            <Heading size="2xl">Swoje idealne połączenia!</Heading>
          </Box>
          <Box className="mb-40 flex justify-between px-6 min-h-screen w-full">
            {users.map(user => {
              return (
                <UserCard
                  key={user.id}
                  name={user.name}
                  id={user.id}
                  activities={user.activities}
                  description={user.description}
                  image={user.image}
                />
              );
            })}
          </Box>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

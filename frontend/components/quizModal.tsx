import { Activities, Activity } from '@/constants/activities';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuizSlider from './quizSlider';
import { Box } from './ui/box';
import { Button, ButtonText } from './ui/button';
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel
} from './ui/checkbox';
import { Heading } from './ui/heading';
import { CheckIcon } from './ui/icon';
import { Image } from './ui/image';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader
} from './ui/modal';
import { Text } from './ui/text';

const QuizModal = ({
  onFetch,
  isOpen,
  setIsOpen
}: {
  onFetch: any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [moodState, setMoodState] = React.useState<number>(0);
  const [energyState, setEnergyState] = React.useState<number>(0);
  const [collaborationStyleState, setCollaborationStyleState] =
    React.useState<number>(0);
  const [userActivitiesState, setUserActivitiesState] = React.useState<
    number[]
  >([]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      size="full"
    >
      <ModalBackdrop />
      <ModalContent className="max-h-screen">
        <ScrollView>
          <SafeAreaView>
            <ModalHeader className="flex flex-col w-full">
              <Heading size="2xl" className="text-center my-4">
                Odnajdź idealną grupę!
              </Heading>
              <Image
                alt="quiz"
                className="w-full h-52 object-cover"
                source={require('@/assets/images/quiz-image.png')}
              />
            </ModalHeader>
            <ModalBody scrollEnabled={false}>
              <Text size="sm" className="text-center mb-4">
                Daj nam poznać Twój obecny puls, a pokażemy Ci ludzi, którzy
                rezonują z Twoją energią.
              </Text>

              <QuizSlider
                title="Podaj swój nastrój w skali 1-100"
                value={moodState}
                onChange={setMoodState}
              />
              <QuizSlider
                title="Podaj swój nastrój w skali 1-100"
                value={energyState}
                onChange={setEnergyState}
              />

              <QuizSlider
                title="Podaj swój sposób współpracy w skali 1-100"
                value={collaborationStyleState}
                onChange={setCollaborationStyleState}
              />

              <Box className="p-4">
                <Heading size="md" className="text-center">
                  Wybierz aktywności, które cię interesują
                </Heading>

                <Box className="grid grid-cols-2 gap-2">
                  {Activities.map((activity: Activity) => {
                    return (
                      <Checkbox
                        key={activity.id}
                        value={activity.name}
                        isDisabled={false}
                        isInvalid={false}
                        size="lg"
                        isChecked={
                          userActivitiesState.includes(activity.id)
                            ? true
                            : false
                        }
                        onChange={isSelected => {
                          setUserActivitiesState(prev =>
                            isSelected
                              ? [...prev, activity.id]
                              : prev.filter(item => item !== activity.id)
                          );
                        }}
                      >
                        <CheckboxIndicator>
                          <CheckboxIcon as={CheckIcon} />
                        </CheckboxIndicator>
                        <CheckboxLabel>{activity.name}</CheckboxLabel>
                      </Checkbox>
                    );
                  })}
                </Box>
              </Box>
            </ModalBody>
            <ModalFooter className="flex items-center justify-center">
              <Button
                variant="outline"
                action="negative"
                className="mr-3 rounded-md"
                onPress={() => {
                  setIsOpen(false);
                }}
              >
                <ButtonText>Wypełnij później</ButtonText>
              </Button>
              <Button
                variant="solid"
                className="bg-info-500"
                onPress={() => {
                  onFetch(
                    moodState,
                    energyState,
                    collaborationStyleState,
                    userActivitiesState
                  );
                  setIsOpen(false);
                }}
              >
                <ButtonText>Zapisz</ButtonText>
              </Button>
            </ModalFooter>
          </SafeAreaView>
        </ScrollView>
      </ModalContent>
    </Modal>
  );
};

export default QuizModal;

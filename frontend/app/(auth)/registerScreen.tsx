import {SafeAreaView} from "react-native-safe-area-context";
import {Box} from "@/components/ui/box";
import {Image} from '@/components/ui/image'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Controller, useForm} from 'react-hook-form';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import FormField from '@/components/auth/form-field'
import { Text } from '@/components/ui/text';
import {ArrowLeftIcon, CheckIcon, CloseCircleIcon, Icon} from '@/components/ui/icon';
import {useRouter} from 'expo-router';
import { AuthContext } from '@/contexts/AuthContext';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@/components/ui/modal';
import {Heading} from "@/components/ui/heading";

enum Errors {
  INVALID_EMAIL,
  TAKEN_EMAIL,
  INVALID_USERNAME,
  TAKEN_USERNAME,
  PASSWORD_TOO_SHORT,
  PASSWORDS_DOESNT_MATCH,
}

export default function RegisterScreen() {
  const [passVis, setPassVis] = useState(false)
  const [rePassVis, setRePassVis] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [success, setSuccess] = useState(false)

  const router = useRouter()

  const authContext = useContext(AuthContext);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "", username: "", repeatedPassword: "" },
    mode: "onBlur",
  });

  const password = watch('password')

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    setIsLoading(true)
    authContext.registerUser(data.username, data.password, data.email)
        .then((value) => {
            setIsLoading(false)
            setSuccess(value)
            setShowModal(true)
        })

  };

  const handlePassVisChange = () => {
    setPassVis((prev) => !prev)
  }

  const handleRePassVisChange = () => {
    setRePassVis((prev) => !prev)
  }

  const handleOnPress = () => {
    router.replace('/(auth)')
  }

  const handleOnCloseModal = () => {
      setShowModal(false)
      if (success) {
          router.replace('/(auth)')
      }
  }

    return (
        <SafeAreaView>
            <ModalInfo
                showModal={showModal}
                onCloseModal={handleOnCloseModal}
                success={success}
            />
          <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
          <ScrollView
              keyboardShouldPersistTaps={'handled'}
              contentContainerStyle={{}}
          >
            <VStack space={'lg'} className={'pb-100'}>
              <Box className={'flex-col w-full items-center'}>
                <Image
                  source={require('@/assets/images/register.png')}
                  alt={'login'}
                  className={' w-full h-72'}
                />
              </Box>
              <Box className={'w-full items-center'}>
                <Text size={'3xl'} className={'text-center font-bold pb-4 border-b-2 border-info-500 w-11/12'}>Rozpocznij swoją przygodę wraz z Hang Over</Text>
              </Box>
              <Box className={'w-full flex-row grow'}>
                <Button
                  variant={'link'}
                  onPress={handleOnPress}
                  className={'ml-5'}
                >
                  <ButtonIcon size={'sm'} as={ArrowLeftIcon}/>
                  <ButtonText>Wróć do logowania</ButtonText>
                </Button>
              </Box>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "E-mail jest wymagany!",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Niepoprawny adres e-mail!" },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <FormField
                      isInvalid={!!errors.email}
                      label={'E-mail'}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      errorMessage={errors.email?.message}
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="username"
                rules={{
                  required: "Nazwa użytkownika jest wymagana",

                  // pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Niepoprawna nazwa użytkownika!" },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <FormField
                      isInvalid={!!errors.username}
                      label={'Nazwa użytkownika'}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      errorMessage={errors.username?.message}
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Hasło jest wymagane!",
                  minLength: {value: 1, message: "Hasło musi mieć minimum 8 znaków!"},
                  // pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Password should contain: " },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <FormField
                      isInvalid={!!errors.password}
                      label={'Hasło'}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      errorMessage={errors.password?.message}
                      onVisibilityChange={handlePassVisChange}
                      visibility={passVis}
                    />
                  </>
                )}
              />

              <Controller
                control={control}
                name="repeatedPassword"
                rules={{
                  required: "Należy powtórzyć wpisane hasło!",
                  validate: (value) => value === password || "Hasła się  nie zgadzają!"
                  // pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Password should contain: " },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <FormField
                      isInvalid={!!errors.repeatedPassword}
                      label={'Powtórz hasło'}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      errorMessage={errors.repeatedPassword?.message}
                      onVisibilityChange={handleRePassVisChange}
                      visibility={rePassVis}
                    />
                  </>
                )}
              />
              <Box className={'mt-4 mb-5 flex-row grow justify-center'}>
                <Button
                  onPress={handleSubmit(onSubmit)}
                  size={'xl'}
                  className={'bg-info-500 pl-14 pr-14 rounded-3xl'}
                >
                  <ButtonText>Rejestruj</ButtonText>
                </Button>
              </Box>
            </VStack>
          </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>

    )
}

interface ModalInfoProps {
    showModal: boolean,
    onCloseModal: () => void,
    success: boolean
}

function ModalInfo({showModal, onCloseModal, success} : ModalInfoProps) {
    return (
        <Modal
            isOpen={showModal}
            onClose={onCloseModal}
        >
            <ModalBackdrop />
            <ModalContent>
                <ModalHeader className="flex-col items-center gap-0.5">
                    {!success ? (
                    <>
                        <Box className="w-[40px] h-[40px] rounded-full bg-background-error items-center justify-center">
                            <Icon
                                className={'stroke-error-600 h-[35px] w-[35px]'}
                                as={CloseCircleIcon}
                                size={'xl'}
                            />
                        </Box>
                    </>
                    ) : (
                    <>
                        <Box className="w-[40px] h-[40px] rounded-full bg-background-success items-center justify-center">
                            <Icon
                                className={'stroke-success-500 h-[35px] w-[35px]'}
                                as={CheckIcon}
                                size={'xl'}
                            />
                        </Box>
                    </>
                    )}

                    <Heading className={'text-center'}>
                        {success ? 'Udało się utworzyć konto!' : 'Wystąpił błąd podczas tworzenia konta!'}
                    </Heading>
                </ModalHeader>
                <ModalFooter className="flex-col items-start">
                    <Button
                        variant="link"
                        size="sm"
                        className="gap-1"
                    >
                        <ButtonIcon as={ArrowLeftIcon} />
                        <ButtonText onPress={onCloseModal}>{success ? 'Przejdź do ekranu logowania': 'Wróć do rejestracji'}</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
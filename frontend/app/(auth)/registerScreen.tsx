import {SafeAreaView} from "react-native-safe-area-context";
import {Box} from "@/components/ui/box";
import {Image} from '@/components/ui/image'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Controller, useForm} from 'react-hook-form';
import { ScrollView } from 'react-native';
import FormField from '@/components/auth/form-field'
import { Text } from '@/components/ui/text';
import { ArrowLeftIcon } from '@/components/ui/icon';
import {useRouter} from 'expo-router';

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

  const router = useRouter()

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
  };

  const handlePassVisChange = () => {
    setPassVis((prev) => !prev)
  }

  const handleRePassVisChange = () => {
    setRePassVis((prev) => !prev)
  }

  const handleOnPress = () => {
    router.replace('/(auth)/loginScreen')
  }

    return (
        <SafeAreaView>
          <ScrollView className={''}>
            <VStack space={'lg'}>
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
                  minLength: {value: 8, message: "Hasło musi mieć minimum 8 znaków!"},
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
              <Box className={'mt-4 flex-row grow justify-center'}>
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
        </SafeAreaView>

    )
}
import {SafeAreaView} from "react-native-safe-area-context";
import {Box} from "@/components/ui/box";
import {Image} from '@/components/ui/image'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { useContext, useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView } from 'react-native';
import FormField from '@/components/auth/form-field'
import {Text} from '@/components/ui/text'
import { ExternalPathString, Link, RelativePathString, useRouter } from 'expo-router';
import { ExternalLinkIcon } from '@/components/ui/icon';
import { AuthContext } from '@/contexts/AuthContext';

enum Errors {
  INVALID_EMAIL,
  TAKEN_EMAIL,
  INVALID_USERNAME,
  TAKEN_USERNAME,
  PASSWORD_TOO_SHORT,
  PASSWORDS_DOESNT_MATCH,
}

export default function Index() {
  const [passVis, setPassVis] = useState(false)

  const router = useRouter()
  const authContext = useContext(AuthContext)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: ""},
    mode: "onBlur",
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    authContext.loginUser(data.email, data.password)
  };

  const handlePassVisChange = () => {
    setPassVis((prev) => !prev)
  }

  const handleForgotPasswordPress = () => {
    router.replace('/(auth)/registerScreen')
  }

  const handleNoAccountPress = () => {
    router.replace('/(auth)/registerScreen')
  }

  return (
    <SafeAreaView>
      <ScrollView className={''}>
        <VStack space={'lg'}>
          <Box className={'flex-col w-full items-center'}>
            <Image
              source={require('@/assets/images/login.png')}
              alt={'login'}
              className={' w-full h-72 rounded-3xl'}
            />
          </Box>
          <Box className={'w-full items-center'}>
            <Text size={'3xl'} className={'text-center font-bold pb-4 border-b-2 border-info-500 w-11/12'}>Logowanie do Hang Over</Text>
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
            name="password"
            rules={{
              required: "Hasło jest wymagane!",
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
          <Box className={'mt-2'}>
            <MyLink
              handleOnPress={handleForgotPasswordPress}
              linkText={'Nie pamiętasz hasła?'}
            />
            <MyLink
              handleOnPress={handleNoAccountPress}
              linkText={'Nie masz jeszcze konta?'}
            />
          </Box>
          <Box className={'mt-4 flex-row grow justify-center'}>
            <Button
              onPress={handleSubmit(onSubmit)}
              size={'xl'}
              className={'bg-info-500 pl-14 pr-14 rounded-3xl'}
            >
              <ButtonText>Zaloguj się </ButtonText>
            </Button>
          </Box>
        </VStack>
      </ScrollView>
    </SafeAreaView>

  )
}

interface MyLinkProps {
  handleOnPress: any,
  linkText: string
}

function MyLink({handleOnPress, linkText}: MyLinkProps) {
  const [isFocused, setIsFocused] = useState(false)


  const handleOnPressIn = () => {
    setIsFocused(true)
  }

  const handleOnPressOut = () => {
    setIsFocused(false)
  }

  return (
    <Button
      variant={'link'}
      onPress={handleOnPress}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
      className={'justify-start ml-5'}
    >
      <ButtonText>{
        linkText}
      </ButtonText>
      <ButtonIcon size={'sm'} as={ExternalLinkIcon}/>
    </Button>
  )
}
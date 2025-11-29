import {SafeAreaView} from "react-native-safe-area-context";
import {Box} from "@/components/ui/box";
import {Text} from "@/components/ui/text";
import {
    FormControl,
    FormControlLabel,
    FormControlError,
    FormControlErrorText,
    FormControlErrorIcon,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabelText,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { useState } from 'react';
import { VStack } from '@/components/ui/vstack';
import { Controller, useForm } from 'react-hook-form';

enum Errors {
  INVALID_EMAIL,
  TAKEN_EMAIL,
  INVALID_USERNAME,
  TAKEN_USERNAME,
  PASSWORD_TOO_SHORT,
  PASSWORDS_DOESNT_MATCH,
}

export default function RegisterScreen() {
 /* const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [email, setEmail] = useState('')*/

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "", username: "", repeatedPassword: "" },
    mode: "onBlur", // or "onChange" for real-time validation
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  // const handleOnChangeUsername = (value: string) => {
  //   console.log(value)
  //   setUsername(value);
  // }
  //
  // const handleOnChangePassword = (value: string) => {
  //   console.log(value)
  //   setPassword(value);
  // }
  //
  // const handleOnChangeRepeatedPassword = (value: string) => {
  //   console.log(value)
  //   setRepeatedPassword(value);
  // }
  //
  // const handleOnChangeEmail = (value: string) => {
  //   console.log(value)
  //   setRepeatedPassword(value);
  // }


    return (
        <SafeAreaView>
          <VStack space={'lg'}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <FormControl
                    size={'md'}
                    isRequired={true}
                    isInvalid={errors.email}
                  >
                    <FormControlLabel>
                      <FormControlLabelText>E-mail</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        placeholder="E-mail"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </Input>
                    <FormControlHelper>
                    </FormControlHelper>
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} className={'color-red-700'} />
                      <FormControlErrorText className={'color-red-700'}>
                        {errors.email && <Text>{errors.email.message}</Text>}
                      </FormControlErrorText>
                    </FormControlError>
                  </FormControl>
                  {/*{errors.email && <Text style={{ color: "red" }}>{errors.email.message}</Text>}*/}
                </>
              )}
            />

            {/*<Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Input>
                    <InputField
                      placeholder="Password"
                      secureTextEntry
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                  </Input>
                  {errors.password && (
                    <Text style={{ color: "red" }}>{errors.password.message}</Text>
                  )}
                </>
              )}
            />*/}

            <Button onPress={handleSubmit(onSubmit)} ><ButtonText>Rejestruj</ButtonText></Button>
          </VStack>
         {/* <FormControl
            isInvalid={false}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
          >
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Input className="my-1" size="md">
              <InputField
                type="password"
                placeholder="password"
                value={username}
                onChangeText={handleOnChangeUsername}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>
                Must be at least 6 characters.
              </FormControlHelperText>
            </FormControlHelper>
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} className="text-red-500" />
              <FormControlErrorText className="text-red-500">
                At least 6 characters are required.
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
            <Box>
                <Button variant={'solid'} className={'bg-primary-3'} >
                    <ButtonText>Log In</ButtonText>
                </Button>
            </Box>*/}
        </SafeAreaView>
    )
}
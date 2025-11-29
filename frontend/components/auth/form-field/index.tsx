import {
  FormControl,
  FormControlError, FormControlErrorIcon, FormControlErrorText,
  FormControlHelper,
  FormControlLabel,
  FormControlLabelText
} from '@/components/ui/form-control';
import { Input, InputField, InputIcon } from '@/components/ui/input';
import { EyeOffIcon, EyeIcon, AlertCircleIcon } from '@/components/ui/icon';
import { Pressable } from 'react-native';

interface FormFieldProps {
  isInvalid: boolean,
  label: string,
  value: string | undefined,
  onChange: () => void,
  onBlur: () => void,
  errorMessage: string | undefined,
  onVisibilityChange?: () => void,
  visibility?: boolean
}

export default function FormField({isInvalid, label, value, onChange, onBlur, errorMessage, onVisibilityChange, visibility = true} : FormFieldProps) {
  return (
    <FormControl
      size={'lg'}
      isRequired={true}
      isInvalid={isInvalid}
      className={' ml-3 mr-3'}
    >
      <FormControlLabel>
        <FormControlLabelText>{label}</FormControlLabelText>
      </FormControlLabel>
      <Input className={'rounded-3xl h-12'} size={'lg'}>
        <InputField
          placeholder={label}
          type={visibility ? 'text' : 'password'}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}

        />
        {onVisibilityChange && (
          <Pressable onPress={onVisibilityChange}>
            <InputIcon className={'p-3 mr-4'} as={!visibility ? EyeOffIcon : EyeIcon} />
          </Pressable>
        )}
      </Input>
      <FormControlHelper>
      </FormControlHelper>
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} className={'color-red-700'} />
        <FormControlErrorText className={'color-red-700'} size={'sm'}>
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
}
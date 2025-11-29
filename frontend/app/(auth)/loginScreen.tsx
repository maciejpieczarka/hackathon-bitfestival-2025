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


export default function LoginScreen() {
    return (
        <SafeAreaView>
            <Box>
                <Button>
                    <ButtonText>Log In</ButtonText>
                </Button>
            </Box>
        </SafeAreaView>
    )
}
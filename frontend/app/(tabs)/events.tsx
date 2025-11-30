import { StyleSheet, Text, View } from 'react-native';
import {Button, ButtonText} from "@/components/ui/button";
import {useContext} from "react";
import {AuthContext} from "@/contexts/AuthContext";
import {getEvents} from "@/api/eventsApiHandler";

export default function EventsPage() {

    const authContext = useContext(AuthContext)

    const handleClick = () => {
        getEvents(authContext.token)
    }

    return (
    <View style={styles.container}>
      <Text>Znajomi</Text>
        <Button onPress={handleClick}>
            <ButtonText>Pobierz</ButtonText>
        </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

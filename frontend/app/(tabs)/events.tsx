import { StyleSheet, Text, View } from 'react-native';

export default function EventsPage() {
  return (
    <View style={styles.container}>
      <Text>Znajomi</Text>
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

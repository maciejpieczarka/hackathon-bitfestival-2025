import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { Stack } from 'expo-router';

export default function Layout() {
  const isLogged = false;

  return (
    <GluestackUIProvider>
      <Stack>
        {isLogged ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
      </Stack>
    </GluestackUIProvider>
  );
}

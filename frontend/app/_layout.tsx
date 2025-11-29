import '@/global.css';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

export default function Layout() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const redirectedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || redirectedRef.current) return;

    const checkAuth = async () => {
      const isLoggedIn = false;

      if (!isLoggedIn) {
        redirectedRef.current = true;
        router.replace("/(auth)/loginScreen");
      } else {
        redirectedRef.current = true;
        router.replace("/");
      }
    };

    checkAuth();
  }, [mounted]);
  return (
    <GluestackUIProvider>
      <Stack screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  );
}

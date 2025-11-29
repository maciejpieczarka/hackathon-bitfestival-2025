import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthContextProvider } from '@/contexts/AuthContext';

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
        router.replace("/(auth)");
      } else {
        redirectedRef.current = true;
        router.replace("/");
      }
    };

    checkAuth();
  }, [mounted]);
  return (
    <AuthContextProvider>
      <GluestackUIProvider>
        <Stack screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </GluestackUIProvider>
    </AuthContextProvider>
  );
}

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthContext, AuthContextProvider } from '@/contexts/AuthContext';
import '@/global.css';
import { Stack, useRouter } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';

export default function Layout() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const redirectedRef = useRef(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || redirectedRef.current) return;

    const checkAuth = async () => {
      const isLoggedIn = false;

      if (!isLoggedIn) {
        redirectedRef.current = true;
        router.replace('/(tabs)');
      } else {
        redirectedRef.current = true;
        router.replace('/');
      }
    };

    checkAuth();
  }, [mounted]);
  return (
    <AuthContextProvider>
      <GluestackUIProvider>
        <Stack
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/*<Stack.Screen name="(auth)" options={{ headerShown: false }} />*/}
        </Stack>
      </GluestackUIProvider>
    </AuthContextProvider>
  );
}

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { AuthContext, AuthContextProvider } from '@/contexts/AuthContext';
import '@/global.css';
import {Stack, useRootNavigationState, useRouter} from 'expo-router';
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
      /*setTimeout(() => {
          if (!isLoggedIn) {
              redirectedRef.current = true;
              router.replace('/(auth)');
          } else {
              redirectedRef.current = true;
              router.replace('/');
          }
      }, 2000)*/
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

          <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
        </Stack>
      </GluestackUIProvider>
    </AuthContextProvider>
  );
}

// App.tsx — Entry point de Comprasur
// Expo SDK 53 + React Navigation 7 + Zustand 5 + Supabase

import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';

// Polyfills for testing globals leaked by libraries
if (typeof global.describe === 'undefined') {
  (global as any).describe = () => {};
}
if (typeof global.test === 'undefined') {
  (global as any).test = () => {};
}

// ─── Loading inicial ───
function AppLoader() {
  return (
    <View style={styles.loader}> 
      <ActivityIndicator size="large" color={theme.colors.blueDeep} />
    </View>
  );
}

// ─── App principal ───
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Pequeño delay para asegurar que Expo hydrate correctamente
    const timer = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return <AppLoader />;

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSoft,
  },
});

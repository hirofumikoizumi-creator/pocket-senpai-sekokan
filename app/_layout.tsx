import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS } from '../src/utils/theme';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.white,
            },
            headerTintColor: COLORS.text,
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 17,
            },
            headerShadowVisible: false,
            contentStyle: {
              backgroundColor: COLORS.background,
            },
          }}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

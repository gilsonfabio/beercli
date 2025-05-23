import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{headerShown: false}} />
        <Stack.Screen name="login" options={{title:'Login', headerShown: false}} />
        <Stack.Screen name="register" options={{title:'Register', headerShown: false}} />
        <Stack.Screen name="dashboard" options={{title:'Dashboard', headerShown: false}} />
        <Stack.Screen name="recarga" options={{title:'Recarga', headerShown: false}} />
        <Stack.Screen name="pagtopix" options={{title:'PagtoPix', headerShown: false}} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

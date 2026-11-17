import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import { Rajdhani_500Medium, Rajdhani_600SemiBold } from '@expo-google-fonts/rajdhani';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { QuestioProvider } from '../contexto/QuestioContexto';

export default function Layout() {
  const [fontesCarregadas, erroFontes] = useFonts({
    BebasNeue_400Regular,
    Rajdhani_500Medium,
    Rajdhani_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontesCarregadas && !erroFontes) return null;

  return (
    <QuestioProvider>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#303032' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="gerenciar" />
        <Stack.Screen name="editar" />
      </Stack>
    </QuestioProvider>
  );
}

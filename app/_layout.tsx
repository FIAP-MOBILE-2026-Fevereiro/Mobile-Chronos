// ==========================================================================================
// ARQUIVO DE LAYOUT ROOT DO EXPO ROUTER (CHRONOS DTN MOBILE)
// CARREGA AS FONTES GOOGLE SYNE E DM SANS E CONFIGURA O ROTEADOR ROOT
// ==========================================================================================

// Importa os componentes de tela e navegação do framework expo-router.
import { Stack } from 'expo-router';
// Importa o componente para gerenciamento da barra de status nativa do celular.
import { StatusBar } from 'expo-status-bar';
// Importa utilitários de renderização de área de segurança do React Native.
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Importa o hook para carregar fontes externas dinamicamente.
import { useFonts } from 'expo-font';
// Importa a fonte Syne Bold oficial do Google Fonts.
import { Syne_700Bold } from '@expo-google-fonts/syne';
// Importa as variações da fonte DM Sans oficial do Google Fonts.
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
// Importa elementos básicos de layout e loading do React Native.
import { ActivityIndicator, View } from 'react-native';

// Componente funcional principal de Layout que envolve todo o ecossistema do app.
export default function RootLayout() {
  // Carrega as fontes do Google Fonts mapeando-as para nomes lógicos locais.
  const [fontsLoaded] = useFonts({
    'Syne-Bold': Syne_700Bold,
    'DMSans-Regular': DMSans_400Regular,
    'DMSans-Medium': DMSans_500Medium,
    'DMSans-Bold': DMSans_700Bold,
  });

  // Retorna uma tela de carregamento caso as fontes ainda estejam sendo carregadas.
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0A0E1A', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0085FF" />
      </View>
    );
  }

  // Retorna a árvore de componentes provendo área de segurança e rotas por pilha.
  return (
    <SafeAreaProvider>
      {/* Força o tema da barra de status nativa superior para estilo claro. */}
      <StatusBar style="light" />

      {/* Configura a pilha de telas direcionando o fluxo para o grupo de abas. */}
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: '#0A0E1A' },
          headerShown: false,
        }}
      >
        {/* Declaração de rota que mapeia o grupo de abas inferiores. */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}

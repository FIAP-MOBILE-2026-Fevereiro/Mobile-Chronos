// ==========================================================================================
// ARQUIVO DE LAYOUT DE ABAS (TABS LAYOUT) - (TABS) GROUP (CHRONOS DTN MOBILE)
// CONFIGURA A BARRA DE ABAS MINIMALISTA DO TEMA VOID PROTOCOL COM ICONES ANIMADOS
// ==========================================================================================

import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

// Componente auxiliar para animar a escala do ícone ao ser selecionado (efeito clique).
function AnimatedTabBarIcon({
  name,
  color,
  size,
  focused,
}: {
  name: any;
  color: string;
  size: number;
  focused: boolean;
}) {
  const escala = useRef(new Animated.Value(1)).current;

  // Dispara a animação sempre que o estado de foco mudar.
  useEffect(() => {
    if (focused) {
      // Efeito de clique suave seguido de spring bounce ao selecionar a aba.
      Animated.sequence([
        Animated.timing(escala, { toValue: 1.25, duration: 150, useNativeDriver: true }),
        Animated.spring(escala, { toValue: 1.1, friction: 4, useNativeDriver: true }),
      ]).start();
    } else {
      // Retorna para o tamanho padrão ao desfocalizar a aba.
      Animated.timing(escala, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    }
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale: escala }] }}>
      <Ionicons name={name} size={size} color={color} />
    </Animated.View>
  );
}

// Componente principal de navegação de Abas do aplicativo móvel Chronos DTN.
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'relative',
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
          shadowColor: 'transparent',
          elevation: 0,
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.purple,
        tabBarLabelStyle: {
          fontFamily: 'DMSans-Bold',
          fontSize: 9,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
      }}
    >
      {/* Aba 1: Dashboard Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabBarIcon name={focused ? 'compass' : 'compass-outline'} size={size - 2} color={color} focused={focused} />
          ),
        }}
      />

      {/* Aba 2: Auditor de Tempo Relativístico */}
      <Tabs.Screen
        name="auditor"
        options={{
          title: 'Auditor',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabBarIcon name={focused ? 'pulse' : 'pulse-outline'} size={size - 2} color={color} focused={focused} />
          ),
        }}
      />

      {/* Aba 3: Gerenciador de Nós DTN */}
      <Tabs.Screen
        name="nodes"
        options={{
          title: 'Nós',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabBarIcon name={focused ? 'hardware-chip' : 'hardware-chip-outline'} size={size - 2} color={color} focused={focused} />
          ),
        }}
      />

      {/* Aba 4: Monitor de Buffer DTN */}
      <Tabs.Screen
        name="buffer"
        options={{
          title: 'Buffer',
          tabBarIcon: ({ color, size, focused }) => (
            <AnimatedTabBarIcon name={focused ? 'infinite' : 'infinite-outline'} size={size - 2} color={color} focused={focused} />
          ),
        }}
      />

      {/* Aba 5: Perfil e Configurações (oculta da barra inferior) */}
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

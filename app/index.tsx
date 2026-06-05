// ==========================================================================================
// TELA DE POUSO / SPLASH PAGE - TEMA VOID PROTOCOL (CHRONOS DTN MOBILE)
// INTERFACE INDIGO SOVEREIGN COM ANIMAÇÕES ORBITAIS E BOTÃO DE INICIALIZAÇÃO
// ==========================================================================================

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/Colors';

// Componente principal correspondente à Splash Screen de inicialização do app.
export default function SplashPage() {
  const router = useRouter();

  // Valor animado para a opacidade suave de entrada dos títulos e órbitas.
  const entradaOpacidade = useRef(new Animated.Value(0)).current;
  // Valor animado para o pulsar constante do LED ciano (satélite orbital).
  const opacidadeLed = useRef(new Animated.Value(0.4)).current;
  // Valor animado para a microanimação de escala do botão principal.
  const escalaBotao = useRef(new Animated.Value(1)).current;

  // Efeito disparado na inicialização para carregar as animações de entrada e looping.
  useEffect(() => {
    // Transiciona a opacidade de entrada de 0 para 1 em 1200ms.
    Animated.timing(entradaOpacidade, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();

    // Inicia um loop infinito para o LED do satélite pulsar.
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacidadeLed, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacidadeLed, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Microanimação de escala ao pressionar o botão de conexão.
  const handlePressIn = () => {
    Animated.timing(escalaBotao, { toValue: 0.96, duration: 100, useNativeDriver: true }).start();
  };

  // Microanimação de escala ao soltar o botão de conexão.
  const handlePressOut = () => {
    Animated.spring(escalaBotao, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  // Redireciona de forma definitiva para o grupo de abas (Dashboard Home).
  const iniciarConexao = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.containerPrincipal}>

      {/* PONTOS DE GLOW AZUL DE FUNDO PARA IMERSÃO ESPACIAL */}
      <View style={styles.glowSpotTop} />
      <View style={styles.glowSpotBottom} />

      {/* ÁREA CENTRAL DAS ÓRBITAS CONCÊNTRICAS */}
      <Animated.View style={[styles.contentCenter, { opacity: entradaOpacidade }]}>

        {/* Órbita Externa (Grande) */}
        <View style={[styles.orbitaRing, styles.orbitaRingGrande]} />

        {/* Órbita Média com satélite LED pulsante */}
        <View style={[styles.orbitaRing, styles.orbitaRingMedia]}>
          <Animated.View style={[styles.sateliteLed, { opacity: opacidadeLed }]} />
        </View>

        {/* Órbita Interna (Pequena) */}
        <View style={[styles.orbitaRing, styles.orbitaRingPequena]} />

        {/* TEXTOS CENTRALIZADOS */}
        <View style={styles.textsContainer}>
          <Text style={styles.mainTitle}>BTG - TERRA</Text>
          <Text style={styles.subTitle}>INDIGO SOVEREIGN INTERFACE</Text>
        </View>

      </Animated.View>

      {/* RODAPÉ: TELEMETRIA E BOTÃO DE INICIALIZAÇÃO */}
      <Animated.View style={[styles.footerContainer, { opacity: entradaOpacidade }]}>

        <View style={styles.statusRow}>
          <Ionicons name="wifi-sharp" size={14} color={COLORS.accent} style={styles.statusIcon} />
          <Text style={styles.statusText}>DTN Link: Active</Text>
        </View>

        <Text style={styles.syncText}>Relativity Sync: Nom</Text>

        {/* Botão principal de conexão em tom lilás */}
        <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={iniciarConexao}>
          <Animated.View style={[styles.conectarBtn, { transform: [{ scale: escalaBotao }] }]}>
            <View style={styles.btnRow}>
              <Text style={styles.conectarBtnText}>INICIAR CONEXÃO</Text>
              <Ionicons name="arrow-forward" size={14} color="#000000" style={styles.btnArrow} />
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>

      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  glowSpotTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -100,
    left: -50,
    backgroundColor: 'rgba(0, 133, 255, 0.08)',
  },
  glowSpotBottom: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: -100,
    right: -50,
    backgroundColor: 'rgba(0, 133, 255, 0.08)',
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
  },
  orbitaRing: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(0, 133, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbitaRingGrande: { width: 340, height: 340 },
  orbitaRingMedia: { width: 270, height: 270 },
  orbitaRingPequena: { width: 200, height: 200 },
  sateliteLed: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.cyan,
    top: 40,
    right: 40,
    shadowColor: COLORS.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  textsContainer: { alignItems: 'center', zIndex: 10 },
  mainTitle: {
    fontSize: 26,
    fontFamily: 'Syne-Bold',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 8,
    fontWeight: '700',
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 10,
    fontFamily: 'Syne-Bold',
    color: COLORS.purple,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  footerContainer: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
    zIndex: 10,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  statusIcon: { marginRight: 6 },
  statusText: {
    fontSize: 12,
    fontFamily: 'Syne-Bold',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  syncText: {
    fontSize: 10,
    fontFamily: 'Syne-Bold',
    color: COLORS.purple,
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  conectarBtn: {
    backgroundColor: '#B8A3FF',
    width: '100%',
    borderRadius: 30,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B8A3FF',
    shadowColor: '#B8A3FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  btnRow: { flexDirection: 'row', alignItems: 'center' },
  conectarBtnText: {
    color: '#000000',
    fontFamily: 'Syne-Bold',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  btnArrow: { marginLeft: 8 },
});

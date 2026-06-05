// ==========================================================================================
// TELA DO AUDITOR DE TEMPO RELATIVÍSTICO - TEMA VOID PROTOCOL (CHRONOS DTN MOBILE)
// CARDS SÓLIDOS + GRADIENTE GALÁXIA NOS RELÓGIOS + ESTRELAS CINTILANTES ANIMADAS
// ==========================================================================================

// Importa hooks de tempo, referências e atualizações do React Core.
import React, { useState, useEffect, useRef } from 'react';
// Importa componentes visuais e de animação do React Native.
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Animated } from 'react-native';
// Importa o conjunto de ícones vetoriais da Expo para sinalizações visuais.
import { Ionicons } from '@expo/vector-icons';
// Importa as constantes de cores da paleta Void Protocol.
import { COLORS } from '../../constants/Colors';
// Importa o componente oficial de gradiente linear do Expo.
import { LinearGradient } from 'expo-linear-gradient';

// Dias da semana abreviados começando em Segunda-feira.
const DIAS_SEMANA = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'];

// Configuração das estrelas cintilantes para os cards de relógio.
// Cada estrela tem posição, opacidade base e duração de pulso única para cintilação natural.
const ESTRELAS_CONFIG = [
  { top: 8,  left: 20,  opacity: 0.9, size: 2, duracao: 2200 },
  { top: 18, left: 90,  opacity: 0.6, size: 1, duracao: 3100 },
  { top: 30, left: 160, opacity: 0.8, size: 2, duracao: 1800 },
  { top: 12, left: 230, opacity: 0.5, size: 1, duracao: 2700 },
  { top: 45, left: 50,  opacity: 0.7, size: 2, duracao: 3400 },
  { top: 38, left: 130, opacity: 0.4, size: 1, duracao: 2000 },
  { top: 55, left: 200, opacity: 0.9, size: 2, duracao: 1600 },
  { top: 22, left: 290, opacity: 0.6, size: 1, duracao: 2900 },
  { top: 48, left: 310, opacity: 0.8, size: 2, duracao: 2400 },
  { top: 10, left: 340, opacity: 0.5, size: 1, duracao: 3200 },
];

// Componente de estrela cintilante individual com animação independente.
function EstrelaCintilante({ top, left, opacity, size, duracao }: {
  top: number; left: number; opacity: number; size: number; duracao: number;
}) {
  // Valor animado para o fade in/out da estrela.
  const brilho = useRef(new Animated.Value(opacity * 0.3)).current;

  // Inicia o loop de cintilação na montagem com delay aleatório para dessincronizar.
  useEffect(() => {
    // Delay aleatório para que cada estrela comece em um fase diferente do ciclo.
    const delayInicial = Math.random() * duracao;
    const timeout = setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(brilho, { toValue: opacity, duration: duracao / 2, useNativeDriver: true }),
          Animated.timing(brilho, { toValue: opacity * 0.15, duration: duracao / 2, useNativeDriver: true }),
        ])
      ).start();
    }, delayInicial);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFFFFF',
        opacity: brilho,
      }}
    />
  );
}

// Componente principal correspondente à tela do Auditor de Tempo.
export default function AuditorScreen() {
  // Estado local para controle do delay de carga do canal cislunar (1.28s).
  const [carregando, setCarregando] = useState(true);
  // Estado para armazenar o tempo da Terra em milissegundos.
  const [timestampTerra, setTimestampTerra] = useState(Date.now());

  // Valor de animação para pulsar a cor da borda neon das opções (futurista).
  const pulsarBorda = useRef(new Animated.Value(0)).current;

  // Taxa de drift relativístico gravitacional diário na Lua (~56 microssegundos por dia).
  const DRIFT_DIARIO_MICROSSEGUNDOS = 56.000000;
  // Época atômica de sincronização dos relógios em órbita (01 de Janeiro de 2026).
  const EPOCH_REFERENCIA_MS = new Date('2026-01-01T00:00:00Z').getTime();

  // Calcula o índice do dia atual (0=SEG ... 6=DOM), ajustando domingo do JS (0) para o fim.
  const diaAtualIndex = (new Date().getDay() + 6) % 7;

  // Efeito disparado na montagem da tela para simular a latência física do sinal.
  useEffect(() => {
    const timer = setTimeout(() => {
      setCarregando(false);
    }, 1280);
    return () => clearTimeout(timer);
  }, []);

  // Efeito para pulsar continuamente o brilho das bordas neon (design futurista).
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulsarBorda, { toValue: 1, duration: 1800, useNativeDriver: false }),
        Animated.timing(pulsarBorda, { toValue: 0, duration: 1800, useNativeDriver: false })
      ])
    ).start();
  }, []);

  // Interpola o valor de pulsarBorda para criar a transição de cores da borda neon.
  const corBordaNeon = pulsarBorda.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 133, 255, 0.2)', 'rgba(0, 212, 255, 0.55)']
  });

  // Efeito de contagem periódica rápida do relógio a cada 50ms.
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setTimestampTerra(Date.now());
    }, 50);
    return () => clearInterval(clockTimer);
  }, []);

  // Calcula a quantidade de tempo decorrido em milissegundos desde a sincronização original.
  const milissegundosDecorridos = Math.max(0, timestampTerra - EPOCH_REFERENCIA_MS);
  // Converte a diferença em dias terrestres decimais.
  const diasDecorridos = milissegundosDecorridos / (1000 * 60 * 60 * 24);
  // Calcula o drift acumulado em microssegundos.
  const driftTotalMicrossegundos = diasDecorridos * DRIFT_DIARIO_MICROSSEGUNDOS;
  // Converte o drift total em milissegundos decimais para correção de relógio.
  const driftTotalMilissegundos = driftTotalMicrossegundos / 1000;

  // Calcula a hora na Lua com a aceleração gravitacional correspondente.
  const timestampLua = timestampTerra + driftTotalMilissegundos;

  // Formata o timestamp de entrada para exibição textual formatada em padrão ISO 8601.
  const formatarHora = (timestamp: number) => {
    return new Date(timestamp).toISOString();
  };

  // Se a tela estiver carregando, exibe o loading.
  if (carregando) {
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.textoLoading}>Sincronizando relógios orbitais atômicos...</Text>
      </View>
    );
  }

  // Renderiza a interface final do auditor.
  return (
    <View style={styles.containerPrincipal}>

      {/* PONTOS DE BRILHO NEON DE FUNDO — mesma profundidade do Home Screen */}
      <View style={styles.glowSpotSilver1} />
      <View style={styles.glowSpotSilver2} />
      <View style={styles.glowSpotSilver3} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>

        {/* Título de cabeçalho centralizado utilizando fonte Syne. */}
        <Text style={styles.screenTitle}>AUDITOR</Text>

        {/* ==================================================================================
            BARRA DE DIAS DA SEMANA — o operador sabe o dia mesmo no espaço
            ================================================================================== */}
        <View style={styles.weekdayBar}>
          {DIAS_SEMANA.map((dia, index) => {
            const isAtivo = index === diaAtualIndex;
            return (
              <View key={dia} style={[styles.weekdayItem, isAtivo && styles.weekdayItemAtivo]}>
                <Text style={[styles.weekdayText, isAtivo && styles.weekdayTextAtivo]}>
                  {dia}
                </Text>
                {isAtivo && <View style={styles.weekdayDot} />}
              </View>
            );
          })}
        </View>

        {/* ==================================================================================
            CARD SÓLIDO: RELATÓRIO DE DESVIO (CÍRCULO ESQUERDO + MÉTRICAS DIREITA)
            ================================================================================== */}
        <Animated.View style={[styles.cardMétricas, { borderColor: corBordaNeon }]}>
          {/* Fundo sólido escuro #121926 — sem glassmorphic */}
          <View style={styles.cardSolidoInternal}>
            {/* Título interno do relatório */}
            <Text style={styles.cardTitle}>RELATÓRIO DE DESVIO</Text>

            {/* Layout em linha: círculo menor à esquerda + métricas à direita */}
            <View style={styles.rowCirculoMetricas}>

              {/* Coluna Esquerda: Círculo central compacto (~130px) */}
              <Animated.View style={[styles.esferaCircularMétrica, { borderColor: corBordaNeon }]}>
                <LinearGradient
                  colors={['rgba(18, 25, 38, 0.95)', 'rgba(0, 133, 255, 0.12)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.esferaCircularGradiente}
                >
                  <Ionicons name="infinite" size={20} color={COLORS.accent} style={styles.iconEsfera} />
                  <Text style={styles.valorPrincipalCircular}>
                    -{driftTotalMilissegundos.toFixed(4)} ms
                  </Text>
                  <Text style={styles.labelPrincipalCircular}>LUA ➔ TERRA</Text>
                </LinearGradient>
              </Animated.View>

              {/* Separador vertical sutil */}
              <View style={styles.separadorVertical} />

              {/* Coluna Direita: ÉPOCA / DRIFT / TAXA empilhados */}
              <View style={styles.colunaMetricasDir}>

                <View style={styles.metricaItem}>
                  <Text style={styles.metricaValor}>{diasDecorridos.toFixed(1)}d</Text>
                  <Text style={styles.metricaLabel}>ÉPOCA</Text>
                </View>

                <View style={styles.metricaDivider} />

                <View style={styles.metricaItem}>
                  <Text style={[styles.metricaValor, { color: COLORS.gold }]}>
                    +{driftTotalMicrossegundos.toFixed(0)}μs
                  </Text>
                  <Text style={styles.metricaLabel}>DRIFT</Text>
                </View>

                <View style={styles.metricaDivider} />

                <View style={styles.metricaItem}>
                  <Text style={[styles.metricaValor, { color: COLORS.cyan }]}>56μs/d</Text>
                  <Text style={styles.metricaLabel}>TAXA</Text>
                </View>

              </View>
            </View>
          </View>
        </Animated.View>

        {/* ==================================================================================
            CARD GALÁXIA: RELÓGIO TERRESTRE (UTC) — GRADIENTE + ESTRELAS CINTILANTES
            ================================================================================== */}
        <Animated.View style={[styles.cardRelogio, { borderColor: corBordaNeon }]}>
          <LinearGradient
            colors={['#0D1B2A', '#131a2e', '#0a1628']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGalaxiaInternal}
          >
            {/* Estrelas cintilantes animadas individualmente */}
            {ESTRELAS_CONFIG.map((estrela, i) => (
              <EstrelaCintilante key={`terra-${i}`} {...estrela} />
            ))}

            <View style={styles.relogioHeaderRow}>
              <View style={[styles.relogioLed, { backgroundColor: COLORS.accent }]} />
              <Text style={styles.labelRelogio}>RELÓGIO TERRESTRE (UTC)</Text>
            </View>
            <Text style={styles.valorRelogio}>{formatarHora(timestampTerra)}</Text>
          </LinearGradient>
        </Animated.View>

        {/* ==================================================================================
            CARD GALÁXIA: RELÓGIO LUNAR (LOCAL) — GRADIENTE + ESTRELAS CINTILANTES
            ================================================================================== */}
        <Animated.View style={[styles.cardRelogio, { borderColor: corBordaNeon }]}>
          <LinearGradient
            colors={['#0D1B2A', '#16162e', '#0a1020']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.cardGalaxiaInternal}
          >
            {/* Estrelas cintilantes animadas individualmente (conjunto ligeiramente diferente) */}
            {ESTRELAS_CONFIG.map((estrela, i) => (
              <EstrelaCintilante
                key={`lua-${i}`}
                top={estrela.top}
                left={estrela.left + 10}
                opacity={estrela.opacity}
                size={estrela.size}
                duracao={estrela.duracao + 300}
              />
            ))}

            <View style={styles.relogioHeaderRow}>
              <View style={[styles.relogioLed, { backgroundColor: COLORS.gold }]} />
              <Text style={[styles.labelRelogio, { color: COLORS.gold }]}>RELÓGIO LUNAR (LOCAL)</Text>
            </View>
            <Text style={styles.valorRelogio}>{formatarHora(timestampLua)}</Text>
          </LinearGradient>
        </Animated.View>

        {/* ==================================================================================
            CARD SÓLIDO: SINAIS DE TEMPO CISLUNAR
            ================================================================================== */}
        <Animated.View style={[styles.cardAviso, { borderColor: corBordaNeon }]}>
          <View style={styles.cardSolidoInternal}>
            <View style={styles.relogioHeaderRow}>
              <View style={[styles.relogioLed, { backgroundColor: COLORS.cyan }]} />
              <Text style={styles.tituloAviso}>SINAIS DE TEMPO CISLUNAR</Text>
            </View>
            <Text style={styles.textoAviso}>
              A dilatação temporal gravitacional faz com que os relógios na Lua corram mais rápido em relação à Terra.
              O gateway financeiro aplica a correção PL/SQL a fim de reconciliar os ledgers.
            </Text>
          </View>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

// Estilos de visualização.
const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  glowSpotSilver1: {
    position: 'absolute',
    width: 380,
    height: 380,
    borderRadius: 190,
    top: -40,
    left: -120,
    backgroundColor: 'rgba(0, 133, 255, 0.13)',
  },
  glowSpotSilver2: {
    position: 'absolute',
    width: 420,
    height: 420,
    borderRadius: 210,
    top: 300,
    right: -160,
    backgroundColor: 'rgba(0, 133, 255, 0.10)',
  },
  glowSpotSilver3: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    bottom: 60,
    left: -60,
    backgroundColor: 'rgba(184, 163, 255, 0.07)',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 90,
  },
  containerCentro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  textoLoading: {
    color: COLORS.textSecondary,
    fontFamily: 'Syne-Bold',
    marginTop: 15,
    fontSize: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: 'Syne-Bold',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    marginBottom: 16,
    letterSpacing: 1.5,
    textAlign: 'center',
  },

  // ==================================================================================
  // ESTILOS: BARRA DE DIAS DA SEMANA
  // ==================================================================================
  weekdayBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#121926',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 133, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 16,
  },
  weekdayItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    borderRadius: 8,
  },
  weekdayItemAtivo: {
    backgroundColor: 'rgba(0, 133, 255, 0.15)',
  },
  weekdayText: {
    fontFamily: 'Syne-Bold',
    fontSize: 9,
    color: COLORS.purple,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  weekdayTextAtivo: {
    color: COLORS.accent,
  },
  weekdayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.accent,
    marginTop: 4,
  },

  // ==================================================================================
  // ESTILOS: CARD SÓLIDO (SEM GLASSMORPHIC)
  // ==================================================================================
  cardMétricas: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  // Fundo sólido escuro — substitui o glassmorphic translúcido.
  cardSolidoInternal: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#121926',
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: 'Syne-Bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 16,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  rowCirculoMetricas: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  esferaCircularMétrica: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2,
    overflow: 'hidden',
    shadowColor: '#0085FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    flexShrink: 0,
  },
  esferaCircularGradiente: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  iconEsfera: {
    marginBottom: 6,
  },
  valorPrincipalCircular: {
    fontSize: 12,
    fontFamily: 'Syne-Bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    fontWeight: '700',
  },
  labelPrincipalCircular: {
    fontSize: 7,
    fontFamily: 'Syne-Bold',
    color: COLORS.purple,
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  separadorVertical: {
    width: 1,
    height: 100,
    backgroundColor: 'rgba(0, 133, 255, 0.15)',
  },
  colunaMetricasDir: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 4,
  },
  metricaItem: {
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  metricaValor: {
    fontSize: 15,
    fontFamily: 'Syne-Bold',
    color: COLORS.textPrimary,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  metricaLabel: {
    fontSize: 8,
    fontFamily: 'Syne-Bold',
    color: COLORS.purple,
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  metricaDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 133, 255, 0.1)',
    width: '100%',
  },

  // ==================================================================================
  // ESTILOS: CARDS DE RELÓGIO (GALÁXIA) E AVISO (SÓLIDO)
  // ==================================================================================
  cardAviso: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tituloAviso: {
    fontSize: 10,
    fontFamily: 'Syne-Bold',
    color: COLORS.accent,
    letterSpacing: 1,
  },
  textoAviso: {
    fontSize: 12,
    fontFamily: 'Syne-Bold',
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 10,
  },
  cardRelogio: {
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#0085FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  // Fundo gradiente galáxia sólido (não translúcido) para os cards de relógio.
  cardGalaxiaInternal: {
    flex: 1,
    padding: 20,
    borderRadius: 14,
    minHeight: 80,
    position: 'relative',
    overflow: 'hidden',
  },
  relogioHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  relogioLed: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  labelRelogio: {
    fontSize: 10,
    fontFamily: 'Syne-Bold',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  valorRelogio: {
    fontSize: 13,
    fontFamily: 'Syne-Bold',
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },
});

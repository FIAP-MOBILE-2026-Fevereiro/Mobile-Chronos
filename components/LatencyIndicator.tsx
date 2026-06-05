// ==========================================================================================
// COMPONENTE MODULAR: LATENCY INDICATOR (CHRONOS DTN MOBILE)
// EXIBE DADOS DE CONECTIVIDADE CISLUNAR EM TONS VOID PROTOCOL E FONTES GOOGLE
// ==========================================================================================

// Importa a biblioteca do React.
import React from 'react';
// Importa componentes visuais do React Native.
import { StyleSheet, Text, View } from 'react-native';
// Importa as constantes de cores da paleta Void Protocol.
import { COLORS } from '../constants/Colors';

// Interface de tipagem das propriedades recebidas pelo indicador.
interface LatencyIndicatorProps {
  // Latência medida em segundos.
  latencySeconds: number;
  // Desvio de tempo (Jitter) em segundos.
  jitterSeconds: number;
  // Porcentagem de preenchimento da barra de progresso.
  fillPercentage: number;
}

// Componente funcional de latência premium adaptado para a paleta cósmica.
export default function LatencyIndicator({ latencySeconds, jitterSeconds, fillPercentage }: LatencyIndicatorProps) {
  // Retorna a estrutura visual da barra.
  return (
    // Card com vidro branco translúcido e bordas arredondadas macias de 12px.
    <View style={styles.card}>
      {/* Título superior do card em caixa alta e espaçado. */}
      <Text style={styles.cardTitle}>LATÊNCIA DE REDE</Text>
      
      {/* Label de contexto da medição física espacial. */}
      <Text style={styles.metricLabel}>ATUAL (TERRA-LUA)</Text>
      
      {/* Valor principal em destaque em ciano espacial para latência. */}
      <Text style={styles.largeMetricValue}>{latencySeconds.toFixed(2)} SECONDS</Text>
      
      {/* Barra de carregamento de sinal cislunar. */}
      <View style={styles.latencyBarContainer}>
        {/* Preenchimento ativo em ciano. */}
        <View style={[styles.latencyBarFill, { width: `${fillPercentage}%` }]} />
      </View>
      
      {/* Fila de LEDs de telemetria espacial (cislunar status lights). */}
      <View style={styles.ledRow}>
        {/* LED 1: Status de link físico estabelecido (Estável - Ciano). */}
        <View style={styles.ledGroup}>
          {/* LED ciano brilhante representando estabilidade. */}
          <View style={[styles.ledIndicator, styles.ledCyan]} />
          <Text style={styles.ledLabel}>LINK ESTÁVEL</Text>
        </View>
        {/* LED 2: Status de tráfego ativo (Transmissão - Violeta). */}
        <View style={styles.ledGroup}>
          {/* LED violeta/orquídea representando tráfego ativo. */}
          <View style={[styles.ledIndicator, styles.ledViolet]} />
          <Text style={styles.ledLabel}>FLOW ATIVO</Text>
        </View>
        {/* LED 3: Status da fila DTN do buffer (Alerta - Ouro). */}
        <View style={styles.ledGroup}>
          {/* LED ouro cósmico representando acúmulo em buffer. */}
          <View style={[styles.ledIndicator, styles.ledGold]} />
          <Text style={styles.ledLabel}>DTN BUFFER</Text>
        </View>
      </View>

      {/* Linha informativa contendo o jitter de sinal. */}
      <View style={styles.statusRow}>
        {/* Label descritivo do jitter técnico. */}
        <Text style={styles.statusLabel}>JITTER DE TRANSMISSÃO</Text>
        {/* Valor nominal do jitter em branco. */}
        <Text style={styles.statusValue}>±{jitterSeconds.toFixed(2)}s</Text>
      </View>
    </View>
  ); // Fim da renderização.
} // Fim do componente LatencyIndicator.

// Definição de estilos estáticos seguindo o design system.
const styles = StyleSheet.create({
  card: {
    // Fundo de vidro acrílico escuro com transparência.
    backgroundColor: COLORS.glassSurface,
    // Cantos arredondados de 12px conforme o padrão estético.
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: 'DMSans-Bold',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 16,
    letterSpacing: 2,
  },
  metricLabel: {
    fontSize: 11,
    fontFamily: 'DMSans-Medium',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  // Métrica grande colorida em ciano com fonte Syne.
  largeMetricValue: {
    fontSize: 34,
    fontFamily: 'Syne-Bold',
    color: COLORS.cyan,
    textAlign: 'center',
    marginVertical: 8,
  },
  latencyBarContainer: {
    height: 8,
    backgroundColor: '#0a0a0c', // Fundo escuro do trilho.
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  latencyBarFill: {
    height: '100%',
    backgroundColor: COLORS.cyan, // Ciano espacial.
    borderRadius: 4,
  },
  ledRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  ledGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ledIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
    // Cria efeito de brilho suave.
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  // LED ciano para link ativo e latências estáveis.
  ledCyan: {
    backgroundColor: COLORS.cyan,
    shadowColor: COLORS.cyan,
  },
  // LED violeta orquídea para tráfego/flow de pacotes ativo.
  ledViolet: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
  },
  // LED ouro cósmico para indicar buffer ou alertas de buffer pendentes.
  ledGold: {
    backgroundColor: COLORS.gold,
    shadowColor: COLORS.gold,
  },
  ledLabel: {
    fontSize: 8,
    fontFamily: 'DMSans-Bold',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  statusLabel: {
    fontSize: 11,
    fontFamily: 'DMSans-Regular',
    color: COLORS.textSecondary,
  },
  statusValue: {
    fontSize: 13,
    fontFamily: 'DMSans-Bold',
    color: COLORS.textPrimary,
  },
});

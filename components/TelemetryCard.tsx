// ==========================================================================================
// COMPONENTE MODULAR: TELEMETRY CARD - GLASSMORPHISM (CHRONOS DTN MOBILE)
// EXIBE DADOS DE TELEMETRIA CISLUNAR INTEGRADOS A UM GRÁFICO DE ONDA COM FONTES GOOGLE
// ==========================================================================================

// Importa a biblioteca do React.
import React from 'react';
// Importa componentes visuais nativos do React Native.
import { StyleSheet, Text, View } from 'react-native';
// Importa as constantes de cores da paleta Void Protocol.
import { COLORS } from '../constants/Colors';

// Interface de tipagem das propriedades recebidas pelo TelemetryCard.
interface TelemetryCardProps {
  // Título do cabeçalho do card em caixa alta (ex: "TRANSMISSÃO").
  title: string;
  // Rótulo descritivo da métrica.
  label: string;
  // Valor de destaque numérico ou textual.
  value: string | number;
  // Unidade de medida opcional (ex: "Kbps").
  unit?: string;
  // Se está em estado de alerta.
  isAlert?: boolean;
}

// Mock de alturas de barras para desenhar o gráfico de linha de onda em tempo real.
const MOCK_WAVE_ALTURAS = [15, 30, 24, 45, 35, 55, 42, 60, 38, 50, 48, 65, 30, 42, 25];

// Componente funcional de telemetria premium minimalista.
export default function TelemetryCard({ title, label, value, unit, isAlert }: TelemetryCardProps) {
  // Retorna a estrutura visual do card redesenhado.
  return (
    // Card com vidro branco translúcido e bordas arredondadas macias de 12px.
    <View style={styles.card}>
      {/* Título de cabeçalho superior discreto em caixa alta. */}
      <Text style={styles.cardTitle}>{title}</Text>
      
      {/* Container de distribuição das métricas. */}
      <View style={styles.metricRow}>
        <View>
          {/* Nome da métrica descritiva. */}
          <Text style={styles.metricLabel}>{label}</Text>
          {/* Exibe a unidade abaixo da label principal. */}
          {unit && <Text style={styles.metricSubLabel}>({unit})</Text>}
        </View>
        
        {/* Exibe o valor de destaque com a fonte Syne Bold. */}
        <Text style={[styles.largeMetricValue, { color: isAlert ? COLORS.alert : COLORS.accent }]}>
          {value}
        </Text>
      </View>

      {/* Roda o gráfico de ondas real-time simulado usando Views puras. */}
      <View style={styles.chartContainer}>
        {/* Mapeia a lista de alturas criando barras que simulam uma onda contínua de tráfego. */}
        {MOCK_WAVE_ALTURAS.map((altura, index) => (
          <View 
            key={index} 
            style={[
              styles.chartBar, 
              { 
                height: altura, 
                // Colore com a cor de destaque correspondente à métrica.
                backgroundColor: isAlert ? COLORS.alert : COLORS.accent,
                // Aplica opacidade gradativa para criar efeito de rastro de fade out.
                opacity: 0.2 + (index / MOCK_WAVE_ALTURAS.length) * 0.8 
              }
            ]} 
          />
        ))}
      </View>
    </View>
  ); // Fim da renderização.
} // Fim do componente TelemetryCard.

// Definição de estilos seguindo as diretrizes de design.
const styles = StyleSheet.create({
  card: {
    // Fundo de vidro escuro.
    backgroundColor: COLORS.glassSurface,
    // Cantos arredondados de 12px conforme o padrão estético.
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    // Borda fina translúcida.
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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'DMSans-Bold',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  metricSubLabel: {
    fontSize: 10,
    fontFamily: 'DMSans-Regular',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  largeMetricValue: {
    fontSize: 34,
    fontFamily: 'Syne-Bold',
    letterSpacing: -0.5,
  },
  chartContainer: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: COLORS.surface, // Fundo cinza escuro uniforme.
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chartBar: {
    width: 6,
    borderRadius: 3,
  },
});

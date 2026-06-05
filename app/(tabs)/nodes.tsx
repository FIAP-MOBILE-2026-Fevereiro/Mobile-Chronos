// ==========================================================================================
// TELA DE GERENCIADOR DE NÓS - TEMA VOID PROTOCOL (CHRONOS DTN MOBILE)
// LISTAGEM E GERENCIAMENTO DE SATÉLITES E GATEWAYS CISLUNARES
// ==========================================================================================

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

// Interface de tipagem estrutural representando um Nó de retransmissão DTN.
interface NoRede {
  id: number;
  name: string;
  location: string;
  bufferedPackets: number;
}

// Componente principal da tela de Gerenciamento de Nós.
export default function NodesScreen() {
  // Estado local para a lista de nós ativos.
  const [nos, setNos] = useState<NoRede[]>([]);
  // Estado para controle do carregamento inicial (skeleton screen 1.28s).
  const [carregando, setCarregando] = useState(true);

  // Efeito disparado na montagem da tela para buscar nós da API.
  useEffect(() => {
    carregarNos();
  }, []);

  // Carrega a lista de nós — dados iniciais mockados (integração real na próxima etapa).
  const carregarNos = async () => {
    try {
      setCarregando(true);
      // Dados mockados representando a estrutura esperada da API.
      const dadosMockados: NoRede[] = [
        { id: 1, name: 'Terrestrial-Gateway-01', location: 'EARTH_KSC', bufferedPackets: 0 },
        { id: 2, name: 'Lunar-Gateway-Alpha', location: 'LUNAR_SOUTH_POLE', bufferedPackets: 0 },
        { id: 3, name: 'Lunar-Gateway-Beta', location: 'LUNAR_EQUATOR', bufferedPackets: 15 },
        { id: 4, name: 'Lunar-Orbiter-Satt-1', location: 'LUNAR_ORBIT', bufferedPackets: 0 },
      ];
      setNos(dadosMockados);
    } catch (erro) {
      Alert.alert('Erro de Conexão', 'Não foi possível carregar a lista de nós cislunares.');
    } finally {
      setCarregando(false);
    }
  };

  // Remove um nó localmente (remoção real via API será implementada na próxima etapa).
  const excluirNo = async (id: number) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja desativar o nó #${id}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setNos((prev) => prev.filter((n) => n.id !== id));
            Alert.alert('Nó Desativado', `Nó #${id} removido com sucesso.`);
          },
        },
      ]
    );
  };

  // Exibe skeleton screen durante carregamento.
  if (carregando) {
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.textoLoading}>Consultando satélites retransmissores (1.28s)...</Text>
        <View style={styles.skeletonCard} />
        <View style={styles.skeletonCard} />
      </View>
    );
  }

  return (
    <View style={styles.containerPrincipal}>
      <View style={styles.glowSpotSilver1} />
      <View style={styles.glowSpotSilver2} />

      <View style={styles.containerLayout}>
        <View style={styles.rowTituloTela}>
          <Ionicons name="git-network-outline" size={24} color={COLORS.textPrimary} style={styles.iconTitulo} />
          <Text style={styles.screenTitle}>GERENCIADOR DE NÓS</Text>
        </View>

        <Text style={styles.textoSubtitulo}>
          Administração de satélites e gateways interplanetários da rede cislunar DTN.
        </Text>

        <FlatList
          data={nos}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listaPadding}
          renderItem={({ item }) => (
            <View style={styles.cardNo}>
              <View style={styles.infoCol}>
                <View style={styles.rowNome}>
                  <View
                    style={[
                      styles.ledStatus,
                      {
                        backgroundColor: item.bufferedPackets > 0 ? COLORS.gold : COLORS.cyan,
                        shadowColor: item.bufferedPackets > 0 ? COLORS.gold : COLORS.cyan,
                      },
                    ]}
                  />
                  <Text style={styles.nomeNo}>{item.name}</Text>
                </View>
                <Text style={styles.locNo}>Localização: {item.location}</Text>
                <Text style={item.bufferedPackets > 0 ? styles.bufferAlerta : styles.bufferEstavel}>
                  Buffer: {item.bufferedPackets} transações retidas
                </Text>
              </View>

              <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirNo(item.id)}>
                <View style={styles.rowBotaoConteudo}>
                  <Ionicons name="trash-outline" size={12} color="#000000" style={styles.iconBotao} />
                  <Text style={styles.textoBotaoExcluir}>EXCLUIR</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  glowSpotSilver1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    top: 50,
    left: -80,
    backgroundColor: COLORS.glowPurple,
  },
  glowSpotSilver2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: 250,
    right: -100,
    backgroundColor: COLORS.glowPurple,
  },
  containerLayout: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  rowTituloTela: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconTitulo: { marginRight: 10 },
  containerCentro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  textoLoading: {
    color: COLORS.textSecondary,
    fontFamily: 'DMSans-Regular',
    marginTop: 15,
    fontSize: 12,
  },
  skeletonCard: {
    width: '100%',
    height: 90,
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 10,
  },
  screenTitle: {
    fontSize: 24,
    fontFamily: 'Syne-Bold',
    color: COLORS.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  textoSubtitulo: {
    color: COLORS.textSecondary,
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    marginBottom: 20,
    lineHeight: 18,
  },
  listaPadding: { paddingBottom: 90 },
  cardNo: {
    backgroundColor: COLORS.glassSurface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  infoCol: { flex: 1, paddingRight: 10 },
  rowNome: { flexDirection: 'row', alignItems: 'center' },
  ledStatus: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  nomeNo: { color: COLORS.textPrimary, fontFamily: 'DMSans-Bold', fontSize: 14 },
  locNo: { color: COLORS.textSecondary, fontFamily: 'DMSans-Regular', fontSize: 11, marginTop: 4 },
  bufferEstavel: { color: COLORS.cyan, fontSize: 11, fontFamily: 'DMSans-Bold', marginTop: 6 },
  bufferAlerta: { color: COLORS.gold, fontSize: 11, fontFamily: 'DMSans-Bold', marginTop: 6 },
  botaoExcluir: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  rowBotaoConteudo: { flexDirection: 'row', alignItems: 'center' },
  iconBotao: { marginRight: 4 },
  textoBotaoExcluir: { color: '#000000', fontSize: 10, fontFamily: 'DMSans-Bold', letterSpacing: 1 },
});

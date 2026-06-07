// ==========================================================================================
// TELA DE PERFIL E CONFIGURAÇÕES - TEMA VOID PROTOCOL (CHRONOS DTN MOBILE)
// GERENCIAMENTO DE CREDENCIAIS JWT, IP DO GATEWAY E SELETOR DE API (JAVA / .NET)
// PERSISTÊNCIA VIA ASYNC STORAGE — IP E BACKEND SOBREVIVEM AO REINÍCIO DO APP
// ==========================================================================================

import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TextInput,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import {
  salvarIpGateway,
  salvarBackend,
  carregarConfiguracoes,
} from '../../services/configService';
import { updateAxiosConfig, getIpAtual, getBackendAtual } from '../../services/axiosService';

// Tipo do seletor de backend.
type ApiBackend = 'java' | 'dotnet';

// Componente principal da tela de Perfil e Configurações.
export default function ProfileScreen() {
  const [carregando, setCarregando] = useState(true);
  // IP do gateway — carregado do AsyncStorage na montagem da tela.
  const [ipGateway, setIpGateway] = useState(getIpAtual());
  // Token JWT do operador.
  const [tokenJwt, setTokenJwt] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
  // Identificador do operador.
  const [operador] = useState('lunar-operator-01');
  // Backend selecionado — carregado do AsyncStorage na montagem da tela.
  const [backendAtivo, setBackendAtivo] = useState<ApiBackend>(getBackendAtual());
  // Flag de salvamento ativo.
  const [salvando, setSalvando] = useState(false);

  // Carrega as configurações persistidas ao montar a tela.
  useEffect(() => {
    const inicializar = async () => {
      try {
        const config = await carregarConfiguracoes();
        // Sincroniza o estado local com o que está salvo no dispositivo.
        setIpGateway(config.ip);
        setBackendAtivo(config.backend);
        // Garante que o Axios já começa com as configurações corretas.
        updateAxiosConfig(config.ip, config.backend);
      } catch (erro) {
        console.error('[PROFILE] Erro ao carregar configurações:', erro);
      } finally {
        setCarregando(false);
      }
    };
    inicializar();
  }, []);

  // Persiste as configurações no AsyncStorage E atualiza as instâncias Axios em runtime.
  const gravarDefinicoes = async () => {
    if (!ipGateway.trim()) {
      Alert.alert('Campo obrigatório', 'O endereço IP do gateway não pode estar vazio.');
      return;
    }
    try {
      setSalvando(true);

      // 1. Persiste no AsyncStorage (sobrevive ao fechar o app).
      await Promise.all([
        salvarIpGateway(ipGateway),
        salvarBackend(backendAtivo),
      ]);

      // 2. Atualiza as instâncias Axios em runtime (efeito imediato, sem reiniciar o app).
      updateAxiosConfig(ipGateway, backendAtivo);

      const porta = backendAtivo === 'java' ? '8080' : '5000';
      Alert.alert(
        '✅ Configurações Aplicadas',
        `API ativa: ${backendAtivo === 'java' ? 'Java Spring Boot' : '.NET ASP.NET Core'}\n` +
        `Endereço: http://${ipGateway}:${porta}/api\n\n` +
        'Todas as requisições agora usam estas configurações.',
        [{ text: 'OK' }]
      );
    } catch (erro) {
      Alert.alert('Erro', 'Não foi possível salvar as configurações. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <View style={styles.containerCentro}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={styles.textoLoading}>Carregando configurações salvas...</Text>
      </View>
    );
  }

  const portaAtiva = backendAtivo === 'java' ? '8080' : '5000';

  return (
    <View style={styles.containerPrincipal}>
      <View style={styles.glowSpotSilver1} />
      <View style={styles.glowSpotSilver2} />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>CONFIGURAÇÕES</Text>

        {/* Card de identificação do operador */}
        <View style={styles.cardOperador}>
          <View style={styles.rowHeaderCard}>
            <Ionicons name="person-outline" size={12} color={COLORS.textSecondary} style={styles.iconEspacado} />
            <Text style={styles.tituloOperador}>OPERADOR AUTENTICADO</Text>
          </View>
          <Text style={styles.valorUsuario}>{operador}</Text>
          <Text style={styles.nivelAcesso}>Nível de Acesso: Admin Cislunar</Text>
        </View>

        {/* Seletor de API: Java vs .NET — agora conectado ao Axios */}
        <View style={styles.cardConfig}>
          <View style={styles.rowHeaderCardDivider}>
            <Ionicons name="server-outline" size={12} color={COLORS.textSecondary} style={styles.iconEspacado} />
            <Text style={styles.tituloCard}>SELETOR DE BACKEND</Text>
          </View>
          <Text style={styles.labelInput}>API ativa para operações CRUD:</Text>
          <View style={styles.rowSeletorApi}>
            <TouchableOpacity
              style={[styles.botaoApi, backendAtivo === 'java' && styles.botaoApiAtivo]}
              onPress={() => setBackendAtivo('java')}
            >
              <Text style={[styles.textoBotaoApi, backendAtivo === 'java' && styles.textoBotaoApiAtivo]}>
                ☕ Java :8080
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.botaoApi, backendAtivo === 'dotnet' && styles.botaoApiAtivo]}
              onPress={() => setBackendAtivo('dotnet')}
            >
              <Text style={[styles.textoBotaoApi, backendAtivo === 'dotnet' && styles.textoBotaoApiAtivo]}>
                ⚙️ .NET :5000
              </Text>
            </TouchableOpacity>
          </View>
          {/* URL base calculada dinamicamente — mostra o que SERÁ aplicado ao salvar */}
          <View style={styles.urlPreviewBox}>
            <Text style={styles.urlPreviewLabel}>URL base (após salvar):</Text>
            <Text style={styles.urlPreviewValue}>
              http://{ipGateway}:{portaAtiva}/api
            </Text>
          </View>
        </View>

        {/* Card de configuração do IP */}
        <View style={styles.cardConfig}>
          <View style={styles.rowHeaderCardDivider}>
            <Ionicons name="wifi-outline" size={12} color={COLORS.textSecondary} style={styles.iconEspacado} />
            <Text style={styles.tituloCard}>DIRETRIZES DE COMUNICAÇÃO</Text>
          </View>
          <Text style={styles.labelInput}>Endereço IP do Gateway (Terra):</Text>
          <TextInput
            style={styles.input}
            value={ipGateway}
            onChangeText={setIpGateway}
            placeholder="Ex: 192.168.1.100"
            placeholderTextColor="#4b5563"
            keyboardType="numeric"
            autoCapitalize="none"
          />
          <Text style={styles.hintText}>
            Mesmo IP onde o backend Java/NET está rodando na rede local.
          </Text>
        </View>

        {/* Card de configuração JWT */}
        <View style={styles.cardConfig}>
          <View style={styles.rowHeaderCardDivider}>
            <Ionicons name="lock-closed-outline" size={12} color={COLORS.textSecondary} style={styles.iconEspacado} />
            <Text style={styles.tituloCard}>AUTENTICAÇÃO STATELESS (JWT)</Text>
          </View>
          <Text style={styles.labelInput}>Token Bearer JWT:</Text>
          <TextInput
            style={styles.inputArea}
            value={tokenJwt}
            onChangeText={setTokenJwt}
            multiline
            numberOfLines={4}
            placeholder="JWT Token"
            placeholderTextColor="#4b5563"
          />
        </View>

        {/* Botão de gravação — agora funcional */}
        <TouchableOpacity style={styles.botaoGravar} onPress={gravarDefinicoes} disabled={salvando}>
          <View style={styles.rowBotaoConteudo}>
            {salvando
              ? <ActivityIndicator size="small" color="#000000" style={styles.iconBotaoEspacado} />
              : <Ionicons name="save-outline" size={14} color="#000000" style={styles.iconBotaoEspacado} />
            }
            <Text style={styles.textoBotaoGravar}>
              {salvando ? 'APLICANDO...' : 'GRAVAR E APLICAR AGORA'}
            </Text>
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  containerPrincipal: { flex: 1, backgroundColor: COLORS.background, position: 'relative' },
  glowSpotSilver1: {
    position: 'absolute', width: 250, height: 250, borderRadius: 125,
    top: 50, left: -80, backgroundColor: COLORS.glowPurple,
  },
  glowSpotSilver2: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    top: 250, right: -100, backgroundColor: COLORS.glowPurple,
  },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingTop: 50, paddingBottom: 90 },
  containerCentro: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  textoLoading: { color: COLORS.textSecondary, fontFamily: 'DMSans-Regular', marginTop: 15, fontSize: 12 },
  screenTitle: {
    fontSize: 24, fontFamily: 'Syne-Bold', color: COLORS.textPrimary,
    textTransform: 'uppercase', marginBottom: 24, letterSpacing: 1.5,
  },
  cardOperador: {
    backgroundColor: COLORS.glassSurface, borderRadius: 12, padding: 20,
    borderWidth: 1, borderColor: COLORS.glassBorder, marginBottom: 16, alignItems: 'center',
  },
  rowHeaderCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconEspacado: { marginRight: 6 },
  tituloOperador: { fontSize: 10, fontFamily: 'DMSans-Bold', color: COLORS.textSecondary, letterSpacing: 1 },
  valorUsuario: { fontSize: 18, fontFamily: 'DMSans-Bold', color: COLORS.textPrimary, marginBottom: 4 },
  nivelAcesso: { fontSize: 11, fontFamily: 'DMSans-Medium', color: COLORS.purple },
  cardConfig: {
    backgroundColor: COLORS.glassSurface, borderRadius: 12, padding: 20,
    borderWidth: 1, borderColor: COLORS.glassBorder, marginBottom: 16,
  },
  rowHeaderCardDivider: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 6,
  },
  tituloCard: { fontSize: 11, fontFamily: 'DMSans-Bold', color: COLORS.textSecondary, letterSpacing: 1 },
  labelInput: { color: COLORS.textSecondary, fontFamily: 'DMSans-Medium', fontSize: 11, marginBottom: 8 },
  hintText: { color: COLORS.purple, fontFamily: 'DMSans-Regular', fontSize: 10, marginTop: 6 },
  rowSeletorApi: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  botaoApi: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    borderWidth: 1, borderColor: COLORS.border, alignItems: 'center',
    backgroundColor: 'transparent',
  },
  botaoApiAtivo: { backgroundColor: COLORS.accent, borderColor: COLORS.accent },
  textoBotaoApi: { color: COLORS.textSecondary, fontFamily: 'DMSans-Bold', fontSize: 12 },
  textoBotaoApiAtivo: { color: '#000000' },
  urlPreviewBox: {
    backgroundColor: '#05070d', borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  urlPreviewLabel: { color: COLORS.purple, fontFamily: 'DMSans-Regular', fontSize: 10, marginBottom: 4 },
  urlPreviewValue: { color: COLORS.cyan, fontFamily: 'DMSans-Bold', fontSize: 12 },
  input: {
    backgroundColor: '#05070d', color: COLORS.textPrimary, padding: 12,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.border,
    fontSize: 13, fontFamily: 'DMSans-Regular',
  },
  inputArea: {
    backgroundColor: '#05070d', color: COLORS.textPrimary, padding: 12,
    borderRadius: 8, borderWidth: 1, borderColor: COLORS.border,
    fontSize: 11, fontFamily: 'monospace', textAlignVertical: 'top', height: 80,
  },
  botaoGravar: {
    backgroundColor: COLORS.accent, padding: 16, borderRadius: 30,
    alignItems: 'center', marginBottom: 35, borderWidth: 1, borderColor: COLORS.accent,
  },
  rowBotaoConteudo: { flexDirection: 'row', alignItems: 'center' },
  iconBotaoEspacado: { marginRight: 8 },
  textoBotaoGravar: { color: '#000000', fontSize: 12, fontFamily: 'DMSans-Bold', letterSpacing: 1 },
});

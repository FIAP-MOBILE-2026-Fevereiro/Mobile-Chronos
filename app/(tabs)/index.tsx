// ==========================================================================================
// TELA DE DASHBOARD - ESTILO VOID PROTOCOL + GRADIENTES E OPACIDADES (CHRONOS DTN MOBILE)
// INTERFACE DE TESOURARIA B2B BASEADA NO LAYOUT DE CARTEIRA DA IMAGEM 3 E CORES DA IMAGEM 1
// ==========================================================================================

// Importa hooks de estado, referências, efeitos e animações do React Core.
import React, { useState, useEffect, useRef } from 'react';
// Importa os componentes de interface, inputs, animações e responsividade do React Native.
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableWithoutFeedback, TouchableOpacity, Animated, useWindowDimensions, Alert, Easing } from 'react-native';
// Importa o conjunto de ícones vetoriais da Expo para sinalizações visuais.
import { Ionicons } from '@expo/vector-icons';
// Importa as constantes de cores da paleta Void Protocol.
import { COLORS } from '../../constants/Colors';
// Importa o componente oficial de gradiente linear do Expo.
import { LinearGradient } from 'expo-linear-gradient';
// Importa a navegação do expo-router.
import { useRouter } from 'expo-router';

// Mapeamento das 24 marcas da matriz de pacotes de dados cislunares (estilo dot matrix).
const DOTS_LUNA = Array.from({ length: 24 });

// Componente principal do Dashboard.
export default function DashboardScreen() {
  // Inicializa o roteador do expo-router para navegação.
  const router = useRouter();

  // Estado local para o saldo da tesouraria corporativa.
  const [saldo, setSaldo] = useState(15630.71);
  // Estado para armazenar o valor inserido na remessa.
  const [valorRemessa, setValorRemessa] = useState('');
  // Controla o carregamento de rede inicial (1.28s).
  const [carregando, setCarregando] = useState(true);
  // Controla se há um envio de remessa ativo.
  const [enviando, setEnviando] = useState(false);

  // Recupera as dimensões físicas da tela do dispositivo em tempo real para responsividade.
  const { width: larguraTela } = useWindowDimensions();

  // Valores de animação para os pulsares de Skeletons.
  const opacidadeSkeleton = useRef(new Animated.Value(0.3)).current;

  // Valores de animação para transições de entrada dos elementos reais da interface.
  const entradaOpacidade = useRef(new Animated.Value(0)).current;
  const entradaTranslacaoY = useRef(new Animated.Value(40)).current;

  // Valor de animação de escala para efeito de toque no botão.
  const escalaBotao = useRef(new Animated.Value(1)).current;

  // Valor de animação para pulsar a cor da borda neon das opções (futurista).
  const pulsarBorda = useRef(new Animated.Value(0)).current;

  // Valor de animação para a rotação contínua da Terra no banner inferior (período de 30 segundos).
  const rotacaoTerra = useRef(new Animated.Value(0)).current;

  // Efeito disparado na inicialização para simular a latência Terra-Lua de 1.28s.
  useEffect(() => {
    // Configura o timer assíncrono para liberar o carregamento.
    const timer = setTimeout(() => {
      // Libera os dados reais da dashboard.
      setCarregando(false);
      
      // Dispara a entrada suave dos cards da tela.
      Animated.parallel([
        Animated.timing(entradaOpacidade, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.spring(entradaTranslacaoY, { toValue: 0, friction: 6, tension: 40, useNativeDriver: true })
      ]).start();
    }, 1280);
    
    // Retorna a limpeza do timer.
    return () => clearTimeout(timer);
  }, []);

  // Efeito para pulsar continuamente o brilho das bordas neon (design futurista).
  useEffect(() => {
    // Inicia um loop infinito de animação da cor da borda.
    Animated.loop(
      // Executa a sequência de ida e volta do pulsar.
      Animated.sequence([
        // Transiciona para o valor 1 (ciano brilhante) em 1800ms.
        Animated.timing(pulsarBorda, { toValue: 1, duration: 1800, useNativeDriver: false }),
        // Retorna para o valor 0 (azul sutil) em 1800ms.
        Animated.timing(pulsarBorda, { toValue: 0, duration: 1800, useNativeDriver: false })
      ])
    ).start();
  }, []);

  // Efeito para rodar a Terra e orbitar a Lua continuamente (período de 30 segundos).
  useEffect(() => {
    // Inicia um loop infinito de animação linear para a rotação planetária.
    Animated.loop(
      Animated.timing(rotacaoTerra, {
        toValue: 1,
        duration: 30000,
        useNativeDriver: true,
        easing: Easing.linear,
      })
    ).start();
  }, []);

  // Interpola o valor de pulsarBorda para criar a transição de cores da borda neon.
  const corBordaNeon = pulsarBorda.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0, 133, 255, 0.15)', 'rgba(0, 212, 255, 0.5)']
  });

  // Interpola a posição horizontal X dos continentes na rotação de 30 segundos.
  const continenteTranslacaoX = rotacaoTerra.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -60]
  });

  // Interpola o ângulo de rotação em graus para a órbita lunar de 30 segundos.
  const anguloOrbitaLua = rotacaoTerra.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  // Efeito executado enquanto a tela estiver carregando para rodar o pulso do Skeleton.
  useEffect(() => {
    if (carregando || enviando) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacidadeSkeleton, { toValue: 0.6, duration: 600, useNativeDriver: true }),
          Animated.timing(opacidadeSkeleton, { toValue: 0.2, duration: 600, useNativeDriver: true })
        ])
      ).start();
    }
  }, [carregando, enviando]);

  // Microanimação de escala ao pressionar o botão.
  const handlePressIn = () => {
    Animated.timing(escalaBotao, { toValue: 1.03, duration: 100, useNativeDriver: true }).start();
  };

  // Microanimação de escala ao soltar o botão.
  const handlePressOut = () => {
    Animated.spring(escalaBotao, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  };

  // Processa a transferência cislunar aplicando o delay físico do sinal.
  const dispararRemessa = () => {
    const valorNumerico = parseFloat(valorRemessa);
    
    // Validação de entrada.
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Valor Inválido', 'Por favor, insira um montante válido para remessa.');
      return;
    }

    // Validação de saldo.
    if (valorNumerico > saldo) {
      Alert.alert('Saldo Insuficiente', 'O valor solicitado excede o limite disponível na carteira.');
      return;
    }

    // Inicia estado de envio.
    setEnviando(true);

    // Simula a transmissão do pacote físico de dados até a Terra (1.28s).
    setTimeout(() => {
      setSaldo(prevSaldo => prevSaldo - valorNumerico);
      setValorRemessa('');
      setEnviando(false);
      
      Alert.alert(
        'Remessa Despachada',
        `Lote de $${valorNumerico.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC enviado ao Roteador de Borda com sucesso.`
      );
    }, 1280);
  };

  // Renderiza a visualização do Skeleton Screen caso o delay inicial esteja ativo.
  if (carregando) {
    return (
      <View style={styles.containerPrincipal}>
        <View style={styles.contentSkeleton}>
          {/* Caixa de esqueleto simulando a barra de ferramentas do topo. */}
          <Animated.View style={[styles.skeletonHeader, { opacity: opacidadeSkeleton }]} />
          {/* Caixa de esqueleto simulando o card principal de saldo. */}
          <Animated.View style={[styles.skeletonWallet, { opacity: opacidadeSkeleton }]} />
          {/* Caixa de esqueleto simulando os cartões de dados. */}
          <View style={styles.rowSideBySide}>
            <Animated.View style={[styles.skeletonSubCard, { opacity: opacidadeSkeleton }]} />
            <Animated.View style={[styles.skeletonSubCard, { opacity: opacidadeSkeleton }]} />
          </View>
        </View>
      </View>
    );
  }

  // Define espaçamentos laterais dinâmicos para responsividade.
  const paddingLateral = 16;
  const larguraGridEsquerda = (larguraTela - 40) * 0.48; // Divide a grade horizontal.
  const larguraGridDireita = (larguraTela - 40) * 0.48;

  return (
    <View style={styles.containerPrincipal}>
      {/* ScrollView principal do aplicativo móvel. */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.content, { paddingHorizontal: paddingLateral }]}
        showsVerticalScrollIndicator={false}
      >
        
        {/* ==================================================================================
            SEÇÃO 1: BARRA DE FERRAMENTAS DO TOPO (AVATAR, BUSCA E ÍCONES RÁPIDOS)
            ================================================================================== */}
        <View style={styles.topToolbar}>
          {/* Círculo do avatar do operador (esquerda). */}
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={32} color={COLORS.textSecondary} />
          </View>

          {/* Barra de busca centralizada. */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={14} color={COLORS.purple} style={styles.iconSearch} />
            <TextInput 
              style={styles.inputSearch} 
              placeholder="Search" 
              placeholderTextColor={COLORS.purple} 
              editable={false}
            />
          </View>

          {/* Ícones de ação no topo direito. */}
          <View style={styles.topIconsRow}>
            <TouchableOpacity style={styles.topIconBtn}>
              <Ionicons name="gift-outline" size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
            {/* Navega para a tela de Perfil/Configurações ao clicar no ícone de engrenagem. */}
            <TouchableOpacity 
              style={styles.topIconBtn}
              onPress={() => router.push('/profile')}
            >
              <Ionicons name="settings-outline" size={18} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ==================================================================================
            SEÇÃO 2: CARD PRINCIPAL DE CARTEIRA (CONECTADO AO GRADIENTE VOID PROTOCOL)
            ================================================================================== */}
        <Animated.View 
          style={[
            styles.walletContainer, 
            { 
              opacity: entradaOpacidade, 
              transform: [{ translateY: entradaTranslacaoY }] 
            }
          ]}
        >
          {/* Aplica o gradiente linear suave para simular o espaço cislunar profundo. */}
          <LinearGradient
            colors={['#131a2e', '#0B0F19', '#0A0E1A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.walletCard}
          >
            {/* Pontinhos brancos (estrelas) simulando o céu profundo cislunar no fundo do card */}
            <View style={[styles.estrela, { top: 12, left: 35, opacity: 0.5 }]} />
            <View style={[styles.estrela, { top: 28, left: 140, opacity: 0.7 }]} />
            <View style={[styles.estrela, { top: 40, left: 260, opacity: 0.6 }]} />
            <View style={[styles.estrela, { top: 75, left: 80, opacity: 0.4 }]} />
            <View style={[styles.estrela, { top: 60, left: 295, opacity: 0.8 }]} />
            <View style={[styles.estrela, { top: 110, left: 55, opacity: 0.9 }]} />
            <View style={[styles.estrela, { top: 130, left: 180, opacity: 0.3 }]} />
            <View style={[styles.estrela, { top: 95, left: 220, opacity: 0.5 }]} />
            {/* Cabeçalho interno do cartão de saldo. */}
            <View style={styles.walletHeader}>
              <Text style={styles.walletTitle}>Wallet</Text>
              {/* Ícone de adicionar em cima. */}
              <TouchableOpacity>
                <Ionicons name="add" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Nome do Operador do painel. */}
            <Text style={styles.walletUser}>Josh Hill</Text>

            {/* Montante financeiro formatado com fonte geométrica Syne. */}
            <Text style={styles.walletBalance}>
              ${saldo.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </Text>

            {/* Rodapé do cartão contendo número de conta e indicador visual de parceiro. */}
            <View style={styles.walletFooter}>
              <Text style={styles.walletAccount}>Account ** 5087</Text>
              
              {/* Detalhe visual de cartões bancários parceiros (Mastercard style). */}
              <View style={styles.partnerCircles}>
                <View style={[styles.circleMin, { backgroundColor: '#FF3B5C', marginRight: -6 }]} />
                <View style={[styles.circleMin, { backgroundColor: '#FFB800', opacity: 0.85 }]} />
                <Text style={styles.partnerText}>**** 3264</Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ==================================================================================
            SEÇÃO 3: CARDS LADO A LADO COM OPACIDADES E BORDAS GLOW
            ================================================================================== */}
        <Animated.View 
          style={[
            styles.rowSideBySide, 
            { 
              opacity: entradaOpacidade, 
              transform: [{ translateY: entradaTranslacaoY }] 
            }
          ]}
        >
          {/* Card esquerdo: Fila DTN (com borda neon pulsante e gradiente glassmorphic translúcido). */}
          <Animated.View style={[styles.subCardContainer, { width: larguraGridEsquerda, borderColor: corBordaNeon }]}>
            <LinearGradient
              colors={['rgba(18, 25, 38, 0.8)', 'rgba(0, 133, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradientInternal}
            >
              <Text style={styles.subCardTitle}>Fila DTN</Text>
              <Text style={styles.subCardDesc}>Pacotes em tráfego</Text>

              {/* Matriz de bolinhas minimalista de alta densidade de informação. */}
              <View style={styles.miniDotGrid}>
                {DOTS_LUNA.slice(0, 18).map((_, index) => {
                  let corPonto = 'rgba(200, 214, 229, 0.15)'; // Inativo padrão.
                  if (index < 12) {
                    corPonto = COLORS.cyan; // Processados em ciano.
                  } else if (index === 12) {
                    corPonto = COLORS.gold; // Retido em ouro.
                  }
                  return (
                    <View 
                      key={index} 
                      style={[styles.miniDot, { backgroundColor: corPonto }]} 
                    />
                  );
                })}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Card direito: Nós Ativos (com borda neon pulsante e gradiente glassmorphic translúcido). */}
          <Animated.View style={[styles.subCardContainer, { width: larguraGridDireita, borderColor: corBordaNeon }]}>
            <LinearGradient
              colors={['rgba(18, 25, 38, 0.8)', 'rgba(0, 133, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradientInternal}
            >
              <Text style={styles.subCardTitle}>Nós Ativos</Text>
              
              {/* Lista minimalista vertical dos nós. */}
              <View style={styles.nodesList}>
                <View style={styles.nodeItem}>
                  <View style={[styles.nodeLed, { backgroundColor: COLORS.cyan }]} />
                  <Text style={styles.nodeText}>Earth_KSC</Text>
                </View>
                <View style={styles.nodeItem}>
                  <View style={[styles.nodeLed, { backgroundColor: COLORS.cyan }]} />
                  <Text style={styles.nodeText}>Luna_Alpha</Text>
                </View>
                <View style={styles.nodeItem}>
                  <View style={[styles.nodeLed, { backgroundColor: COLORS.gold }]} />
                  <Text style={styles.nodeText}>Luna_Beta</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>

        {/* ==================================================================================
            SEÇÃO 4: BOTÕES DE AÇÃO HORIZONTAIS
            ================================================================================== */}
        <Animated.View 
          style={[
            styles.actionRow, 
            { 
              opacity: entradaOpacidade, 
              transform: [{ translateY: entradaTranslacaoY }] 
            }
          ]}
        >
          {/* Botão quadrado de escaneamento. */}
          <TouchableOpacity style={styles.squareActionBtn}>
            <Ionicons name="scan-outline" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Card largo: Drift de tempo (com borda neon pulsante e gradiente glassmorphic translúcido). */}
          <Animated.View style={[styles.wideActionCard, { borderColor: corBordaNeon }]}>
            <LinearGradient
              colors={['rgba(18, 25, 38, 0.8)', 'rgba(0, 133, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.actionGradientInternal}
            >
              <View style={styles.iconCircleAction}>
                <Ionicons name="time" size={14} color={COLORS.textPrimary} />
              </View>
              <View style={styles.textActionCol}>
                <Text style={styles.actionCardTitle}>Drift Relativístico</Text>
                <Text style={styles.actionCardValue}>-56.00 μs/dia</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Card médio: Rede e Latência (com borda neon pulsante e gradiente glassmorphic translúcido). */}
          <Animated.View style={[styles.mediumActionCard, { borderColor: corBordaNeon }]}>
            <LinearGradient
              colors={['rgba(18, 25, 38, 0.8)', 'rgba(0, 133, 255, 0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.actionGradientInternal, { paddingHorizontal: 8 }]}
            >
              <View style={styles.iconCircleAction}>
                <Ionicons name="speedometer" size={14} color={COLORS.textPrimary} />
              </View>
              <View style={styles.textActionCol}>
                <Text style={styles.actionCardTitle}>Latência</Text>
                <Text style={styles.actionCardValue}>1.28s</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Botão de adicionar na linha. */}
          <TouchableOpacity style={styles.squareActionBtn}>
            <Ionicons name="add" size={16} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

        {/* ==================================================================================
            SEÇÃO 5: BANNER INFERIOR DE REMESSA CISLUNAR COM GRADIENTE LINEAR
            ================================================================================== */}
        <Animated.View 
          style={[
            styles.remittanceBannerContainer, 
            { 
              opacity: entradaOpacidade, 
              transform: [{ translateY: entradaTranslacaoY }] 
            }
          ]}
        >
          {/* Aplica o gradiente linear de fusão escura com brilho de Ion Blue. */}
          <LinearGradient
            colors={['#121926', 'rgba(0, 133, 255, 0.12)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.remittanceBanner}
          >
            {/* Lado esquerdo contendo os formulários e o botão. */}
            <View style={styles.bannerLeftCol}>
              <Text style={styles.bannerTitle}>Disparar Remessa</Text>
              <Text style={styles.bannerDesc}>Envie stablecoins instantaneamente para a liquidação na Terra.</Text>

              {/* Input integrado minimalista com o fundo escurecido. */}
              <TextInput
                style={styles.bannerInput}
                value={valorRemessa}
                onChangeText={setValorRemessa}
                keyboardType="numeric"
                placeholder="Digite o valor (USDC)"
                placeholderTextColor={COLORS.purple}
              />

              {/* Botão principal de ação em Ion Blue. */}
              <TouchableWithoutFeedback
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={dispararRemessa}
              >
                <Animated.View style={[styles.bannerBtn, { transform: [{ scale: escalaBotao }] }]}>
                  <Text style={styles.bannerBtnText}>DISPARAR REMESSA</Text>
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>

            {/* Lado direito: Gráfico planetário da Terra e Lua animado. */}
            <View style={styles.bannerRightCol}>
              {/* Esfera do Planeta Terra (Máscara circular com overflow hidden) */}
              <View style={styles.planetSphere}>
                {/* Faixa deslizante de continentes para simular a rotação terrestre */}
                <Animated.View style={[styles.continentsSlider, { transform: [{ translateX: continenteTranslacaoX }] }]}>
                  {/* Grupo 1 de continentes */}
                  <View style={[styles.continente, { top: 10, left: 5, width: 22, height: 18, borderRadius: 9 }]} />
                  <View style={[styles.continente, { top: 28, left: 25, width: 16, height: 22, borderRadius: 8 }]} />
                  <View style={[styles.continente, { top: 8, left: 40, width: 14, height: 12, borderRadius: 6 }]} />
                  
                  {/* Grupo 2 de continentes (repete para loop contínuo e sem emendas a cada 60px) */}
                  <View style={[styles.continente, { top: 10, left: 65, width: 22, height: 18, borderRadius: 9 }]} />
                  <View style={[styles.continente, { top: 28, left: 85, width: 16, height: 22, borderRadius: 8 }]} />
                  <View style={[styles.continente, { top: 8, left: 100, width: 14, height: 12, borderRadius: 6 }]} />
                </Animated.View>
              </View>

              {/* Contêiner de rotação da órbita da Lua (gira 360 graus a cada 30 segundos) */}
              <Animated.View style={[styles.planetOrbitRingContainer, { transform: [{ rotate: anguloOrbitaLua }] }]}>
                {/* Lua orbitando na borda externa do raio orbital */}
                <View style={styles.satelliteOrbiter} />
              </Animated.View>
            </View>
          </LinearGradient>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

// Definição de estilos estáticos seguindo as diretrizes do Void Protocol e Image 3.
const styles = StyleSheet.create({
  // Container principal.
  containerPrincipal: {
    flex: 1,
    backgroundColor: COLORS.background, // Fundo Void Black.
  },
  // ScrollView do dashboard.
  scrollView: {
    flex: 1,
  },
  // Área interna de conteúdo.
  content: {
    paddingTop: 50,
    paddingBottom: 90, // Margem inferior segura.
  },
  // Estrutura interna para o Skeleton Screen.
  contentSkeleton: {
    padding: 16,
    paddingTop: 50,
    flex: 1,
  },
  // Esqueleto do cabeçalho.
  skeletonHeader: {
    height: 40,
    backgroundColor: COLORS.deepBlue,
    borderRadius: 8,
    marginBottom: 20,
  },
  // Esqueleto da carteira.
  skeletonWallet: {
    height: 180,
    backgroundColor: COLORS.deepBlue,
    borderRadius: 24,
    marginBottom: 20,
  },
  // Esqueleto dos sub-cards.
  skeletonSubCard: {
    flex: 1,
    height: 110,
    backgroundColor: COLORS.deepBlue,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  // ==================================================================================
  // ESTILOS: TOOBAR DE TOPO
  // ==================================================================================
  topToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 4,
  },
  // Container do avatar.
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // Barra de busca do meio.
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.deepBlue,
    borderRadius: 12,
    height: 36,
    marginHorizontal: 12,
    paddingHorizontal: 10,
  },
  iconSearch: {
    marginRight: 6,
  },
  inputSearch: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontFamily: 'DMSans-Regular',
  },
  // Grupo de ícones da direita.
  topIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topIconBtn: {
    marginLeft: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ==================================================================================
  // ESTILOS: CARD DE CARTEIRA (WALLET CARD COM GRADIENTE E BORDA BRILHANTE)
  // ==================================================================================
  walletContainer: {
    marginBottom: 16,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 133, 255, 0.25)', // Borda azul brilhante.
  },
  walletCard: {
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#0085FF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 15,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  walletTitle: {
    color: COLORS.purple, // Cinza/roxo inativo.
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
  },
  walletUser: {
    color: COLORS.textSecondary, // Lunar Silver.
    fontFamily: 'DMSans-Bold',
    fontSize: 16,
    marginBottom: 15,
  },
  walletBalance: {
    color: COLORS.textPrimary, // Branco.
    fontFamily: 'Syne-Bold', // Fonte geométrica.
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  walletFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletAccount: {
    color: COLORS.purple,
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
  },
  partnerCircles: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleMin: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  partnerText: {
    color: COLORS.purple,
    fontSize: 11,
    fontFamily: 'DMSans-Medium',
    marginLeft: 8,
  },
  // ==================================================================================
  // ESTILOS: SUB CARDS LADO A LADO COM OPACIDADES E GLOW DE ION BLUE
  // ==================================================================================
  rowSideBySide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  subCardContainer: {
    backgroundColor: 'transparent', // Fundo transparente para herdar gradiente.
    borderRadius: 20,
    height: 110,
    borderWidth: 1,
    overflow: 'hidden', // Corta bordas do gradiente interno.
    shadowColor: '#0085FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardGradientInternal: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
  },
  subCardTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'DMSans-Bold',
    fontSize: 13,
  },
  subCardDesc: {
    color: COLORS.purple,
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    marginBottom: 10,
  },
  // Fila dot-matrix compacta de pacotes.
  miniDotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 4,
  },
  miniDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Lista de nós compacta do card da direita.
  nodesList: {
    marginTop: 8,
    gap: 6,
  },
  nodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nodeLed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  nodeText: {
    color: COLORS.textSecondary,
    fontFamily: 'DMSans-Medium',
    fontSize: 11,
  },
  // ==================================================================================
  // ESTILOS: BOTÕES DE AÇÃO HORIZONTAIS
  // ==================================================================================
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 6,
  },
  squareActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(18, 25, 38, 0.75)', // Opacidade.
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 133, 255, 0.15)', // Borda Ion Blue.
  },
  wideActionCard: {
    flex: 2,
    borderRadius: 12,
    height: 36,
    borderWidth: 1,
    overflow: 'hidden', // Corta cantos do gradiente interno.
  },
  mediumActionCard: {
    flex: 1.5,
    borderRadius: 12,
    height: 36,
    borderWidth: 1,
    overflow: 'hidden', // Corta cantos do gradiente interno.
  },
  actionGradientInternal: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: '100%',
    borderRadius: 12,
  },
  iconCircleAction: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  textActionCol: {
    flex: 1,
  },
  actionCardTitle: {
    color: COLORS.purple,
    fontFamily: 'DMSans-Regular',
    fontSize: 8,
    textTransform: 'uppercase',
  },
  actionCardValue: {
    color: COLORS.textPrimary,
    fontFamily: 'DMSans-Bold',
    fontSize: 10,
  },
  // ==================================================================================
  // ESTILOS: BANNER INFERIOR DE REMESSA (COBERTO COM GRADIENTE)
  // ==================================================================================
  remittanceBannerContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 133, 255, 0.25)', // Borda brilhante em Ion Blue.
  },
  remittanceBanner: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerLeftCol: {
    flex: 1.3,
    paddingRight: 10,
  },
  bannerTitle: {
    color: COLORS.textPrimary,
    fontFamily: 'DMSans-Bold',
    fontSize: 15,
    marginBottom: 4,
  },
  bannerDesc: {
    color: COLORS.purple,
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 12,
  },
  bannerInput: {
    backgroundColor: COLORS.background, // Fundo escuro integrado.
    color: COLORS.textPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 133, 255, 0.15)',
  },
  bannerBtn: {
    backgroundColor: COLORS.accent, // Acento Ion Blue.
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerBtnText: {
    color: '#000000',
    fontFamily: 'DMSans-Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  // Lado direito contendo os gráficos planetários abstratos.
  bannerRightCol: {
    flex: 0.7,
    height: 120,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Esfera planetária (Terra com fundo azul oceano).
  planetSphere: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1E3A8A', // Fundo azul oceano
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 133, 255, 0.4)',
    position: 'relative',
    shadowColor: '#0085FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  // Faixa deslizante que agrupa os continentes.
  continentsSlider: {
    flexDirection: 'row',
    width: 120,
    height: 60,
    position: 'absolute',
  },
  // Formato individual de cada continente.
  continente: {
    position: 'absolute',
    backgroundColor: '#10B981', // Verde continental
    opacity: 0.85,
  },
  // Anel orbital contêiner da órbita lunar.
  planetOrbitRingContainer: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(0, 133, 255, 0.1)', // Rastro orbital suave
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  // Satélite menor circulando (Lua no topo da órbita).
  satelliteOrbiter: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C8D6E5', // Lua prateada
    top: -4, // Coloca a Lua alinhada ao topo da órbita
    shadowColor: '#C8D6E5',
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  // Pontinhos de estrelas no fundo.
  estrela: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
});

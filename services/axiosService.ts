// ==========================================================================================
// AXIOS INTERCEPTOR - CHRONOS DTN MOBILE
// SIMULA A LATÊNCIA FÍSICA DA LUZ TERRA-LUA (1.28s) E TRATA ERROS DE REDE CISLUNAR
// ==========================================================================================

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Alert } from 'react-native';

// Constante de tempo de latência da luz da Terra à Lua em milissegundos.
const LATENCIA_LUZ_MS = 1280;

// Instância principal do Axios para a API Java (Spring Boot — porta 8080).
export const apiJava: AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.100:8080/api',
  timeout: 15000,
});

// Instância secundária do Axios para a API .NET (ASP.NET Core — porta 5000).
export const apiDotnet: AxiosInstance = axios.create({
  baseURL: 'http://192.168.1.100:5000/api',
  timeout: 15000,
});

// Referência exportável para a API ativa (padrão: Java).
// Atualizada dinamicamente pela tela de Perfil ao trocar o backend.
export let apiAtiva: AxiosInstance = apiJava;

// Altera a API ativa em tempo de execução conforme seleção do operador na tela de Perfil.
export function setApiAtiva(backend: 'java' | 'dotnet') {
  apiAtiva = backend === 'java' ? apiJava : apiDotnet;
}

// Helper de atraso síncrono que simula a passagem do tempo físico na rede espacial.
const atrasoLatencia = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Configura os interceptors de request e response para AMBAS as instâncias.
[apiJava, apiDotnet].forEach((instancia) => {
  // ========================================================================================
  // INTERCEPTOR DE REQUISIÇÃO: aplica delay de 1.28s antes de enviar para o servidor.
  // ========================================================================================
  instancia.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      console.log(`[LATENCY-SIM] Enviando para ${config.url}. Aguardando ${LATENCIA_LUZ_MS}ms...`);
      await atrasoLatencia(LATENCIA_LUZ_MS);

      // Bloqueia DELETE de nós com buffer pendente (nó de ID 3 como mock de teste).
      if (config.method === 'delete' && config.url?.includes('/nodes/')) {
        const idNodeStr = config.url.split('/').pop();
        const idNode = parseInt(idNodeStr || '0', 10);
        const temPacotesPendentes = await verificarBufferPendente(idNode);

        if (temPacotesPendentes && config.headers?.['X-Force-Delete'] !== 'true') {
          return new Promise<InternalAxiosRequestConfig>((resolve, reject) => {
            Alert.alert(
              'Ação Bloqueada pelo Protocolo DTN',
              'Não é possível deletar este nó. Existem pacotes retidos na memória flash deste gateway.',
              [
                {
                  text: 'OK (Manter Nó)',
                  style: 'cancel',
                  onPress: () => reject(new Error('Exclusao cancelada: buffer ativo.')),
                },
                {
                  text: 'Forçar Exclusão',
                  style: 'destructive',
                  onPress: () => {
                    Alert.alert(
                      '⚠️ AVISO CRÍTICO',
                      'Forçar a exclusão descartará PERMANENTEMENTE os pacotes retidos. Tem certeza?',
                      [
                        { text: 'Abortar', style: 'cancel', onPress: () => reject(new Error('Cancelado no segundo aviso.')) },
                        {
                          text: 'Sim, Descartar e Deletar',
                          style: 'destructive',
                          onPress: () => {
                            config.headers['X-Force-Delete'] = 'true';
                            resolve(config);
                          },
                        },
                      ]
                    );
                  },
                },
              ]
            );
          });
        }
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // ========================================================================================
  // INTERCEPTOR DE RESPOSTA: aplica delay de retorno e trata erros de forma padronizada.
  // ========================================================================================
  instancia.interceptors.response.use(
    async (response: AxiosResponse) => {
      console.log(`[LATENCY-SIM] Resposta recebida. Aguardando ${LATENCIA_LUZ_MS}ms de retorno...`);
      await atrasoLatencia(LATENCIA_LUZ_MS);
      return response;
    },
    async (error: AxiosError) => {
      await atrasoLatencia(LATENCIA_LUZ_MS);
      const mensagemErro = error.response
        ? `Erro do Servidor [${error.response.status}]: ${JSON.stringify(error.response.data)}`
        : `Falha na rede cislunar: ${error.message}`;
      console.error(`[DTN-ERROR] ${mensagemErro}`);
      return Promise.reject(error);
    }
  );
});

// Verifica se o nó possui pacotes pendentes no buffer (mock de teste: nó ID 3).
async function verificarBufferPendente(idNode: number): Promise<boolean> {
  return new Promise((resolve) => resolve(idNode === 3));
}

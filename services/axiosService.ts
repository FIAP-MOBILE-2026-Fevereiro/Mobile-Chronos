// ==========================================================================================
// AXIOS SERVICE — CHRONOS DTN MOBILE
// INSTÂNCIAS DINÂMICAS COM IP E BACKEND CONFIGURÁVEIS VIA PERFIL
// SIMULA LATÊNCIA FÍSICA DA LUZ TERRA-LUA (1.28s) EM AMBAS AS INSTÂNCIAS
// ==========================================================================================

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Alert } from 'react-native';
import { IP_PADRAO, BACKEND_PADRAO } from './configService';

// Constante de latência da luz Terra-Lua em milissegundos.
const LATENCIA_LUZ_MS = 1280;

// ==========================================================================================
// ESTADO GLOBAL DO SERVIÇO — mutável via updateAxiosConfig()
// ==========================================================================================

// IP do gateway atualmente configurado (começa com o padrão de fábrica).
let ipAtual: string = IP_PADRAO;
// Backend atualmente ativo (começa com Java por padrão).
let backendAtual: 'java' | 'dotnet' = BACKEND_PADRAO;

// Instâncias Axios — criadas UMA VEZ e reutilizadas (baseURL é trocada dinamicamente).
export const apiJava: AxiosInstance = axios.create({
  baseURL: `http://${IP_PADRAO}:8080/api`,
  timeout: 15000,
});

export const apiDotnet: AxiosInstance = axios.create({
  baseURL: `http://${IP_PADRAO}:5000/api`,
  timeout: 15000,
});

// ==========================================================================================
// updateAxiosConfig — Chamada pela tela de Perfil ao salvar as configurações.
// Atualiza o baseURL de AMBAS as instâncias dinamicamente sem recriar o objeto Axios.
// ==========================================================================================
export function updateAxiosConfig(novoIp: string, novoBackend: 'java' | 'dotnet'): void {
  ipAtual = novoIp.trim();
  backendAtual = novoBackend;

  // Atualiza o baseURL das instâncias existentes em runtime.
  apiJava.defaults.baseURL = `http://${ipAtual}:8080/api`;
  apiDotnet.defaults.baseURL = `http://${ipAtual}:5000/api`;

  console.log(`[CONFIG] Gateway atualizado → Java: http://${ipAtual}:8080/api | .NET: http://${ipAtual}:5000/api`);
  console.log(`[CONFIG] Backend ativo: ${backendAtual}`);
}

// ==========================================================================================
// getApiAtiva — Retorna a instância correta conforme o backend selecionado na sessão.
// Usado por todos os serviços de CRUD para resolver dinamicamente qual API consumir.
// ==========================================================================================
export function getApiAtiva(): AxiosInstance {
  return backendAtual === 'java' ? apiJava : apiDotnet;
}

// ==========================================================================================
// Getters de estado para leitura pela tela de Perfil.
// ==========================================================================================
export function getIpAtual(): string { return ipAtual; }
export function getBackendAtual(): 'java' | 'dotnet' { return backendAtual; }

// ==========================================================================================
// Helper de atraso físico (simula propagação do sinal de rádio Terra-Lua).
// ==========================================================================================
const atrasoLatencia = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ==========================================================================================
// INTERCEPTORS — Aplicados a ambas as instâncias (Java e .NET).
// ==========================================================================================
[apiJava, apiDotnet].forEach((instancia) => {

  // ─── REQUEST INTERCEPTOR ─────────────────────────────────────────────────────────────
  instancia.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      console.log(`[LATENCY-SIM] → ${config.method?.toUpperCase()} ${config.baseURL}${config.url} | aguardando ${LATENCIA_LUZ_MS}ms...`);
      await atrasoLatencia(LATENCIA_LUZ_MS);

      // Proteção de DELETE: bloqueia remoção de nós com buffer pendente.
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
                        {
                          text: 'Abortar',
                          style: 'cancel',
                          onPress: () => reject(new Error('Cancelado no segundo aviso.')),
                        },
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

  // ─── RESPONSE INTERCEPTOR ────────────────────────────────────────────────────────────
  instancia.interceptors.response.use(
    async (response: AxiosResponse) => {
      console.log(`[LATENCY-SIM] ← Resposta recebida. Aguardando ${LATENCIA_LUZ_MS}ms de retorno...`);
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

// ==========================================================================================
// AUXILIAR — Verifica buffer pendente (mock: nó ID 3 sempre tem buffer).
// ==========================================================================================
async function verificarBufferPendente(idNode: number): Promise<boolean> {
  return new Promise((resolve) => resolve(idNode === 3));
}

// ==========================================================================================
// SERVICO DE CONFIGURAÇÃO — CHRONOS DTN MOBILE
// PERSISTE O IP DO GATEWAY E O BACKEND ATIVO (JAVA/.NET) VIA ASYNC STORAGE
// ==========================================================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves de armazenamento no AsyncStorage.
const CHAVE_IP_GATEWAY = '@chronos:ipGateway';
const CHAVE_BACKEND = '@chronos:backendAtivo';

// Valores padrão de fábrica.
export const IP_PADRAO = '192.168.1.100';
export const BACKEND_PADRAO: 'java' | 'dotnet' = 'java';

// ========================================================================================
// GRAVAR — Persiste o IP do gateway no dispositivo.
// ========================================================================================
export async function salvarIpGateway(ip: string): Promise<void> {
  await AsyncStorage.setItem(CHAVE_IP_GATEWAY, ip.trim());
}

// ========================================================================================
// CARREGAR — Recupera o IP do gateway salvo (retorna o padrão se não houver).
// ========================================================================================
export async function carregarIpGateway(): Promise<string> {
  const ip = await AsyncStorage.getItem(CHAVE_IP_GATEWAY);
  return ip ?? IP_PADRAO;
}

// ========================================================================================
// GRAVAR — Persiste a escolha de backend (java | dotnet) no dispositivo.
// ========================================================================================
export async function salvarBackend(backend: 'java' | 'dotnet'): Promise<void> {
  await AsyncStorage.setItem(CHAVE_BACKEND, backend);
}

// ========================================================================================
// CARREGAR — Recupera o backend salvo (retorna java se não houver).
// ========================================================================================
export async function carregarBackend(): Promise<'java' | 'dotnet'> {
  const backend = await AsyncStorage.getItem(CHAVE_BACKEND);
  return (backend as 'java' | 'dotnet') ?? BACKEND_PADRAO;
}

// ========================================================================================
// COMPOSTO — Lê IP e backend de uma vez para inicializar o serviço Axios.
// ========================================================================================
export async function carregarConfiguracoes(): Promise<{ ip: string; backend: 'java' | 'dotnet' }> {
  const [ip, backend] = await Promise.all([carregarIpGateway(), carregarBackend()]);
  return { ip, backend };
}

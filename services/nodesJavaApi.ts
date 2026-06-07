// ==========================================================================================
// SERVICO DE NOS DTN — CRUD UNIFICADO (CHRONOS DTN MOBILE)
// USA getApiAtiva() PARA RESOLVER DINAMICAMENTE QUAL BACKEND ESTÁ ATIVO (JAVA / .NET)
// SWITCH É FEITO PELA TELA DE PERFIL VIA updateAxiosConfig() — SEM REINICIAR O APP
// ==========================================================================================

import { getApiAtiva } from './axiosService';

// Interface da entidade Nó de rede conforme contrato de ambas as APIs.
export interface NoRede {
  id?: number;
  name: string;
  location: string;
  bufferedPackets: number;
  status?: string;
}

// ========================================================================================
// READ — Busca todos os nós cadastrados na rede DTN.
// Usa a instância ativa (Java :8080 ou .NET :5000) conforme configuração do Perfil.
// ========================================================================================
export async function buscarNos(): Promise<NoRede[]> {
  const response = await getApiAtiva().get<NoRede[]>('/nodes');
  return response.data;
}

// ========================================================================================
// READ — Busca um nó específico pelo seu identificador único.
// ========================================================================================
export async function buscarNoPorId(id: number): Promise<NoRede> {
  const response = await getApiAtiva().get<NoRede>(`/nodes/${id}`);
  return response.data;
}

// ========================================================================================
// CREATE — Registra um novo nó gateway na rede DTN.
// ========================================================================================
export async function criarNo(novoNo: Omit<NoRede, 'id'>): Promise<NoRede> {
  const response = await getApiAtiva().post<NoRede>('/nodes', novoNo);
  return response.data;
}

// ========================================================================================
// UPDATE — Atualiza parcialmente um nó existente via PATCH (envia apenas os campos alterados).
// PATCH é mais seguro que PUT para updates parciais: não sobrescreve bufferedPackets etc.
// ========================================================================================
export async function atualizarNo(id: number, dadosAtualizados: Partial<NoRede>): Promise<NoRede> {
  const response = await getApiAtiva().patch<NoRede>(`/nodes/${id}`, dadosAtualizados);
  return response.data;
}

// ========================================================================================
// DELETE — Remove permanentemente um nó da rede DTN.
// O interceptor Axios em axiosService.ts bloqueia automaticamente nós com buffer pendente.
// ========================================================================================
export async function deletarNo(id: number): Promise<void> {
  await getApiAtiva().delete(`/nodes/${id}`);
}

// ==========================================================================================
// SERVICO DE NOS DTN — API JAVA (SPRING BOOT 3 — PORTA 8080)
// CRUD COMPLETO: CREATE, READ, UPDATE, DELETE DE GATEWAYS CISLUNARES
// ==========================================================================================

import { apiJava } from './axiosService';

// Interface da entidade Nó de rede conforme contrato da API Java.
export interface NoRede {
  id?: number;
  name: string;
  location: string;
  bufferedPackets: number;
  status?: string;
}

// ========================================================================================
// READ — Busca todos os nós cadastrados na rede DTN via API Java.
// ========================================================================================
export async function buscarNos(): Promise<NoRede[]> {
  const response = await apiJava.get<NoRede[]>('/nodes');
  return response.data;
}

// ========================================================================================
// READ — Busca um nó específico pelo seu identificador único.
// ========================================================================================
export async function buscarNoPorId(id: number): Promise<NoRede> {
  const response = await apiJava.get<NoRede>(`/nodes/${id}`);
  return response.data;
}

// ========================================================================================
// CREATE — Registra um novo nó gateway na rede DTN via API Java.
// ========================================================================================
export async function criarNo(novoNo: Omit<NoRede, 'id'>): Promise<NoRede> {
  const response = await apiJava.post<NoRede>('/nodes', novoNo);
  return response.data;
}

// ========================================================================================
// UPDATE — Atualiza os dados de um nó existente na rede via API Java.
// ========================================================================================
export async function atualizarNo(id: number, dadosAtualizados: Partial<NoRede>): Promise<NoRede> {
  const response = await apiJava.put<NoRede>(`/nodes/${id}`, dadosAtualizados);
  return response.data;
}

// ========================================================================================
// DELETE — Remove permanentemente um nó da rede DTN via API Java.
// O interceptor do Axios bloqueia automaticamente se houver buffer pendente.
// ========================================================================================
export async function deletarNo(id: number): Promise<void> {
  await apiJava.delete(`/nodes/${id}`);
}

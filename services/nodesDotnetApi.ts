// ==========================================================================================
// SERVICO DE NOS DTN — API .NET (ASP.NET CORE 8 — PORTA 5000)
// CRUD COMPLETO: CREATE, READ, UPDATE, DELETE DE GATEWAYS CISLUNARES
// ==========================================================================================

import { apiDotnet } from './axiosService';

// Interface da entidade Nó conforme contrato da API .NET (mesma estrutura JSON).
export interface NoRedeDotnet {
  id?: number;
  name: string;
  location: string;
  bufferedPackets: number;
  status?: string;
}

// ========================================================================================
// READ — Busca todos os nós cadastrados na rede DTN via API .NET.
// ========================================================================================
export async function buscarNosDotnet(): Promise<NoRedeDotnet[]> {
  const response = await apiDotnet.get<NoRedeDotnet[]>('/nodes');
  return response.data;
}

// ========================================================================================
// READ — Busca um nó específico pelo seu identificador único via API .NET.
// ========================================================================================
export async function buscarNoPorIdDotnet(id: number): Promise<NoRedeDotnet> {
  const response = await apiDotnet.get<NoRedeDotnet>(`/nodes/${id}`);
  return response.data;
}

// ========================================================================================
// CREATE — Registra um novo nó gateway na rede DTN via API .NET.
// ========================================================================================
export async function criarNoDotnet(novoNo: Omit<NoRedeDotnet, 'id'>): Promise<NoRedeDotnet> {
  const response = await apiDotnet.post<NoRedeDotnet>('/nodes', novoNo);
  return response.data;
}

// ========================================================================================
// UPDATE — Atualiza os dados de um nó existente via API .NET.
// ========================================================================================
export async function atualizarNoDotnet(id: number, dadosAtualizados: Partial<NoRedeDotnet>): Promise<NoRedeDotnet> {
  const response = await apiDotnet.put<NoRedeDotnet>(`/nodes/${id}`, dadosAtualizados);
  return response.data;
}

// ========================================================================================
// DELETE — Remove permanentemente um nó da rede DTN via API .NET.
// O interceptor do Axios bloqueia automaticamente se houver buffer pendente.
// ========================================================================================
export async function deletarNoDotnet(id: number): Promise<void> {
  await apiDotnet.delete(`/nodes/${id}`);
}

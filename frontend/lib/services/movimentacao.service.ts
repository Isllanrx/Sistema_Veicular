import { API_ROUTES } from '../api';
import api from '../axios';

export interface Movimentacao {
  id: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  data_criacao: string;
  produtoId: number;
  usuarioId: number;
  observacao?: string;
}

export class MovimentacaoService {
  async getAll() {
    const response = await api.get(API_ROUTES.movimentacao.getAll);
    return response.data;
  }

  async getOne(id: number) {
    const response = await api.get(API_ROUTES.movimentacao.getOne(id));
    return response.data;
  }

  async create(data: Omit<Movimentacao, 'id' | 'data_criacao' | 'usuarioId'>) {
    const response = await api.post(API_ROUTES.movimentacao.create, {
      ...data,
      tipo: data.tipo.toUpperCase(),
    });
    return response.data;
  }

  async update(id: number, data: Partial<Movimentacao>) {
    const response = await api.patch(API_ROUTES.movimentacao.update(id), {
      ...data,
      tipo: data.tipo?.toUpperCase(),
    });
    return response.data;
  }

  async delete(id: number) {
    const response = await api.delete(API_ROUTES.movimentacao.delete(id));
    return response.data;
  }
} 
import { API_ROUTES } from '../api';
import api from '../axios';

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  endereco: string;
}

export interface Produto {
  id: number;
  nome: string;
  descricao?: string;
  preco: number;
  quantidade: number;
  fornecedorId: number;
  categoriaId: number;
  categoria?: Categoria;
  fornecedor?: Fornecedor;
}

export class ProdutoService {
  async getAll() {
    const response = await api.get(API_ROUTES.produto.getAll);
    return response.data;
  }

  async getOne(id: number) {
    const response = await api.get(API_ROUTES.produto.getOne(id));
    return response.data;
  }

  async create(data: Omit<Produto, 'id'>) {
    const response = await api.post(API_ROUTES.produto.create, data);
    return response.data;
  }

  async update(id: number, data: Partial<Produto>) {
    const response = await api.patch(API_ROUTES.produto.update(id), data);
    return response.data;
  }

  async delete(id: number) {
    const response = await api.delete(API_ROUTES.produto.delete(id));
    return response.data;
  }
} 
import { API_ROUTES } from '../api';
import axios from '../axios';

export interface Fornecedor {
  id: number;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  endereco: string;
}

export class FornecedorService {
  async getAll() {
    const response = await axios.get(API_ROUTES.fornecedor.getAll);
    return response.data;
  }

  async getOne(id: number) {
    const response = await axios.get(API_ROUTES.fornecedor.getOne(id));
    return response.data;
  }

  async create(data: Omit<Fornecedor, 'id'>) {
    const response = await axios.post(API_ROUTES.fornecedor.create, data);
    return response.data;
  }

  async update(id: number, data: Partial<Fornecedor>) {
    const response = await axios.patch(API_ROUTES.fornecedor.update(id), data);
    return response.data;
  }

  async delete(id: number) {
    const response = await axios.delete(API_ROUTES.fornecedor.delete(id));
    return response.data;
  }
} 
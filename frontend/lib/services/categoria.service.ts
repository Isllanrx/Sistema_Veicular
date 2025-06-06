import { API_ROUTES } from '../api';
import axios from '../axios';

export interface Categoria {
  id: number;
  nome: string;
  descricao?: string;
}

export class CategoriaService {
  async getAll() {
    const response = await axios.get(API_ROUTES.categoria.getAll);
    return response.data;
  }

  async getOne(id: number) {
    const response = await axios.get(API_ROUTES.categoria.getOne(id));
    return response.data;
  }

  async create(data: Omit<Categoria, 'id'>) {
    const response = await axios.post(API_ROUTES.categoria.create, data);
    return response.data;
  }

  async update(id: number, data: Partial<Categoria>) {
    const response = await axios.patch(API_ROUTES.categoria.update(id), data);
    return response.data;
  }

  async delete(id: number) {
    const response = await axios.delete(API_ROUTES.categoria.delete(id));
    return response.data;
  }
} 
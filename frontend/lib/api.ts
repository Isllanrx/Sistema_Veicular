const API_URL = "http://localhost:3000";

export const API_ROUTES = {
  auth: {
    login: `${API_URL}/auth/login`,
  },
  usuario: {
    create: `${API_URL}/usuario`,
    getAll: `${API_URL}/usuario`,
    getOne: (id: number) => `${API_URL}/usuario/${id}`,
    update: `${API_URL}/usuario`,
    delete: (id: number) => `${API_URL}/usuario/${id}`,
  },
  categoria: {
    create: `${API_URL}/categoria`,
    getAll: `${API_URL}/categoria`,
    getOne: (id: number) => `${API_URL}/categoria/${id}`,
    update: (id: number) => `${API_URL}/categoria/${id}`,
    delete: (id: number) => `${API_URL}/categoria/${id}`,
  },
  produto: {
    create: `${API_URL}/produto`,
    getAll: `${API_URL}/produto`,
    getOne: (id: number) => `${API_URL}/produto/${id}`,
    update: (id: number) => `${API_URL}/produto/${id}`,
    delete: (id: number) => `${API_URL}/produto/${id}`,
  },
  fornecedor: {
    create: `${API_URL}/fornecedor`,
    getAll: `${API_URL}/fornecedor`,
    getOne: (id: number) => `${API_URL}/fornecedor/${id}`,
    update: (id: number) => `${API_URL}/fornecedor/${id}`,
    delete: (id: number) => `${API_URL}/fornecedor/${id}`,
  },
  movimentacao: {
    create: `${API_URL}/movimentacao`,
    getAll: `${API_URL}/movimentacao`,
    getOne: (id: number) => `${API_URL}/movimentacao/${id}`,
    update: (id: number) => `${API_URL}/movimentacao/${id}`,
    delete: (id: number) => `${API_URL}/movimentacao/${id}`,
  },
}; 
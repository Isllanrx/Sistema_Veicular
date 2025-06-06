import axios from '../axios';
import { API_ROUTES } from '../api';
import { setToken, getToken, removeToken, isAuthenticated } from '../auth';

export interface LoginDto {
  email: string;
  senha: string;
}

export interface AuthResponse {
  statusCode: number;
  code?: number;
  message: string;
  token?: string;
}

export class AuthService {
  async login(loginDto: LoginDto): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        API_ROUTES.auth.login,
        loginDto
      );
      if (response.data.token) {
        setToken(response.data.token);
      }
      return response.data;
    } catch (error: any) {
      return error.response?.data || {
        statusCode: 500,
        message: "Erro ao fazer login",
      };
    }
  }

  async register(registerDto: LoginDto & { nome: string }): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        API_ROUTES.usuario.create,
        registerDto
      );
      return {
        statusCode: response.data.code || 200,
        message: response.data.message
      };
    } catch (error: any) {
      return error.response?.data || {
        statusCode: 500,
        message: "Erro ao cadastrar usuário",
      };
    }
  }

  getToken = getToken;
  setToken = setToken;
  removeToken = removeToken;
  isAuthenticated = isAuthenticated;
} 
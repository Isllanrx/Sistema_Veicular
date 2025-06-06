import { API_ROUTES } from '../api';
import { getToken, isAuthenticated, removeToken, setToken } from '../auth';
import axios from '../axios';

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
      
      if (!response.data) {
        throw new Error('Resposta inválida do servidor');
      }

      if (response.data.token) {
        setToken(response.data.token);
      }

      return {
        statusCode: response.data.statusCode || 200,
        message: response.data.message || 'Login realizado com sucesso',
        token: response.data.token
      };
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      
      if (error.response?.data) {
        return {
          statusCode: error.response.status,
          message: error.response.data.message || 'Erro ao fazer login',
          token: undefined
        };
      }

      if (error.message) {
        return {
          statusCode: 500,
          message: error.message,
          token: undefined
        };
      }

      return {
        statusCode: 500,
        message: 'Erro ao fazer login. Tente novamente mais tarde.',
        token: undefined
      };
    }
  }

  async register(registerDto: LoginDto & { nome: string }): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(
        API_ROUTES.usuario.create,
        registerDto
      );
      
      if (!response.data) {
        throw new Error('Resposta inválida do servidor');
      }

      return {
        statusCode: response.data.code || 200,
        message: response.data.message || 'Usuário cadastrado com sucesso'
      };
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      
      if (error.response?.data) {
        return {
          statusCode: error.response.status,
          message: error.response.data.message || 'Erro ao cadastrar usuário'
        };
      }

      if (error.message) {
        return {
          statusCode: 500,
          message: error.message
        };
      }

      return {
        statusCode: 500,
        message: 'Erro ao cadastrar usuário. Tente novamente mais tarde.'
      };
    }
  }

  getToken = getToken;
  setToken = setToken;
  removeToken = removeToken;
  isAuthenticated = isAuthenticated;
} 
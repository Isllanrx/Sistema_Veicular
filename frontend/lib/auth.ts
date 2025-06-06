import Cookies from 'js-cookie';

const TOKEN_KEY = "token";

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7 }); // Expira em 7 dias
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getToken();
} 
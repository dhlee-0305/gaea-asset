import type { UserData } from '../types/user';

const TOKEN_KEY = 'token';

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export function parseJwt(token: string) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT 파싱 오류:', e);
    return null;
  }
}

export const getUserInfo = (): UserData | null => {
  const token = getToken();
  if (!token) return null;

  return parseJwt(token) ?? null;
};

export const isAdminRole = (): boolean => {
  const roleCode = getUserInfo()?.roleCode;
  if (!roleCode) return false;

  return roleCode === '02' || roleCode === '03';
};

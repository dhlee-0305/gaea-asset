import { USER_ROLE } from '../constants';
import { type UserData } from '../types/user';

const TOKEN_KEY = 'token';

export const saveToken = (token: string) => {
  const now = new Date();
  const item = {
    token: token,
    expireTime: now.getTime() + 1000 * 60 * 60, // 1시간
  };

  localStorage.setItem(TOKEN_KEY, JSON.stringify(item));
};

export const getToken = () => {
  const itemStr = localStorage.getItem(TOKEN_KEY);
  if (!itemStr) {
    return null;
  }

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expireTime) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    return item.token;
  } catch (e) {
    console.error('토큰 파싱 실패:', e);
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
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

  return (
    roleCode === USER_ROLE.ASSET_MANAGER ||
    roleCode === USER_ROLE.SYSTEM_MANAGER
  );
};

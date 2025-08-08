import axios from 'axios';

import { getToken, removeToken, isTokenExpired } from '@/common/utils/auth';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  timeout: 5000,
  headers: { 'content-Type': 'application/json' },
  withCredentials: true,
});

// 로그인 체크에서 제외할 URL 경로들
const excludedUrls: string[] = [
  '/auth/login',
  '/auth/password',
  '/auth/password/reset',
  // 필요시 URL 추가
];

api.interceptors.request.use((config) => {
  const token = getToken();
  const isLoggedIn = token && !isTokenExpired(token);

  // 제외 대상 URL인지 확인
  const requestUrl = config.url || '';
  const isExcluded = excludedUrls.includes(requestUrl);

  if (!isLoggedIn && !isExcluded) {
    removeToken();
    window.location.href = '/login';
    return Promise.reject(new Error('로그인 토큰이 만료되었습니다.'));
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

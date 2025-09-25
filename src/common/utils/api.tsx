import axios from 'axios';

import { getToken, saveToken, removeToken } from '@/common/utils/auth';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
  timeout: 5000,
  headers: { 'content-Type': 'application/json' },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response.status === 401) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}` + '/auth/refresh',
          {},
          { withCredentials: true },
        );
        if (res.data.resultCode === '200') {
          const newToken = res.data.data;
          saveToken(newToken);
          err.config.headers.Authorization = `Bearer ${newToken}`;
          return api(err.config);
        } else {
          removeToken();
          window.location.href = '/login';
        }
      } catch (refreshErr) {
        console.log('refreshErr catch : ', refreshErr);
        removeToken();
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  },
);

export default api;

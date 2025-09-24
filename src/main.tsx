import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import App from './App.tsx';

import { AuthProvider } from '@/common/utils/AuthProvider.tsx';
import store from '@/store/index.tsx';
import 'dayjs/locale/ko';

// 전역 스타일 import
import '@/styles/variables.css';
import '@/styles/globals.css';

dayjs.locale('ko');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);

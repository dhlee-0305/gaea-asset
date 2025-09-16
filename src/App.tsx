import { CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { getToken, isTokenExpired } from './common/utils/auth';
import AppRoute from './AppRoute';
import type { AppDispatch } from './store';
import { fetchCommonCodes } from './store/commonCodeSlice';

import AtomDialog from '@/components/common/AtomDialog';

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = getToken();
    const isLoggedIn = token && !isTokenExpired(token);
    if (isLoggedIn) {
      // 공통코드 조회
      dispatch(fetchCommonCodes());
    }
  }, [dispatch]);

  return (
    <>
      <CssBaseline />
      <AppRoute />
      <AtomDialog />
    </>
  );
}

export default App;

import { Outlet, Navigate } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';

import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';
import { getToken, isTokenExpired } from '@/common/utils/auth';

export default function Layout() {
  const token = getToken();
  const isLoggedIn = token && !isTokenExpired(token);

  if (!isLoggedIn) {
    return <Navigate to='/login' replace />;
  }

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Sidebar />
        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

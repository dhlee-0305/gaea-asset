import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';

import Sidebar from '@/components/common/Sidebar';
import Header from '@/components/common/Header';

export default function Layout() {
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

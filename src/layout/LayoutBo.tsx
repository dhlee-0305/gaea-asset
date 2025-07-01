import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';

import Sidebar from '@/components/bo/Sidebar';
import Header from '@/components/bo/Header';

export default function LayoutBo() {
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

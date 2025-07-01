import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';

import Sidebar from '@/components/fo/Sidebar';
import Header from '@/components/fo/Header';

export default function LayoutFo() {
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

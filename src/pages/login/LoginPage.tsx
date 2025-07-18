import { Box } from '@mui/material';

import Header from '@/components/common/Header';
import LoginForm from '@/pages/login/LoginForm';

export default function LoginPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <LoginForm />
    </Box>
  );
}

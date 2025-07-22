import { Box } from '@mui/material';

import Header from '@/components/common/Header';
import ChangePasswordForm from '@/pages/login/ChangePasswordForm';

export default function ChangePasswordPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <ChangePasswordForm />
    </Box>
  );
}

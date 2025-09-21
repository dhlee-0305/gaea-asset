import { Box } from '@mui/material';

import Header from '@/components/common/Header';
import UserVerificationForm from '@/pages/login/UserVerificationForm';

export default function UserVerificationPage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <UserVerificationForm />
    </Box>
  );
}

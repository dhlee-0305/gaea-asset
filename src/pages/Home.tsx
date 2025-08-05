import { Box, Grid } from '@mui/material';

import PageHeader from '@/components/common/PageHeader';
import NoticePreview from '@/components/home/NoticePreview';
import DevicesPreview from '@/components/home/DevicesPreview';
import ApprovalStatusPreview from '@/components/home/ApprovalStatusPreview';
import { getUserInfo } from '@/common/utils/auth';

export default function Home() {
  const userInfo = getUserInfo();

  return (
    <>
      <PageHeader contents='메인 화면' />
      <Box padding={3}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <DevicesPreview />
          </Grid>
          <Grid size={6}>
            <NoticePreview />
          </Grid>
          <Grid size={12}>
            {userInfo?.roleCode != '00' && <ApprovalStatusPreview />}
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

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
          <Grid size={{ xs: 12, xl: 6 }}>
            <Box sx={{ minWidth: 560 }}>
              <DevicesPreview />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, xl: 6 }}>
            <Box sx={{ minWidth: 560 }}>
              <NoticePreview />
            </Box>
          </Grid>
          <Grid size={12}>
            <Box sx={{ minWidth: 560 }}>
              {userInfo?.roleCode != '00' && <ApprovalStatusPreview />}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

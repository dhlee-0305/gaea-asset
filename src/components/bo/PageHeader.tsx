import { Box, Typography } from '@mui/material';

export default function PageHeader({ contents }: { contents: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
      <Typography variant='h5' fontWeight='bold'>
        {contents}
      </Typography>
    </Box>
  );
}

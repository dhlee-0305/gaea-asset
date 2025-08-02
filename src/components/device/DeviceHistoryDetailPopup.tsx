import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import type { DeviceHistoryData } from '@/common/types/device';

interface DeviceHistoryDetailPopupProps {
  open: boolean;
  onClose: () => void;
  historyData: DeviceHistoryData | null;
}

export default function DeviceHistoryDetailPopup({
  open,
  onClose,
  historyData,
}: DeviceHistoryDetailPopupProps) {
  if (!historyData) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          이력 상세
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Box sx={{ p: 1 }}>
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ minWidth: 100, fontWeight: 'bold' }}>
              장비 번호:
            </Typography>
            <Typography variant="body2">
              {historyData.deviceNum}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ minWidth: 100, fontWeight: 'bold' }}>
              장비 유형:
            </Typography>
            <Typography variant="body2">
              {historyData.deviceType}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ minWidth: 100, fontWeight: 'bold' }}>
              모델명:
            </Typography>
            <Typography variant="body2">
              {historyData.modelName || '-'}
            </Typography>
          </Box>
          
          {historyData.changeContents && (
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ minWidth: 100, fontWeight: 'bold' }}>
                변경 내용:
              </Typography>
              <Typography variant="body2">
                {historyData.changeContents}
              </Typography>
            </Box>
          )}
          
          {historyData.reason && (
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Typography variant="subtitle2" sx={{ minWidth: 100, fontWeight: 'bold' }}>
                사유:
              </Typography>
              <Typography variant="body2">
                {historyData.reason}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ minWidth: 100, fontWeight: 'bold' }}>
              수정일:
            </Typography>
            <Typography variant="body2">
              {historyData.modifyDate || historyData.createDatetime?.split(' ')[0].replace(/-/g, '.') || '-'}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: '#4CAF50',
            '&:hover': {
              backgroundColor: '#45a049',
            },
          }}
        >
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
} 
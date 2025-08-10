import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { DeviceHistoryData } from '@/common/types/device';
import { showAlert } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import type { AppDispatch } from '@/store';

interface DeviceHistoryDetailPopupProps {
  open: boolean;
  onClose: () => void;
  deviceNum: number | null;
}

export default function DeviceHistoryDetailPopup({
  open,
  onClose,
  deviceNum,
}: DeviceHistoryDetailPopupProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [historyDataList, setHistoryDataList] = useState<DeviceHistoryData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && deviceNum) {
      fetchHistoryData();
    }
  }, [open, deviceNum]);

  // 장비 이력 데이터 조회
  const fetchHistoryData = async () => {
    if (!deviceNum) return;

    setLoading(true);
    try {
      const response = await api.get(`/histories/${deviceNum}`, {
        params: {
          currentPage: 1,
          pageSize: 100, // 충분히 큰 값으로 설정
        },
      });

      if (response.status === 200 && response.data.resultCode === '0000') {
        setHistoryDataList(response.data.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(
        showAlert({
          title: 'Error',
          contents: MESSAGE.error,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setHistoryDataList([]);
    onClose();
  };

  if (!deviceNum) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div">
          장비번호 [{deviceNum}] 이력 상세
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography>로딩 중...</Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table sx={{ minWidth: 800 }} aria-label='history table'>
              <TableHead>
                <TableRow>
                  <TableCell align='center'>이력번호</TableCell>
                  <TableCell align='center'>장비상태코드</TableCell>
                  <TableCell align='center'>결재상태코드</TableCell>
                  <TableCell align='center'>변경내용</TableCell>
                  <TableCell align='center'>사유</TableCell>
                  <TableCell align='center'>생성일시</TableCell>
                  <TableCell align='center'>생성자</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historyDataList.length > 0 ? (
                  historyDataList.map((historyData) => (
                    <TableRow
                      key={historyData.historyNum}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align='center'>{historyData.historyNum}</TableCell>
                      <TableCell align='center'>{historyData.deviceStatus}</TableCell>
                      <TableCell align='center'>{historyData.approvalStatus}</TableCell>
                      <TableCell align='center'>{historyData.changeContents}</TableCell>
                      <TableCell align='center'>{historyData.reason}</TableCell>
                      <TableCell align='center'>{historyData.createDatetime}</TableCell>
                      <TableCell align='center'>{historyData.userName}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={7}>
                      이력 데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
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
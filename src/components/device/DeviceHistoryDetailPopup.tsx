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
  TableRow,
  Paper,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { DeviceHistoryData } from '@/common/types/device';
import { showAlert } from '@/store/dialogAction';
import { MESSAGE, CODE } from '@/common/constants';
import type { AppDispatch } from '@/store';

interface DeviceHistoryDetailPopupProps {
  open: boolean;
  onClose: () => void;
  historyNum: number | null;
}

export default function DeviceHistoryDetailPopup({
  open,
  onClose,
  historyNum,
}: DeviceHistoryDetailPopupProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [historyData, setHistoryData] = useState<DeviceHistoryData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  const getDeviceStatusName = (code?: string) => {
    if (!code) return '';
    const item = CODE.deviceStatus.find((c) => c.code === code);
    return item ? item.codeName : '';
  };

  const getApprovalStatusName = (code?: string) => {
    if (!code) return '';
    const item = CODE.approvalStatus.find((c) => c.code === code);
    return item ? item.codeName : '';
  };

  const getDeviceTypeName = (value?: string) => {
    if (!value) return '';
    const byCode = CODE.deviceType.find((c) => c.code === value);
    if (byCode) return byCode.codeName;
    const byName = CODE.deviceType.find((c) => c.codeName === value);
    return byName ? byName.codeName : value;
  };

  useEffect(() => {
    if (open && historyNum) {
      fetchHistoryData();
    }
  }, [open, historyNum]);

  // 장비 이력 단건 조회
  const fetchHistoryData = async () => {
    if (!historyNum) return;

    setLoading(true);
    try {
      const response = await api.get(`/histories/${historyNum}`);

      if (response.status === 200 && response.data.resultCode === '200') {
        // API가 data에 단건 객체를 반환한다고 가정
        setHistoryData(response.data.data);
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
    setHistoryData(null);
    onClose();
  };

  if (!historyNum) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='lg'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant='h6' component='div'>
          이력번호 [{historyNum}] 상세
        </Typography>
        <IconButton
          aria-label='close'
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
              <TableBody>
                {historyData ? (
                  <>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: '30%',
                          backgroundColor: '#f5f5f5',
                          fontWeight: 600,
                        }}
                      >
                        장비유형/모델명
                      </TableCell>
                      <TableCell>
                        {[
                          getDeviceTypeName(historyData.deviceType),
                          ` (${historyData.modelName})`,
                        ]
                          .filter((v) => !!v)
                          .join(', ') || '없음'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: '30%',
                          backgroundColor: '#f5f5f5',
                          fontWeight: 600,
                        }}
                      >
                        장비번호
                      </TableCell>
                      <TableCell>{historyData.deviceNum || '없음'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ backgroundColor: '#f5f5f5', fontWeight: 600 }}
                      >
                        사용자
                      </TableCell>
                      <TableCell>
                        {historyData.userName || '없음'}
                        {historyData.empNum
                          ? ` (사번 ${historyData.empNum})`
                          : ''}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ backgroundColor: '#f5f5f5', fontWeight: 600 }}
                      >
                        장비 상태
                      </TableCell>
                      <TableCell>
                        {getDeviceStatusName(historyData.deviceStatusCode) ||
                          historyData.deviceStatus ||
                          '없음'}
                        {historyData.deviceStatusCode
                          ? ` (${historyData.deviceStatusCode})`
                          : ''}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ backgroundColor: '#f5f5f5', fontWeight: 600 }}
                      >
                        결재 상태
                      </TableCell>
                      <TableCell>
                        {getApprovalStatusName(
                          historyData.approvalStatusCode,
                        ) ||
                          historyData.approvalStatus ||
                          '없음'}
                        {historyData.approvalStatusCode
                          ? ` (${historyData.approvalStatusCode})`
                          : ''}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ backgroundColor: '#f5f5f5', fontWeight: 600 }}
                      >
                        변경 내용
                      </TableCell>
                      <TableCell>
                        {historyData.changeContents || '없음'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ backgroundColor: '#f5f5f5', fontWeight: 600 }}
                      >
                        사유
                      </TableCell>
                      <TableCell>{historyData.reason || '없음'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ backgroundColor: '#f5f5f5', fontWeight: 600 }}
                      >
                        생성 일시
                      </TableCell>
                      <TableCell>
                        {historyData.createDatetime || '없음'}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ backgroundColor: '#f5f5f5', fontWeight: 600 }}
                      >
                        생성자
                      </TableCell>
                      <TableCell>{historyData.createUser ?? '없음'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell
                        sx={{ backgroundColor: '#f5f5f5', fontWeight: 600 }}
                      >
                        이력번호
                      </TableCell>
                      <TableCell>{historyData.historyNum}</TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell align='center' colSpan={2}>
                      이력 데이터를 불러오지 못했습니다.
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
          variant='contained'
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

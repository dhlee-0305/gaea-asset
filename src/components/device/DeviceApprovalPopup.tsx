import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { deviceLabels, type DeviceData } from '@/common/types/device';
import type { AppDispatch } from '@/store';
import { showAlert, showConfirm } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import api from '@/common/utils/api';

export default function DeviceApprovalPopup({
  isOpen,
  onClose,
  orgData,
}: {
  isOpen: boolean;
  onClose: () => void;
  orgData: DeviceData;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { deviceNum } = useParams();
  const [deviceApprovaldata, setDeviceApprovaldata] =
    useState<DeviceData | null>(null);

  useEffect(() => {
    if (isOpen) {
      getDeviceApprovalData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 데이터 조회
  const getDeviceApprovalData = async () => {
    try {
      const response = await api.get(`/devices/${deviceNum}/draft`);
      if (response.status === 200 && response.data.resultCode === '0000') {
        setDeviceApprovaldata(response.data.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(
        showAlert({
          title: 'Error',
          contents: MESSAGE.error,
        }),
      );
    }
  };

  const rows = Object.keys(deviceLabels).map((key) => {
    const field = key as keyof DeviceData;
    return {
      label: deviceLabels[field],
      original: orgData?.[field] ?? '-',
      new: deviceApprovaldata?.[field] ?? '-',
    };
  });

  // 승인/반려 버튼 클릭 핸들러
  const handleDecision = async (action: 'approve' | 'reject') => {
    const confirmed = await dispatch(
      showConfirm({
        contents:
          action === 'approve' ? '승인하시겠습니까?' : '반려하시겠습니까?',
      }),
    );

    if (!confirmed) return;

    try {
      const url =
        action === 'approve'
          ? `/devices/${deviceNum}/approval`
          : `/devices/${deviceNum}/rejection`;

      const response = await api.post(url, deviceApprovaldata);

      if (response.status === 200 && response.data.resultCode === '0000') {
        dispatch(
          showAlert({
            contents:
              action === 'approve' ? '승인되었습니다.' : '반려되었습니다.',
          }),
        );
        onClose();
      } else {
        dispatch(
          showAlert({
            title: 'Error',
            contents: response.data.description,
          }),
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(
        showAlert({
          title: 'Error',
          contents: MESSAGE.error,
        }),
      );
    }
  };

  return (
    <Dialog open={isOpen} fullWidth maxWidth='md'>
      <DialogTitle>장비 승인 요청</DialogTitle>
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>항목</TableCell>
                <TableCell>기존 데이터</TableCell>
                <TableCell>변경 데이터</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>{row.label}</TableCell>
                  <TableCell>{row.original}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: row.original !== row.new ? 'bold' : 'normal',
                      color: row.original !== row.new ? 'red' : 'inherit',
                    }}
                  >
                    {row.new}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={() => handleDecision('approve')}>
          승인
        </Button>
        <Button
          variant='contained'
          color='error'
          onClick={() => handleDecision('reject')}
        >
          반려
        </Button>
      </DialogActions>
    </Dialog>
  );
}

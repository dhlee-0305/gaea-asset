import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '@/common/utils/api';
import type { DeviceHistoryData } from '@/common/types/device';

export default function ApprovalStatusPreview() {
  const navigate = useNavigate();
  const [approvalList, setApprovalList] = useState<DeviceHistoryData[]>([]);

  useEffect(() => {
    fetchApprovalData();
  }, []);

  const fetchApprovalData = async () => {
    try {
      const response = await api.get('/histories', {
        params: {
          currentPage: 1,
          pageSize: 5,
        },
      });

      if (response.status === 200 && response.data.resultCode === '0000') {
        const myApprovals = response.data.data.filter(
          (history: DeviceHistoryData) =>
            history.approvalStatus !== '승인완료' &&
            history.approvalStatus !== '반려',
        );
        setApprovalList(myApprovals);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleViewAll = () => {
    navigate('/device-management/device-history');
  };

  const handleClickRow = (deviceNum: string) => {
    navigate(`/device-management/devices/${deviceNum}`);
  };

  return (
    <Box border='1px solid #ccc' padding={2} borderRadius={2}>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={1}
      >
        <Typography variant='h6'>
          <TaskAltIcon sx={{ mr: 1 }} />
          승인 현황
        </Typography>
        <Button size='small' onClick={handleViewAll}>
          전체보기
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>장비번호</TableCell>
              <TableCell align='center'>장비상태</TableCell>
              <TableCell align='center'>결재상태</TableCell>
              <TableCell align='center'>변경일시</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {approvalList.length === 0 ? (
              <TableRow sx={{ height: 35 }}>
                <TableCell colSpan={4} align='center'>
                  현재 결재 중인 항목이 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              approvalList.slice(0, 5).map((item) => (
                <TableRow
                  key={item.historyNum}
                  hover
                  sx={{ cursor: 'pointer', height: 35 }}
                  onClick={() => handleClickRow(item.deviceNum)}
                >
                  <TableCell align='center'>{item.deviceNum}</TableCell>
                  <TableCell align='center'>{item.deviceStatus}</TableCell>
                  <TableCell align='center'>{item.approvalStatus}</TableCell>
                  <TableCell align='center'>
                    {item.createDatetime
                      ? item.createDatetime.split(' ')[0].replace(/-/g, '.')
                      : ''}
                  </TableCell>
                </TableRow>
              ))
            )}
            {[...Array(5 - approvalList.length)].map((_, index) => (
              <TableRow key={`empty-${index}`} sx={{ height: 35 }}>
                <TableCell colSpan={4} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

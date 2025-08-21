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
import DevicesIcon from '@mui/icons-material/Devices';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '@/common/utils/api';
import type { DeviceData } from '@/common/types/device';

export default function DevicesPreview() {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getDeivceList();
  }, []);

  const getDeivceList = async () => {
    try {
      const response = await api.get('/devices', {
        params: {
          currentPage: 1,
          pageSize: 5,
        },
      });
      if (response.status === 200 && response.data.resultCode === '0000') {
        setDevices(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewAll = () => {
    navigate('/device-management/devices');
  };

  const handleRowClick = (deviceNum: string) => {
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
          <DevicesIcon sx={{ mr: 1 }} />
          장비
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
              <TableCell align='center'>담당자</TableCell>
              <TableCell align='center'>장비상태</TableCell>
              <TableCell align='center'>유형</TableCell>
              <TableCell align='center'>결재상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.length > 0 ? (
              <>
                {devices.map((device) => (
                  <TableRow
                    key={device.deviceNum}
                    hover
                    onClick={() => handleRowClick(String(device.deviceNum))}
                    sx={{ cursor: 'pointer', height: 35 }}
                  >
                    <TableCell align='center'>{device.deviceNum}</TableCell>
                    <TableCell align='center'>{device.userName}</TableCell>
                    <TableCell align='center'>{device.deviceStatus}</TableCell>
                    <TableCell align='center'>{device.deviceType}</TableCell>
                    <TableCell align='center'>
                      {device.approvalStatus}
                    </TableCell>
                  </TableRow>
                ))}
                {[...Array(5 - devices.length)].map((_, index) => (
                  <TableRow key={`empty-${index}`} sx={{ height: 35 }}>
                    <TableCell colSpan={5} />
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell align='center' colSpan={5}>
                  보유 중인 장비가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

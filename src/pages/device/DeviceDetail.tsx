import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import api from '@/common/utils/api';
import PageHeader from '@/components/common/PageHeader';
import type { AppDispatch } from '@/store';
import { showAlert, showConfirm } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import type { DeviceData } from '@/common/types/device';
import DeviceApprovalPopup from '@/components/device/DeviceApprovalPopup';

export default function DeviceDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { deviceNum } = useParams();
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const isUpdatable = !(
    deviceData?.approvalStatusCode === 'A1' ||
    deviceData?.approvalStatusCode === 'A2'
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 데이터 조회
  const fetchData = async () => {
    try {
      const response = await api.get(`/devices/${deviceNum}`);

      if (response.status === 200 && response.data.resultCode === '0000') {
        setDeviceData(response.data.data);
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

  // 수정 버튼 클릭 핸들러
  const handleMoveUpdate = (): void => {
    navigate(`/device-management/devices/${deviceNum}/update`);
  };

  // 목록 버튼 클릭 핸들러
  const handleMoveList = (): void => {
    navigate('/device-management/devices');
  };

  // 장비 변경 승인 팝업 열기 핸들러
  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  // 장비 변경 승인 팝업 닫기 핸들러
  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDelete = async (): Promise<void> => {
    const confirmed = await dispatch(
      showConfirm({ contents: '삭제하시겠습니까?' }),
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      const response = await api.delete(`/devices/${deviceNum}`);

      setIsLoading(false);

      if (response.status === 200 && response.data.resultCode === '0000') {
        await dispatch(
          showAlert({
            contents: '장비 정보가 삭제되었습니다.',
          }),
        );
        navigate('/device-management/devices');
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      dispatch(
        showAlert({
          title: 'Error',
          contents: MESSAGE.error,
        }),
      );
    }
  };

  return (
    <>
      <PageHeader contents='장비 상세' />
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper sx={{ p: 4, mb: 4 }} elevation={4}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <Typography color='textSecondary'>장비번호</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.deviceNum}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>장비담당자</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.userName}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>장비유형</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.deviceType}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>사용용도</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.usagePurpose}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>기존 장비관리번호</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.oldDeviceId}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>모델명</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.modelName}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>제조년도</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.manufactureDate}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>CPU</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.cpuSpec}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>메모리</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.memorySize}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>SSD/HDD</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.storageInfo}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>OS</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.operatingSystem}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>인치</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.screenSize}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>구매일자</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>
                {deviceData?.purchaseDate &&
                  dayjs(deviceData.purchaseDate).format('YYYY.MM.DD')}
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>반납일자</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>
                {deviceData?.returnDate &&
                  dayjs(deviceData.returnDate).format('YYYY.MM.DD')}
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>비고</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.remarks}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>장비 상태</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.deviceStatus}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography color='textSecondary'>결재 상태</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{deviceData?.approvalStatus}</Typography>
            </Grid>
          </Grid>
          <Box
            sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}
          >
            {!isUpdatable && (
              <Button
                variant='outlined'
                color='error'
                onClick={handleOpenDialog}
              >
                승인
              </Button>
            )}
            <Button variant='outlined' onClick={handleMoveList}>
              목록
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleMoveUpdate}
              disabled={!isUpdatable}
            >
              수정
            </Button>
            <Button
              variant='contained'
              color='error'
              onClick={handleDelete}
              loading={isLoading}
              loadingPosition='start'
            >
              삭제
            </Button>
          </Box>
          {deviceData && (
            <DeviceApprovalPopup
              isOpen={isOpen}
              onClose={handleCloseDialog}
              orgData={deviceData}
            />
          )}
        </Paper>
      </Box>
    </>
  );
}

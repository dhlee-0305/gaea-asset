import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import api from '@/common/utils/api';
import PageHeader from '@/components/common/PageHeader';
import type { AppDispatch } from '@/store';
import { showAlert, showConfirm } from '@/store/dialogAction';
import { DEVICE_APPROVAL_STATUS, MESSAGE, USER_ROLE } from '@/common/constants';
import type { DeviceData } from '@/common/types/device';
import DeviceApprovalPopup from '@/components/device/DeviceApprovalPopup';
import { getUserInfo, isAdminRole } from '@/common/utils/auth';
import {
  LabelCell,
  SectionTitle,
  ValueCell,
} from '@/components/common/TableComponents';

export default function DeviceDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { deviceNum } = useParams();
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = getUserInfo();
  const userRoleCode = userInfo?.roleCode;
  const isAdmin = isAdminRole();

  // 수정 가능 여부 : 결재 상태가 승인 대기면 수정 불가
  const isUpdatable = !(
    deviceData?.approvalStatusCode ===
      DEVICE_APPROVAL_STATUS.TEAM_MANAGER_PENDING ||
    deviceData?.approvalStatusCode === DEVICE_APPROVAL_STATUS.ADMIN_PENDING
  );

  // 승인 버튼 노출 조건
  // 부서장 승인 대기 -> 부서장(01) 노출
  // 관리자 승인 대기 -> 관리자(02/03) 노출
  const canShowApproveButton =
    (deviceData?.approvalStatusCode ===
      DEVICE_APPROVAL_STATUS.TEAM_MANAGER_PENDING &&
      userRoleCode === USER_ROLE.TEAM_MANAGER) ||
    (deviceData?.approvalStatusCode === DEVICE_APPROVAL_STATUS.ADMIN_PENDING &&
      isAdmin);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 데이터 조회
  const fetchData = async () => {
    try {
      const response = await api.get(`/devices/${deviceNum}`);

      if (response.status === 200 && response.data.resultCode === '200') {
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

      if (response.status === 200 && response.data.resultCode === '200') {
        await dispatch(
          showAlert({
            contents: '장비 정보가 삭제되었습니다.',
          }),
        );
        navigate('/device-management/devices');
      } else {
        await dispatch(
          showAlert({
            title: 'Error',
            contents: response.data.description,
          }),
        );
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
      <Box sx={{ maxWidth: 1000, mx: 'auto', mb: 4 }}>
        <Paper sx={{ p: 4 }} elevation={4}>
          <SectionTitle>기본 정보</SectionTitle>
          <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <LabelCell>장비번호</LabelCell>
                  <ValueCell colSpan={3}>{deviceData?.deviceNum}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>장비담당자</LabelCell>
                  <ValueCell colSpan={3}>{deviceData?.userName}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>장비상태</LabelCell>
                  <ValueCell>{deviceData?.deviceStatus}</ValueCell>
                  <LabelCell>장비유형</LabelCell>
                  <ValueCell>{deviceData?.deviceType}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>용도구분</LabelCell>
                  <ValueCell>{deviceData?.usageDivision}</ValueCell>
                  <LabelCell>사용용도</LabelCell>
                  <ValueCell>{deviceData?.usagePurpose}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>사용/보관 위치</LabelCell>
                  <ValueCell>{deviceData?.archiveLocation}</ValueCell>
                  <LabelCell>기존 장비관리번호</LabelCell>
                  <ValueCell>{deviceData?.oldDeviceId}</ValueCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle>제원 정보</SectionTitle>
          <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <LabelCell>제조년도</LabelCell>
                  <ValueCell>{deviceData?.manufactureDate}</ValueCell>
                  <LabelCell>제조사</LabelCell>
                  <ValueCell>{deviceData?.manufacturer}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>모델명</LabelCell>
                  <ValueCell>{deviceData?.modelName}</ValueCell>
                  <LabelCell>인치</LabelCell>
                  <ValueCell>{deviceData?.screenSize}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>CPU</LabelCell>
                  <ValueCell>{deviceData?.cpuSpec}</ValueCell>
                  <LabelCell>메모리</LabelCell>
                  <ValueCell>{deviceData?.memorySize}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>SSD/HDD</LabelCell>
                  <ValueCell>{deviceData?.storageInfo}</ValueCell>
                  <LabelCell>GPU</LabelCell>
                  <ValueCell>{deviceData?.gpuSpec}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>OS</LabelCell>
                  <ValueCell colSpan={3}>
                    {deviceData?.operatingSystem}
                  </ValueCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <SectionTitle>관리 정보</SectionTitle>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableBody>
                <TableRow>
                  <LabelCell>구매일자</LabelCell>
                  <ValueCell>
                    {deviceData?.purchaseDate &&
                      dayjs(deviceData.purchaseDate).format('YYYY.MM.DD')}
                  </ValueCell>
                  <LabelCell>반납일자</LabelCell>
                  <ValueCell>
                    {deviceData?.returnDate &&
                      dayjs(deviceData.returnDate).format('YYYY.MM.DD')}
                  </ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>결재 상태</LabelCell>
                  <ValueCell colSpan={3}>
                    {deviceData?.approvalStatus}
                  </ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>비고</LabelCell>
                  <ValueCell colSpan={3}>{deviceData?.remarks}</ValueCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1 }}
          >
            {canShowApproveButton && (
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
            {(isAdmin || deviceData?.empNum === userInfo?.empNum) && (
              <Button
                variant='contained'
                color='primary'
                onClick={handleMoveUpdate}
                disabled={!isUpdatable}
              >
                수정
              </Button>
            )}
            {isAdmin && (
              <Button
                variant='contained'
                color='error'
                onClick={handleDelete}
                loading={isLoading}
                loadingPosition='start'
              >
                삭제
              </Button>
            )}
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

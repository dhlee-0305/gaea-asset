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

import api from '@/common/utils/api';
import type { UserData } from '@/common/types/user';
import PageHeader from '@/components/common/PageHeader';
import type { AppDispatch } from '@/store';
import { showAlert, showConfirm } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import { LabelCell, ValueCell } from '@/components/common/TableComponents';

export default function UserDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userNo } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    userData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터 검색
  const userData = async () => {
    try {
      const response = await api.get(`/users/${userNo}`);

      if (response.status === 200) {
        const resData = response.data;
        if (resData.resultCode === '200') {
          setUserData(resData.data.userInfo);
        } else if (resData.resultCode === '204') {
          await dispatch(
            showAlert({
              contents: resData.description,
            }),
          );
          navigate('/');
        } else {
          dispatch(
            showAlert({
              contents: resData.description,
            }),
          );
        }
      } else {
        dispatch(
          showAlert({
            title: 'Error',
            contents: MESSAGE.error,
          }),
        );
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

  // 비밀번호 초기화 버튼 클릭 핸들러
  const handleInitPassword = async (): Promise<void> => {
    try {
      const url = '/users/initPassword';
      setIsLoading(true);
      const response = await api.put(url, data);
      setIsLoading(false);

      if (response.status === 200) {
        const resData = response.data;
        if (resData.resultCode === '200') {
          await dispatch(
            showAlert({
              contents: '비밀번호가 초기화되었습니다.',
            }),
          );
          handleMoveList();
        } else {
          await dispatch(
            showAlert({
              contents: resData.description,
            }),
          );
        }
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

  // 수정 버튼 클릭 핸들러
  const handleMoveUpdate = (): void => {
    navigate(`/user-management/users/${userNo}/update`);
  };

  // 목록 버튼 클릭 핸들러
  const handleMoveList = (): void => {
    navigate('/user-management/users');
  };

  // 삭제 버튼 클릭 핸들러
  const handleDelete = async (): Promise<void> => {
    const confirmed = await dispatch(
      showConfirm({ contents: '삭제하시겠습니까?' }),
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      const response = await api.delete(`/users/${userNo}`);

      setIsLoading(false);

      if (response.status === 200 && response.data.resultCode === '200') {
        await dispatch(
          showAlert({
            contents: '사용자 정보가 삭제되었습니다.',
          }),
        );
        navigate('/user-management/users');
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
      <PageHeader contents='사용자 상세' />
      <Box sx={{ maxWidth: 1000, mx: 'auto', mb: 4 }}>
        <Paper sx={{ p: 4 }} elevation={4}>
          <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <LabelCell>아이디</LabelCell>
                  <ValueCell colSpan={3}>{data?.userId}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>이름</LabelCell>
                  <ValueCell colSpan={3}>{data?.userName}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>부서</LabelCell>
                  <ValueCell colSpan={3}>{data?.orgName}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>직급</LabelCell>
                  <ValueCell colSpan={3}>{data?.userGradeName}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>직책</LabelCell>
                  <ValueCell colSpan={3}>{data?.userPositionName}</ValueCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1 }}
          >
            <Button variant='outlined' onClick={handleMoveList}>
              목록
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={handleMoveUpdate}
            >
              수정
            </Button>
            {data?.passwordResetReq === 'Y' && (
              <Button
                variant='contained'
                color='primary'
                onClick={handleInitPassword}
              >
                비밀번호 초기화
              </Button>
            )}
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
        </Paper>
      </Box>
    </>
  );
}

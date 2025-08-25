import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { UserData } from '@/common/types/user';
import PageHeader from '@/components/common/PageHeader';
import type { AppDispatch } from '@/store';
import { showAlert, showConfirm } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';

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
        if (resData.resultCode === '0000') {
          setUserData(resData.data);
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
        if (resData.resultCode === '0000') {
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

      if (response.status === 200 && response.data.resultCode === '0000') {
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
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper sx={{ p: 4, mb: 4 }} elevation={4}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <Typography color='textSecondary'>아이디</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data?.userId}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>이름</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data?.userName}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>부서</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data?.orgName}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>직급</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data?.userGradeName}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>직책</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data?.userPositionName}</Typography>
            </Grid>
          </Grid>
          <Box
            sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}
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

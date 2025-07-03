import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { SampleData } from '@/common/types/sample';
import PageHeader from '@/components/bo/PageHeader';
import type { AppDispatch } from '@/store';
import { showAlert } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';

export default function SampleDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userNo } = useParams();
  const [data, setData] = useState<SampleData>({
    userNo: '',
    userId: '',
    userNm: '',
    phoneNo: '',
    email: '',
    deptNm: '',
    createDt: '',
    updateDt: '',
  });

  useEffect(() => {
    searchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터 검색
  const searchData = async () => {
    try {
      const response = await api.get(`/users/${userNo}`);

      if (response.status === 200) {
        setData(response.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(
        showAlert({
          title: 'Error',
          contents: MESSAGE.error,
        }),
      );

      // 임시 데이터 설정
      setData({
        userNo: '1',
        userId: 'cookie',
        userNm: '쿠키',
        phoneNo: '010-8888-9999',
        email: 'cookie@gaeasoft.co.kr',
        deptNm: '기술연구소',
        createDt: '2025.01.01',
        updateDt: '2025.01.01',
      });
    }
  };

  // 수정 화면 이동
  const handleMoveModify = (): void => {
    navigate(`/bo/user-management/users/${userNo}/update`);
  };

  // 목록 화면 이동
  const handleMoveList = (): void => {
    navigate('/bo/user-management/users');
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
              <Typography>{data.userId}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>이름</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data.userNm}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>휴대전화</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data.phoneNo}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>이메일</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data.email}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>부서</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data.deptNm}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>등록일</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data.createDt}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>수정일</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data.updateDt}</Typography>
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
              onClick={handleMoveModify}
            >
              수정
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

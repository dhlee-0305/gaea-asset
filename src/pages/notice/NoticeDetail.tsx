import { Box, Button, Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { NoticeData } from '@/common/types/notice';
import PageHeader from '@/components/common/PageHeader';
import type { AppDispatch } from '@/store';
import { showAlert, showConfirm } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';

export default function NoticeDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { noticeNum } = useParams();
  const noticeId = Number(noticeNum ?? 0);
  const [data, setData] = useState<NoticeData>({
    title: '',
    content: '',
    createDateTime: '',
    createUser: '',
  });

  useEffect(() => {
    searchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터 검색
  const searchData = async () => {
    try {
      const response = await api.get(`/getNoticeInfo/${noticeId}`);

      if (response.status === 200) {
        setData(response.data.data);
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

  // 삭제 처리
  const handleDelete = async (): Promise<void> => {
    const confirmed = await dispatch(
      showConfirm({ contents: '삭제하시겠습니까?' }),
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);
      const response = await api.delete(`/deleteNotice/${noticeId}`);

      setIsLoading(false);

      if (response.status === 200) {
        await dispatch(
          showAlert({
            contents: '공지사항이 삭제되었습니다.',
          }),
        );
        navigate('/notice/notices');
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

  // 목록 화면 이동
  const handleMoveList = (): void => {
    navigate('/notice/notices');
  };

  // 수정 화면 이동
  const handleMoveUpdate = (): void => {
    navigate(`/notice/notices/update/${noticeId}`);
  };

  return (
    <>
      <PageHeader contents='공지사항 상세' />
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <Paper sx={{ p: 4, mb: 4 }} elevation={4}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <Typography color='textSecondary'>제목</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data.title}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>부서/작성자</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data.createUser}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>등록일자</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{data.createDateTime?.slice(0, 10)}</Typography>
            </Grid>

            <Grid size={4}></Grid>
            <Grid size={50}>
              <Typography component='pre' sx={{ whiteSpace: 'pre-wrap' }}>
                {data.content}
              </Typography>
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
            <Button
              variant='contained'
              color='error'
              onClick={handleDelete}
              disabled={isLoading}
            >
              삭제
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
}

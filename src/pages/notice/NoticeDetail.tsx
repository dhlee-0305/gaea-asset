import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { NoticeData } from '@/common/types/notice';
import PageHeader from '@/components/common/PageHeader';
import type { AppDispatch } from '@/store';
import { isAdminRole } from '@/common/utils/auth';
import { showAlert, showConfirm } from '@/store/dialogAction';
import { MESSAGE, POST_TYPE } from '@/common/constants';
import { FileDownload } from '@/components/common/FileDownload';

export default function NoticeDetail() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { noticeNum } = useParams();
  const noticeId = Number(noticeNum ?? 0);
  const [noticeData, setNoticeData] = useState<NoticeData>({
    title: '',
    content: '',
    createDateTime: '',
    createUser: '',
    fileList: [],
  });
  const isAdmin = isAdminRole();

  useEffect(() => {
    searchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터 검색
  const searchData = async () => {
    try {
      const response = await api.get(`/notices/${noticeId}`);
      const { resultCode, description, data } = response.data;

      if (resultCode === '200' && data) {
        setNoticeData(data);
      } else if (resultCode === '204') {
        dispatch(
          showAlert({
            title: '알림',
            contents: description || '해당 공지사항을 찾을 수 없습니다.',
          }),
        );
        navigate('/notice/notices');
      } else {
        dispatch(
          showAlert({
            title: '알림',
            contents: description || '서버 오류가 발생했습니다.',
          }),
        );
        navigate('/notice/notices');
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
      const response = await api.delete(`/notices/${noticeId}`);
      const { resultCode, description, data } = response.data;

      setIsLoading(false);

      if (resultCode === '200' && data) {
        await dispatch(
          showAlert({
            contents: '공지사항이 삭제되었습니다.',
          }),
        );
        navigate('/notice/notices');
      } else {
        dispatch(
          showAlert({
            title: '알림',
            contents: description || '서버 오류가 발생했습니다.',
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
              <Typography>{noticeData.title}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>부서/작성자</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{noticeData.createUser}</Typography>
            </Grid>

            <Grid size={4}>
              <Typography color='textSecondary'>등록일자</Typography>
            </Grid>
            <Grid size={8}>
              <Typography>{noticeData.createDateTime}</Typography>
            </Grid>

            {noticeData.fileList && noticeData.fileList.length > 0 && (
              <>
                <Grid size={7}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                  >
                    {noticeData.fileList.map((file, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          height: 32,
                          border: '1px solid #eee',
                          borderRadius: 1,
                          padding: '2px 6px',
                        }}
                      >
                        <Typography
                          component='span'
                          onClick={() =>
                            FileDownload({
                              fileNum: file.fileNum,
                              postType: POST_TYPE.NOTICE,
                              originFileName: file.originFileName,
                              dispatch,
                            })
                          }
                          sx={{
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '80%',
                            cursor: 'pointer',
                            color: 'primary.main',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          📄 {file.originFileName}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </>
            )}

            <Grid size={4}></Grid>
            <Grid size={50}>
              <Typography component='pre' sx={{ whiteSpace: 'pre-wrap' }}>
                {noticeData.content}
              </Typography>
            </Grid>
          </Grid>
          <Box
            sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}
          >
            <Button variant='outlined' onClick={handleMoveList}>
              목록
            </Button>
            {isAdmin && (
              <Stack direction='row' spacing={1}>
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
              </Stack>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
}

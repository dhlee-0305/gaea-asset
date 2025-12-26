import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { LabelCell, ValueCell } from '@/components/common/TableComponents';
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
      <Box sx={{ maxWidth: 1000, mx: 'auto', mb: 4 }}>
        <Paper sx={{ p: 4 }} elevation={4}>
          <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <LabelCell>제목</LabelCell>
                  <ValueCell colSpan={3}>{noticeData.title}</ValueCell>
                </TableRow>
                <TableRow>
                  <LabelCell>부서/작성자</LabelCell>
                  <ValueCell>{noticeData.createUser}</ValueCell>
                  <LabelCell>등록일자</LabelCell>
                  <ValueCell>{noticeData.createDateTime}</ValueCell>
                </TableRow>
                {noticeData.fileList && noticeData.fileList.length > 0 && (
                  <TableRow>
                    <LabelCell>첨부파일</LabelCell>
                    <ValueCell colSpan={3}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        {noticeData.fileList.map((file, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
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
                                fontSize: '0.875rem',
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
                    </ValueCell>
                  </TableRow>
                )}
                <TableRow>
                  <LabelCell>내용</LabelCell>
                  <TableCell
                    colSpan={3}
                    sx={{
                      p: 3,
                      border: '1px solid rgba(224, 224, 224, 1)',
                      verticalAlign: 'top',
                    }}
                  >
                    <Box sx={{ minHeight: '300px' }}>
                      <Typography
                        component='pre'
                        sx={{ whiteSpace: 'pre-wrap' }}
                      >
                        {noticeData.content}
                      </Typography>
                    </Box>
                  </TableCell>
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

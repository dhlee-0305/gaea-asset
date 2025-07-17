import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import api from '@/common/utils/api';
import type { NoticeData } from '@/common/types/notice';
import { MESSAGE } from '@/common/constants';
import PageHeader from '@/components/common/PageHeader';
import { showAlert, showConfirm } from '@/store/dialogAction';
import type { AppDispatch } from '@/store';

export default function NoticeForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { noticeNum } = useParams();
  const noticeId = Number(noticeNum ?? 0);
  const isUpdate = !!noticeId;

  // useForm 선언
  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoticeData>({
    defaultValues: {
      title: '',
      content: '',
      createDateTime: isUpdate
        ? ''
        : new Date().toISOString().slice(0, 19).replace('T', ' '),
      createUser: isUpdate ? '' : '100000',
    },
  });

  const createUserValue = watch('createUser');
  const createDateTimeValue = watch('createDateTime');

  useEffect(() => {
    // 공지사항 정보 조회
    if (isUpdate) {
      (async () => {
        try {
          const response = await api.get(`/notices/${noticeId}`);
          if (response.status === 200) {
            reset(response.data.data);
          }
        } catch (error) {
          console.error(error);
          dispatch(
            showAlert({
              title: 'Error',
              contents: MESSAGE.error,
            }),
          );
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 저장(등록, 수정) 처리
  const save = async (data: NoticeData): Promise<void> => {
    const confirmed = await dispatch(
      showConfirm({
        contents: '저장하시겠습니까?',
      }),
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);

      const requestData: Partial<NoticeData> = {
        ...data,
        ...(isUpdate && {
          updateUser: '100008',
          updateDateTime: new Date()
            .toISOString()
            .slice(0, 19)
            .replace('T', ' '),
        }),
      };

      const url = isUpdate ? `/notices/${noticeId}` : '/notices';
      const response = isUpdate
        ? await api.put(url, requestData)
        : await api.post(url, requestData);

      setIsLoading(false);

      if (response.status === 200) {
        await dispatch(
          showAlert({
            contents: isUpdate
              ? '공지사항이 수정되었습니다.'
              : '공지사항이 등록되었습니다.',
          }),
        );
        handleCancel();
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
  const handleCancel = (): void => {
    if (isUpdate) {
      navigate(`/notice/notices/${noticeId}`);
    } else {
      navigate('/notice/notices');
    }
  };

  return (
    <>
      <PageHeader contents={isUpdate ? '공지사항 수정' : '공지사항 등록'} />
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <form onSubmit={handleSubmit(save)}>
          <Paper sx={{ p: 4, mb: 4 }} elevation={4}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  label='제목'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('title', { required: '제목은 필수입니다.' })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>

              {isUpdate && (
                <Grid size={12}>
                  <TextField
                    label='부서/작성자'
                    fullWidth
                    size='small'
                    variant='outlined'
                    value={createUserValue}
                    disabled
                  />
                </Grid>
              )}

              {isUpdate && (
                <Grid size={12}>
                  <TextField
                    label='등록일자'
                    fullWidth
                    size='small'
                    variant='outlined'
                    value={createDateTimeValue?.slice(0, 10)}
                    disabled
                  />
                </Grid>
              )}

              <Grid size={12}>
                <TextField
                  label='내용'
                  multiline
                  minRows={4}
                  fullWidth
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('content', { required: '내용은 필수입니다.' })}
                  error={!!errors.content}
                  helperText={errors.content?.message}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button variant='outlined' onClick={handleCancel}>
                취소
              </Button>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                loading={isLoading}
                loadingPosition='start'
              >
                저장
              </Button>
            </Box>
          </Paper>
        </form>
      </Box>
    </>
  );
}

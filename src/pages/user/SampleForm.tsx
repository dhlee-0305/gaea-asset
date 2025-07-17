import { Box, Button, Grid, Paper, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import api from '@/common/utils/api';
import type { SampleData } from '@/common/types/sample';
import { MESSAGE, VALID_RULES } from '@/common/constants';
import PageHeader from '@/components/common/PageHeader';
import { showAlert, showConfirm } from '@/store/dialogAction';
import type { AppDispatch } from '@/store';

export default function SampleForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { userNo } = useParams();
  const isUpdate = !!userNo;

  // useForm 선언
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SampleData>({
    defaultValues: {
      userId: '',
      userNm: '',
      phoneNo: '',
      deptNm: '',
      email: '',
    },
  });

  useEffect(() => {
    // 사용자 정보 조회
    if (isUpdate) {
      (async () => {
        try {
          const response = await api.get(`/users/${userNo}`);
          if (response.status === 200) {
            reset(response.data);
          }
        } catch (error) {
          console.error(error);
          dispatch(
            showAlert({
              title: 'Error',
              contents: MESSAGE.error,
            }),
          );

          // 임시 데이터 설정
          reset({
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
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 저장(등록, 수정) 처리
  const save = async (data: SampleData): Promise<void> => {
    const confirmed = await dispatch(
      showConfirm({
        contents: '저장하시겠습니까?',
      }),
    );

    if (!confirmed) return;

    try {
      const url = isUpdate ? `/users/${userNo}` : '/users';
      setIsLoading(true);
      const response = await api.post(url, data);
      setIsLoading(false);

      if (response.status === 200) {
        await dispatch(
          showAlert({
            contents: isUpdate
              ? '사용자가 수정되었습니다.'
              : '사용자가 등록되었습니다.',
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

  // 취소 버튼 클릭 핸들러
  const handleCancel = (): void => {
    if (isUpdate) {
      navigate(`/user-management/users/${userNo}`);
    } else {
      navigate('/user-management/users');
    }
  };

  return (
    <>
      <PageHeader contents={isUpdate ? '사용자 수정' : '사용자 등록'} />
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <form onSubmit={handleSubmit(save)}>
          <Paper sx={{ p: 4, mb: 4 }} elevation={4}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  label='아이디'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('userId', { required: '아이디는 필수입니다.' })}
                  error={!!errors.userId}
                  helperText={errors.userId?.message}
                  disabled={isUpdate}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='이름'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('userNm', { required: '이름은 필수입니다.' })}
                  error={!!errors.userNm}
                  helperText={errors.userNm?.message}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='휴대전화'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('phoneNo', {
                    required: '휴대전화는 필수입니다.',
                    pattern: {
                      value: VALID_RULES.mobile.regex,
                      message: VALID_RULES.mobile.message,
                    },
                  })}
                  error={!!errors.phoneNo}
                  helperText={errors.phoneNo?.message}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='이메일'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('email', {
                    pattern: {
                      value: VALID_RULES.email.regex,
                      message: VALID_RULES.email.message,
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='부서'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('deptNm', { required: '부서는 필수입니다.' })}
                  error={!!errors.deptNm}
                  helperText={errors.deptNm?.message}
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

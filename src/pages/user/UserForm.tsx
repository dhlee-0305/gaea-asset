import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

import api from '@/common/utils/api';
import type { UserData } from '@/common/types/user';
import { MESSAGE, CODE } from '@/common/constants';
import PageHeader from '@/components/common/PageHeader';
import { showAlert, showConfirm } from '@/store/dialogAction';
import type { AppDispatch } from '@/store';

export default function UserForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { userNo } = useParams();
  const isUpdate = !!userNo;

  // useForm 선언
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserData>({
    defaultValues: {
      userId: '',
      userName: '',
      orgId: '',
      orgName: '',
      userPositionName: '',
      userPositionCd: '',
      userGradeName: '',
      userGradeCd: '',
    },
  });

  useEffect(() => {
    // 사용자 정보 조회
    if (isUpdate) {
      (async () => {
        try {
          const response = await api.get(`/users/${userNo}`);
          if (response.status === 200) {
            const resData = response.data;
            if (resData.resultCode === '0000') {
              reset({
                ...resData.data,
              });
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
  const save = async (data: UserData): Promise<void> => {
    const confirmed = await dispatch(
      showConfirm({
        contents: '저장하시겠습니까?',
      }),
    );

    if (!confirmed) return;

    try {
      const url = isUpdate ? `/users/${userNo}` : '/users';
      setIsLoading(true);
      const response = isUpdate
        ? await api.put(url, data)
        : await api.post(url, data);
      setIsLoading(false);

      if (response.status === 200) {
        const resData = response.data;
        if (resData.resultCode === '0000') {
          await dispatch(
            showAlert({
              contents: isUpdate
                ? '사용자가 수정되었습니다.'
                : '사용자가 등록되었습니다.',
            }),
          );
          handleCancel();
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
                  label='사번'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('empNum', { required: '사번은 필수입니다.' })}
                  error={!!errors.empNum}
                  helperText={errors.empNum?.message}
                  disabled={isUpdate}
                />
              </Grid>
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
                  {...register('userName', { required: '이름은 필수입니다.' })}
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name='orgId'
                  control={control}
                  rules={{ required: '부서 선택은 필수입니다.' }}
                  render={({ field }) => (
                    <>
                      <FormControl sx={{ width: 535 }}>
                        <InputLabel id='org-id-label'>부서</InputLabel>
                        <Select
                          labelId='org-id-label'
                          id='org-id'
                          label='부서'
                          {...field}
                          error={!!errors.orgId}
                        >
                          {CODE.orgId.map((orgId) => (
                            <MenuItem key={orgId.code} value={orgId.code}>
                              {orgId.orgName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name='userGradeCd'
                  control={control}
                  rules={{ required: '직급 선택은 필수입니다.' }}
                  render={({ field }) => (
                    <>
                      <FormControl sx={{ width: 535 }}>
                        <InputLabel id='gracde-code-label'>직급</InputLabel>
                        <Select
                          labelId='gracde-code-label'
                          id='gracde-code'
                          label='직급'
                          {...field}
                          error={!!errors.userGradeCd}
                        >
                          {CODE.userGradeCd.map((gradeCd) => (
                            <MenuItem key={gradeCd.code} value={gradeCd.code}>
                              {gradeCd.userGradeName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name='userPositionCd'
                  control={control}
                  rules={{ required: '직책 선택은 필수입니다.' }}
                  render={({ field }) => (
                    <>
                      <FormLabel id='device-type-label'>직책</FormLabel>
                      <RadioGroup
                        {...field}
                        row
                        aria-labelledby='device-type-label'
                      >
                        {CODE.userPositionCd.map((positionCd) => (
                          <FormControlLabel
                            key={positionCd.code}
                            value={positionCd.code}
                            control={<Radio />}
                            label={positionCd.codeName}
                          />
                        ))}
                      </RadioGroup>
                    </>
                  )}
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

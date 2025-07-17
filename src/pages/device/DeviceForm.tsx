import {
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

import api from '@/common/utils/api';
import { MESSAGE } from '@/common/constants';
import PageHeader from '@/components/common/PageHeader';
import { showAlert, showConfirm } from '@/store/dialogAction';
import type { AppDispatch } from '@/store';
import type { DeviceData } from '@/common/types/device';
import UserListPopup from '@/components/user/UserListPopup';
import type { UserData } from '@/common/types/user';

const CODE = {
  deviceTypes: [
    { code: 'PC', codeName: 'PC' },
    { code: 'MO', codeName: '모니터' },
    { code: 'HP', codeName: '핸드폰' },
    { code: 'ETC', codeName: '기타' },
  ],
};

export default function DeviceForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { deviceNum } = useParams();
  const isUpdate = !!deviceNum;
  const [isOpen, setIsOpen] = useState(false);

  // useForm 선언
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<DeviceData>({
    defaultValues: {
      deviceTypeCode: 'PC',
      userName: '',
      modelName: '',
      deviceStatus: '',
      manufactureDate: '',
      purchaseDate: null,
      returnDate: null,
    },
  });

  useEffect(() => {
    // 장비 정보 조회
    if (isUpdate) {
      (async () => {
        try {
          const response = await api.get(`/devices/${deviceNum}`);

          if (response.status === 200 && response.data.resultCode === '0000') {
            reset({
              ...response.data.data,
              purchaseDate: response.data.data.purchaseDate
                ? dayjs(response.data.data.purchaseDate)
                : null,
              returnDate: response.data.data.returnDate
                ? dayjs(response.data.data.returnDate)
                : null,
            });
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
  const save = async (data: DeviceData): Promise<void> => {
    const confirmed = await dispatch(
      showConfirm({
        contents: '저장하시겠습니까?',
      }),
    );

    if (!confirmed) return;

    try {
      const payload = {
        ...data,
        purchaseDate: data.purchaseDate
          ? data.purchaseDate.format('YYYYMMDD')
          : '',
        returnDate: data.returnDate ? data.returnDate.format('YYYYMMDD') : '',
      };

      const url = isUpdate ? `/devices/${deviceNum}` : '/devices';
      const method = isUpdate ? 'put' : 'post';

      setIsLoading(true);
      const response = await api[method](url, payload);
      setIsLoading(false);

      if (response.status === 200 && response.data.resultCode === '0000') {
        await dispatch(
          showAlert({
            contents: isUpdate
              ? '장비 정보가 수정되었습니다.'
              : '장비 정보가 등록되었습니다.',
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
      navigate(`/device-management/devices/${deviceNum}`);
    } else {
      navigate('/device-management/devices');
    }
  };

  // 사용자 선택 팝업 열기 핸들러
  const handleOpenDialog = () => {
    setIsOpen(true);
  };

  // 사용자 선택 팝업 닫기 핸들러
  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  // 사용자 선택 처리 핸들러
  const handleSelectUser = (user: UserData) => {
    setValue('userName', user.userName);
    setValue('empNum', user.empNum);
  };

  return (
    <>
      <PageHeader contents={isUpdate ? '장비 수정' : '장비 등록'} />
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <form onSubmit={handleSubmit(save)}>
          <Paper sx={{ p: 4, mb: 4 }} elevation={4}>
            <Grid container spacing={3}>
              {isUpdate && (
                <Grid size={12}>
                  <TextField
                    label='장비번호'
                    fullWidth
                    size='small'
                    variant='outlined'
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    {...register('deviceNum')}
                    disabled
                  />
                </Grid>
              )}

              <Grid size={12}>
                <Box display='flex' alignItems='flex-start' gap={1}>
                  <TextField
                    label='장비 담당자'
                    disabled
                    fullWidth
                    size='small'
                    variant='outlined'
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    {...register('userName', {
                      required: '장비담당자를 선택해 주세요.',
                    })}
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                  />
                  <Button variant='contained' onClick={handleOpenDialog}>
                    조회
                  </Button>
                </Box>
              </Grid>
              <Grid size={12}>
                <Controller
                  name='deviceTypeCode'
                  control={control}
                  rules={{ required: '장비유형은 필수입니다.' }}
                  render={({ field }) => (
                    <>
                      <FormLabel id='device-type-label'>장비유형</FormLabel>
                      <RadioGroup
                        {...field}
                        row
                        aria-labelledby='device-type-label'
                      >
                        {CODE.deviceTypes.map((deviceType) => (
                          <FormControlLabel
                            key={deviceType.code}
                            value={deviceType.code}
                            control={<Radio />}
                            label={deviceType.codeName}
                          />
                        ))}
                      </RadioGroup>
                    </>
                  )}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='사용용도'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('usagePurpose')}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='기존 장비관리번호'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('oldDeviceId')}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label='모델명'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('modelName')}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='제조년도'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('manufactureDate')}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='CPU'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('cpuSpec')}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='메모리'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('memorySize')}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='SSD/HDD'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('storageInfo')}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='OS'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('operatingSystem')}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='인치'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('screenSize')}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name='purchaseDate'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label='구매일자'
                      format='YYYY-MM-DD'
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          error: !!errors.purchaseDate,
                          helperText: errors.purchaseDate?.message,
                          size: 'small',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Controller
                  name='returnDate'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label='반납일자'
                      format='YYYY-MM-DD'
                      onChange={(date) => field.onChange(date)}
                      slotProps={{
                        textField: {
                          error: !!errors.returnDate,
                          helperText: errors.returnDate?.message,
                          size: 'small',
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label='비고'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('remarks')}
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
      <UserListPopup
        isOpen={isOpen}
        onClose={handleCloseDialog}
        onSelectUser={handleSelectUser}
      />
    </>
  );
}

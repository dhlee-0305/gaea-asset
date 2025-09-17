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
import { MESSAGE, CODE, VALID_RULES } from '@/common/constants';
import PageHeader from '@/components/common/PageHeader';
import { showAlert, showConfirm } from '@/store/dialogAction';
import type { AppDispatch } from '@/store';
import type { CodeData } from '@/common/types/code';

type Dept = {
  orgId?: string | number;
  orgName: string;
  parentOrgId?: string | number | null;
  orgType?: string;
};

export default function UserForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [positionData, setPositionData] = useState<CodeData[]>([]);
  const [gradeData, setGradeData] = useState<CodeData[]>([]);
  const [
    [orgData, setOrgData],
    [companyData, setCompanyData],
    [divisionData, setDivisionData],
    [teamData, setTeamData],
  ] = [
    useState<Dept[]>([]),
    useState<Dept[]>([]),
    useState<Dept[]>([]),
    useState<Dept[]>([]),
  ];

  const { userNo } = useParams();
  const isUpdate = !!userNo;

  // useForm 선언
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
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
      company: '',
      division: '',
    },
  });

  useEffect(() => {
    fetchGradeAndPosiionList(); // 직급 및 직책 리스트 조회
    // 사용자 정보 조회
    if (isUpdate) {
      (async () => {
        try {
          const response = await api.get(`/users/${userNo}`);
          if (response.status === 200) {
            const resData = response.data;
            if (resData.resultCode === '200') {
              const organizationList = resData.data.organizationList; // 전체 조직 데이터
              setOrgData(organizationList);

              // 부서 리스트(팀): 부문의 orgId가 parentOrgId인 것들
              const teamList = organizationList.filter(
                (dept: Dept) => dept.parentOrgId == resData.data.division,
              );
              // 부문 리스트: 회사 orgId가 parentOrgId인 것들
              const divisionList = organizationList.filter(
                (dept: Dept) => dept.parentOrgId == resData.data.company,
              );
              // 회사 리스트: parentOrgId가 null인 것들
              const companyList = organizationList.filter(
                (dept: Dept) => dept.parentOrgId == null,
              );

              setTeamData(teamList);
              setDivisionData(divisionList);
              setCompanyData(companyList);

              // 데이터 세팅 후 reset 호출 (비동기 반영 위해 setTimeout 사용)
              setTimeout(() => {
                reset({
                  ...resData.data.userInfo,
                  company: resData.data.company,
                  division: resData.data.division,
                });
              }, 0);
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
    } else {
      fetchOrganizationList(); // 조직 조회
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 직급 및 직책 리스트 조회
  const fetchGradeAndPosiionList = async () => {
    try {
      const categoryList = [
        CODE.commonCategory.CATEGORY_POSITION,
        CODE.commonCategory.CATEGORY_GRADE,
      ];
      const response = await api.get('/codesByCategories', {
        params: { categoryList: categoryList.join(',') },
      });
      if (response.status === 200) {
        const resData = response.data;
        if (resData.resultCode === '200') {
          setPositionData(resData.data[CODE.commonCategory.CATEGORY_POSITION]);
          setGradeData(resData.data[CODE.commonCategory.CATEGORY_GRADE]);
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
  };

  // 조직 조회
  const fetchOrganizationList = async () => {
    try {
      const response = await api.get('/organization');
      if (response.status === 200) {
        const resData = response.data;
        if (resData.resultCode === '200') {
          setOrgData(resData.data);
          setCompanyData(
            resData.data.filter(
              (dept: { parentOrgId: null }) => dept.parentOrgId == null,
            ),
          );
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
  };

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
        if (resData.resultCode === '200') {
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

  const handleSetChangeCompany = (key: keyof UserData, value: string) => {
    console.log(key + ':' + value);
    setValue('orgId', '');
    const setData = orgData.filter((dept) => dept.parentOrgId == value);
    switch (key) {
      case 'company': {
        setDivisionData(setData);
        break;
      }
      case 'division': {
        setTeamData(setData);
        break;
      }
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
                  {...register('userId', {
                    required: '아이디는 필수입니다.',
                    validate: {
                      chkWhiteSpace: (value) =>
                        value.match(VALID_RULES.whiteSpace.regex)
                          ? '공백을 제거해주세요.'
                          : true,
                      chkEmailType: (value) =>
                        value.match(VALID_RULES.email.regex)
                          ? '이메일형식은 등록 불가능합니다.'
                          : true,
                    },
                  })}
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
                  name='company'
                  control={control}
                  rules={{ required: '회사 선택은 필수입니다.' }}
                  render={({ field }) => (
                    <>
                      <FormControl sx={{ width: 535 }}>
                        <InputLabel id='company-id-label'>회사</InputLabel>
                        <Select
                          labelId='company-id-label'
                          id='company-id'
                          label='회사'
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            handleSetChangeCompany('company', e.target.value);
                          }}
                        >
                          {companyData.map((orgId) => (
                            <MenuItem key={orgId.orgId} value={orgId.orgId}>
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
                  name='division'
                  control={control}
                  rules={{ required: '부문 선택은 필수입니다.' }}
                  render={({ field }) => (
                    <>
                      <FormControl sx={{ width: 535 }}>
                        <InputLabel id='division-id-label'>부문</InputLabel>
                        <Select
                          labelId='division-id-label'
                          id='division-id'
                          label='부문'
                          {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            handleSetChangeCompany('division', e.target.value);
                          }}
                        >
                          {divisionData.map((orgId) => (
                            <MenuItem key={orgId.orgId} value={orgId.orgId}>
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
                          {teamData.map((orgId) => (
                            <MenuItem key={orgId.orgId} value={orgId.orgId}>
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
                          {gradeData.map((gradeCd) => (
                            <MenuItem key={gradeCd.code} value={gradeCd.code}>
                              {gradeCd.codeName}
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
                        {positionData.map((positionCd) => (
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

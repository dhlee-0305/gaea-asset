import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { AppDispatch } from '@/store';
import { MESSAGE } from '@/common/constants';
import { showAlert, showConfirm } from '@/store/dialogAction';
//import { saveToken } from '@/common/utils/auth';
import { fetchCommonCodes } from '@/store/commonCodeSlice';
import { useAuth } from '@/common/utils/useAuth';
import gaeasoftLogoIcon from '@/assets/images/gaeasoft-logo-icon.png';

export default function LoginForm() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  //const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault(); // form submit의 기본 동작 방지

    if (!userId.trim() || !password.trim()) {
      dispatch(
        showAlert({
          title: '입력 오류',
          contents: '아이디와 비밀번호를 모두 입력해주세요.',
        }),
      );
      return;
    }

    try {
      const res = await api.post('/auth/login', {
        userId,
        password,
      });

      if (res.data.resultCode === '200') {
        // 공통코드 조회
        dispatch(fetchCommonCodes());

        dispatch(
          showAlert({
            title: '',
            contents: '로그인 성공, 반갑습니다.',
          }),
        );
        login(res.data.data);

        const from = location.state?.from?.pathname;
        const redirectTo = !from || from === '/login' ? '/' : from;

        navigate(redirectTo, { replace: true });
      } else if (res.data.resultCode === '204') {
        dispatch(
          showAlert({
            title: '비밀번호 변경',
            contents: res.data.description,
          }),
        );
        navigate('/change-password', { state: { userId } }); // 비밀번호 변경 페이지로 이동
      } else {
        dispatch(
          showAlert({
            title: '로그인 실패',
            contents: MESSAGE.login_error,
          }),
        );
      }
    } catch (e) {
      console.error(e);
      dispatch(
        showAlert({
          title: '로그인 실패',
          contents: MESSAGE.login_error,
        }),
      );
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!userId.trim()) {
      dispatch(
        showAlert({
          title: '입력 오류',
          contents: '비밀번호 초기화를 위해 아이디를 입력해주세요.',
        }),
      );
      return;
    }

    const confirmed = await dispatch(
      showConfirm({ contents: '비밀번호 초기화를 요청하시겠습니까?' }),
    );

    if (!confirmed) return;

    navigate('/user-verification', { state: { userId } }); // 사용자 인증 페이지로 이동
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f7fa',
      }}
    >
      <Container maxWidth='xs'>
        <Card sx={{ boxShadow: '0 0 35px 0 rgba(154,161,171,.15)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <img
                  src={gaeasoftLogoIcon}
                  alt='GAEA SOFT'
                  style={{ height: 32 }}
                />
                <Typography
                  variant='h5'
                  component='div'
                  sx={{
                    fontWeight: 700,
                    color: '#313a46',
                    letterSpacing: '0.5px',
                  }}
                >
                  전산장비관리시스템
                </Typography>
              </Box>
            </Box>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin='normal'
                label='아이디'
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                variant='outlined'
                size='medium'
              />
              <TextField
                fullWidth
                margin='normal'
                type='password'
                label='비밀번호'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant='outlined'
                size='medium'
              />
              <Box textAlign='right' mt={1} mb={3}>
                <Button
                  size='small'
                  onClick={handlePasswordResetRequest}
                  sx={{ color: 'text.secondary', textTransform: 'none' }}
                >
                  비밀번호 초기화 요청
                </Button>
              </Box>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                color='primary'
                size='large'
                sx={{
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: 'none',
                }}
              >
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

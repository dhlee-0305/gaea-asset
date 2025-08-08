import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { AppDispatch } from '@/store';
import { MESSAGE } from '@/common/constants';
import { showAlert, showConfirm } from '@/store/dialogAction';
import { saveToken } from '@/common/utils/auth';

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);

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
        saveToken(res.data.data);

        dispatch(
          showAlert({
            title: '',
            contents: '로그인 성공, 반갑습니다.',
          }),
        );
        navigate('/'); // 메인 페이지로 이동
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

    try {
      setIsResetting(true);
      const res = await api.put('/auth/password/reset', {
        userId,
      });

      if (res.status === 200 && res.data.resultCode === '0000') {
        dispatch(
          showAlert({
            title: '비밀번호 초기화 요청 완료',
            contents: '관리자에게 비밀번호 초기화 요청을 보냈습니다.',
          }),
        );
      } else {
        dispatch(
          showAlert({
            title: '초기화 요청 실패',
            contents: res.data.description,
          }),
        );
      }
    } catch (e) {
      console.error(e);
      dispatch(
        showAlert({
          title: '초기화 요청 실패',
          contents: '초기화 요청 중 오류가 발생했습니다.',
        }),
      );
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box mt={10}>
        <form onSubmit={handleSubmit}>
          <Typography variant='h4' gutterBottom>
            로그인
          </Typography>
          <TextField
            fullWidth
            margin='normal'
            label='아이디'
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <TextField
            fullWidth
            margin='normal'
            type='password'
            label='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box textAlign='right' mt={1} mb={2}>
            <Button
              size='small'
              onClick={handlePasswordResetRequest}
              disabled={isResetting}
            >
              비밀번호 초기화 요청
            </Button>
          </Box>
          <Button
            type='submit' // 중요: submit 버튼
            fullWidth
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
          >
            로그인
          </Button>
        </form>
      </Box>
    </Container>
  );
}

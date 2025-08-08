import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { AppDispatch } from '@/store';
import { MESSAGE } from '@/common/constants';
import { showAlert, showConfirm } from '@/store/dialogAction';

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [newPassword, setNewPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');

  const location = useLocation();
  const userId = location.state?.userId || '';

  if (!userId) {
    dispatch(
      showAlert({
        title: '접근오류',
        contents: '잘못된 접근입니다. 로그인 후 다시 시도해주세요.',
      }),
    );
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault(); // form submit의 기본 동작 방지

    if (!newPassword.trim()) {
      dispatch(
        showAlert({
          title: '입력 오류',
          contents: '신규 비밀번호를 입력해주세요.',
        }),
      );
      return;
    }

    if (newPassword.trim() != checkPassword.trim()) {
      dispatch(
        showAlert({
          title: '입력 오류',
          contents: '비밀번호를 확인 해주세요.',
        }),
      );
      return;
    }

    const confirmed = await dispatch(
      showConfirm({
        contents: '비밀번호를 변경 하시겠습니까?',
      }),
    );

    if (!confirmed) return;

    try {
      const res = await api.put('/auth/password', {
        userId,
        newPassword,
      });

      if (res.data.resultCode === '200') {
        dispatch(
          showAlert({
            title: '',
            contents: '비밀번호 변경 성공',
          }),
        );
        navigate('/'); // 메인 페이지로 이동
      } else {
        dispatch(
          showAlert({
            title: '비밀번호 변경 실패',
            contents: MESSAGE.login_error,
          }),
        );
      }
    } catch (e) {
      console.error(e);
      dispatch(
        showAlert({
          title: '비밀번호 변경 실패',
          contents: MESSAGE.login_error,
        }),
      );
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box mt={10}>
        <form onSubmit={handleSubmit}>
          <Typography variant='h4' gutterBottom>
            비밀번호 변경
          </Typography>
          <TextField
            fullWidth
            margin='normal'
            type='password'
            label='신규 비밀번호'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            fullWidth
            margin='normal'
            type='password'
            label='비밀번호 확인'
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
          />
          <Button
            type='submit' // 중요: submit 버튼
            fullWidth
            variant='contained'
            color='primary'
            sx={{ mt: 2 }}
          >
            비밀번호 변경
          </Button>
        </form>
      </Box>
    </Container>
  );
}

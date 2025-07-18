import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { AppDispatch } from '@/store';
import { MESSAGE } from '@/common/constants';
import { showAlert } from '@/store/dialogAction';
import { saveToken } from '@/common/utils/auth';

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

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

      if (res.data.resultCode === '0000') {
        saveToken(res.data.data);

        //alert('로그인 성공, 반갑습니다.');
        dispatch(
          showAlert({
            title: '',
            contents: '로그인 성공, 반갑습니다.',
          }),
        );
        navigate('/'); // 메인 페이지로 이동
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
          <Box textAlign={'right'} mt={1} mb={2}>
            <Link to='/change-password'>비밀번호 변경</Link>
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

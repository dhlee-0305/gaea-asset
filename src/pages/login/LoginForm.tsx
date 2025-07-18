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

  const handleSubmit = async () => {
    try {
      const res = await api.post('/auth/login', {
        userId,
        password,
      });

      if (res.data.resultCode == '0000') {
        saveToken(res.data.data);
        console.log('saveToken : ', res.data.data);

        alert('로그인 성공, 반갑습니다');
        navigate('/'); // 메인 페이지로 이동
        //window.location.href = 'http://localhost:3000';
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
        {/*error && <Typography color='error'>{error}</Typography>*/}
        <Button
          fullWidth
          variant='contained'
          color='primary'
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          로그인
        </Button>
      </Box>
    </Container>
  );
}

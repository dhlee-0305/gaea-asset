import { useEffect, useRef, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import api from '@/common/utils/api';
import type { AppDispatch } from '@/store';
import { showAlert } from '@/store/dialogAction';

export default function UserVerificationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const TIME_LIMIT = 300; // 5분

  const location = useLocation();
  const userId = location.state?.userId || '';

  useEffect(() => {
    if (sent && timer > 0) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0 && sent) {
      setExpired(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer, sent]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendCode = async () => {
    try {
      const res = await api.post('/verification/request', {
        userId,
      });

      if (res.data.resultCode === '200') {
        setSent(true);
        setTimer(TIME_LIMIT);
        setExpired(false);
        setCode('');

        dispatch(
          showAlert({
            contents: '인증번호가 발송되었습니다.',
          }),
        );
      } else {
        dispatch(
          showAlert({
            contents: '인증번호 발송에 실패했습니다.',
          }),
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        showAlert({
          contents: '인증번호 발송에 실패했습니다.',
        }),
      );
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) {
      dispatch(
        showAlert({
          contents: '인증번호를 입력해주세요.',
        }),
      );
      return;
    }

    try {
      const res = await api.post('/verification/verify', {
        userId,
        code,
      });

      if (res.data.resultCode === '200') {
        const res = await api.put('/auth/password/reset', {
          userId,
        });

        if (res.data.resultCode === '200') {
          dispatch(
            showAlert({
              contents: '관리자에게 비밀번호 초기화 요청을 보냈습니다.',
            }),
          );

          navigate('/login');
        } else {
          dispatch(
            showAlert({
              title: '초기화 요청 실패',
              contents: res.data.description,
            }),
          );
        }
      } else {
        dispatch(
          showAlert({
            contents: res.data.description,
          }),
        );
      }
    } catch (error) {
      console.log(error);
      dispatch(
        showAlert({
          contents: '유효하지 않거나 만료된 인증번호입니다.',
        }),
      );
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box mt={10}>
        <Typography variant='h4' gutterBottom>
          사용자 인증
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerify();
          }}
        >
          <Stack spacing={2}>
            <Button
              variant='contained'
              onClick={handleSendCode}
              disabled={timer > 0 && !expired}
            >
              {sent ? '재전송' : '인증번호 발송'}
            </Button>

            {sent && (
              <>
                <TextField
                  fullWidth
                  label='인증번호 입력'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={expired}
                />

                <Typography
                  variant='body2'
                  color={expired ? 'error' : 'textSecondary'}
                >
                  {expired
                    ? '인증번호가 만료되었습니다.'
                    : `남은 시간: ${formatTime(timer)}`}
                </Typography>

                <Button type='submit' variant='contained' disabled={expired}>
                  인증번호 확인
                </Button>
              </>
            )}
          </Stack>
        </form>
      </Box>
    </Container>
  );
}

import {
  Box,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import styles from '@/styles/components/Header.module.css';
import gaeasoftLogo from '@/assets/images/gaeasoft-logo.svg';
import gaeasoftLogoIcon from '@/assets/images/gaeasoft-logo-icon.png';
import { getToken, parseJwt } from '@/common/utils/auth';
import type { AppDispatch } from '@/store';
import { showAlert } from '@/store/dialogAction';
import { useAuth } from '@/common/utils/useAuth';
/**
 * Header 컴포넌트
 */
export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoError, setLogoError] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const token = getToken();
  const userInfo = token ? parseJwt(token) : null;

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error(e);
    }
    navigate('/login', { replace: true, state: null });

    setTimeout(() => {
      logout();
    }, 1000);

    dispatch(
      showAlert({
        contents: '로그아웃 되었습니다.',
      }),
    );
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  const handleLogoClick = () => {
    // localhost:3000 메인 화면으로 이동
    //window.location.href = 'http://localhost:3000';
    navigate('/');
  };

  return (
    <>
      <AppBar
        position='fixed'
        color='transparent'
        className={styles.appBar}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#1e1e2f !important',
          background: '#1e1e2f !important',
          '&.MuiAppBar-root': {
            backgroundColor: '#1e1e2f !important',
            background: '#1e1e2f !important',
          },
          '&.MuiAppBar-colorPrimary': {
            backgroundColor: '#1e1e2f !important',
            background: '#1e1e2f !important',
          },
          '&.MuiAppBar-colorTransparent': {
            backgroundColor: '#1e1e2f !important',
            background: '#1e1e2f !important',
          },
        }}
      >
        <Toolbar>
          <Box className={styles.logoContainer}>
            {!logoError ? (
              <img
                src={gaeasoftLogo}
                alt='GAEA SOFT 로고'
                className={styles.logo}
                onError={handleLogoError}
                onClick={handleLogoClick}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              // SVG 로고 실패 시 아이콘 + 텍스트 fallback
              <Box
                className={styles.logoFallback}
                onClick={handleLogoClick}
                sx={{ cursor: 'pointer !important' }}
              >
                <img
                  src={gaeasoftLogoIcon}
                  alt='GAEA SOFT 아이콘'
                  className={styles.logoIcon}
                />
                <Typography variant='h6' className={styles.logoText}>
                  GAEASOFT
                </Typography>
              </Box>
            )}
            <Typography
              variant='h6'
              component='div'
              className={styles.title}
              sx={{ cursor: 'default !important' }}
            >
              전산장비관리시스템
            </Typography>
          </Box>

          {userInfo ? (
            <Box className={styles.userMenuContainer}>
              <IconButton
                size='large'
                aria-label='account of current user'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleMenu}
                className={styles.userMenuButton}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                className={styles.menu}
              >
                <MenuItem onClick={handleClose} className={styles.menuItem}>
                  {userInfo.userName}
                </MenuItem>
                <MenuItem onClick={handleLogout} className={styles.menuItem}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : null}
        </Toolbar>
      </AppBar>
    </>
  );
}

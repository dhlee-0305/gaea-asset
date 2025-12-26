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
import { getToken, parseJwt } from '@/common/utils/auth';
import type { AppDispatch } from '@/store';
import { showAlert } from '@/store/dialogAction';
import { useAuth } from '@/common/utils/useAuth';
/**
 * Header 컴포넌트
 */
export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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

  return (
    <>
      <AppBar
        position='fixed'
        color='transparent'
        className={styles.appBar}
        sx={{
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: `240px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'var(--header-bg) !important',
          background: 'var(--header-bg) !important',
          boxShadow: '0 0 35px 0 rgba(154,161,171,.15)',
          '&.MuiAppBar-root': {
            backgroundColor: 'var(--header-bg) !important',
            background: 'var(--header-bg) !important',
          },
          '&.MuiAppBar-colorPrimary': {
            backgroundColor: 'var(--header-bg) !important',
            background: 'var(--header-bg) !important',
          },
          '&.MuiAppBar-colorTransparent': {
            backgroundColor: 'var(--header-bg) !important',
            background: 'var(--header-bg) !important',
          },
        }}
      >
        <Toolbar>
          <Box className={styles.logoContainer} sx={{ flexGrow: 1 }}>
            <Typography
              variant='h6'
              component='div'
              sx={{
                cursor: 'default !important',
                color: 'var(--title-color)',
                fontWeight: 700,
                fontSize: '1.5rem',
                letterSpacing: '0.5px',
              }}
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
                sx={{ color: '#313a46 !important' }}
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

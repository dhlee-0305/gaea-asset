import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import { showAlert } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import type { AppDispatch } from '@/store';
import type { UserData } from '@/common/types/user';

export default function UserListPopup({
  isOpen,
  onClose,
  onSelectUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserData) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [userDatas, setUserDatas] = useState<UserData[]>([]);

  useEffect(() => {
    if (isOpen) {
      setSearchKeyword('');
      fetchData('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 데이터 조회
  const fetchData = async (value: string) => {
    try {
      const response = await api.get('/users', {
        params: {
          searchKeyword: value,
          currentPage: 1,
          pageSize: 10000,
        },
      });

      if (response.status === 200 && response.data.resultCode === '0000') {
        setUserDatas(response.data.data);
      }
    } catch (e) {
      console.error(e);
      dispatch(
        showAlert({
          title: 'Error',
          contents: MESSAGE.error,
        }),
      );
    }
  };

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    fetchData(searchKeyword);
  };

  // 검색어 입력 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchData(searchKeyword);
    }
  };

  // 담당자 선택 핸들러
  const handleSelectUser = (user: UserData) => {
    onSelectUser(user);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      slotProps={{
        paper: {
          sx: { minWidth: 650 },
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>담당자 조회</DialogTitle>
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={(theme) => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box
          sx={{
            my: 2,
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <TextField
            size='small'
            label='담당자'
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <Button variant='contained' onClick={handleSearch}>
            검색
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ width: 580 }}>
            <TableHead>
              <TableRow>
                <TableCell align='center'>사원번호</TableCell>
                <TableCell align='center'>담당자</TableCell>
                <TableCell align='center'>부서</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userDatas.length > 0 ? (
                userDatas.map((userData) => (
                  <TableRow
                    key={userData.empNum}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleSelectUser(userData)}
                  >
                    <TableCell align='center'>{userData.empNum}</TableCell>
                    <TableCell align='center'>{userData.userName}</TableCell>
                    <TableCell align='center'>{userData.orgName}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align='center' colSpan={3}>
                    검색 결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={onClose}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

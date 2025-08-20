import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { UserData } from '@/common/types/user';
import PageHeader from '@/components/common/PageHeader';
import { showAlert } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import type { AppDispatch } from '@/store';
import type { PageInfo } from '@/common/types/common';

export default function UserList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchColumn, setSearchColumn] = useState('userName');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [datas, setDatas] = useState<UserData[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 10,
    currentPage: 1,
  });

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터 검색
  const fetchUsers = async (currentPage = pageInfo.currentPage) => {
    try {
      const response = await api.get('/users', {
        params: {
          searchColumn: searchColumn,
          searchKeyword: searchKeyword,
          currentPage: currentPage,
          pageSize: pageInfo.pageSize,
        },
      });

      if (response.status === 200) {
        if (response.data.resultCode === '0000') {
          const resData = response.data;
          setDatas(resData.data);
          setPageInfo(resData.pagination);
        } else {
          dispatch(
            showAlert({
              title: 'Error',
              contents: MESSAGE.error,
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
  const handleSearch = (): void => {
    fetchUsers(1);
  };

  // 검색어 입력 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      fetchUsers(1);
    }
  };

  // 페이지 변경 핸들러
  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number) => {
    if (page === pageInfo.currentPage) return;
    fetchUsers(page); // 해당 페이지 요청
  };

  // 등록 버튼 클릭 핸들러
  const handleMoveCreate = (): void => {
    navigate('/user-management/users/create');
  };

  return (
    <>
      <PageHeader contents='사용자 목록' />
      {/* 검색 영역 */}
      <Box
        sx={{
          my: 2,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <FormControl size='small'>
          <Select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
          >
            <MenuItem value='userName'>이름</MenuItem>
            <MenuItem value='orgName'>부서</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size='small'
          label='검색어'
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <Button variant='contained' onClick={handleSearch}>
          검색
        </Button>
      </Box>
      {/* 목록 영역 */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell align='center'>아이디</TableCell>
              <TableCell align='center'>이름</TableCell>
              <TableCell align='center'>부서</TableCell>
              <TableCell align='center'>직급</TableCell>
              {/* <TableCell align='center'>등록일</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.map((data) => (
              <TableRow
                key={data.empNum}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align='center' component='th' scope='row'>
                  <Link to={`/user-management/users/${data.empNum}`}>
                    {data.userId}
                  </Link>
                </TableCell>
                <TableCell align='center'>{data.userName}</TableCell>
                <TableCell align='center'>{data.orgName}</TableCell>
                <TableCell align='center'>
                  {data.userPositionCd === '03'
                    ? data.userGradeName + '(' + data.userPositionName + ')'
                    : data.userGradeName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={pageInfo.totalPageCnt}
          onChange={handleChangePage}
          page={pageInfo.currentPage}
          shape='rounded'
        />
      </Box>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant='contained' onClick={handleMoveCreate}>
          등록
        </Button>
      </Box>
    </>
  );
}

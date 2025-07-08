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
import type { DeviceData } from '@/common/types/device';
import PageHeader from '@/components/common/PageHeader';
import { showAlert } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import type { AppDispatch } from '@/store';
import type { PageInfo } from '@/common/types/common';

export default function DeviceList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState('userName');
  const [searchValue, setSearchValue] = useState('');
  const [datas, setDatas] = useState<DeviceData[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    searchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터 검색
  const searchData = async (currentPage = pageInfo.page) => {
    try {
      const response = await api.get('/deviceList', {
        params: {
          searchKey: searchKey,
          searchValue: searchValue,
          page: currentPage,
          size: pageInfo.pageSize,
        },
      });

      if (response.status === 200) {
        setDatas(response.data.data);
        setPageInfo(response.data.pagination);
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

  // 검색 버튼 클릭
  const handleSearch = (): void => {
    searchData(1);
  };

  // 페이지 이동
  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number) => {
    if (page === pageInfo.page) return;
    searchData(page); // 해당 페이지 요청
  };

  // 등록 화면 이동
  const handleMoveCreate = (): void => {
    navigate('/user-management/users/create');
  };

  return (
    <>
      <PageHeader contents='장비 목록' />
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
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          >
            <MenuItem value='userName'>장비담당자</MenuItem>
            <MenuItem value='departmentName'>부서</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size='small'
          label='검색어'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
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
              <TableCell align='center'>장비번호</TableCell>
              <TableCell align='center'>장비담당자</TableCell>
              <TableCell align='center'>부서</TableCell>
              <TableCell align='center'>장비유형</TableCell>
              <TableCell align='center'>제조년도</TableCell>
              <TableCell align='center'>모델명</TableCell>
              <TableCell align='center'>상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.map((data) => (
              <TableRow
                key={data.deviceNum}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align='center' component='th' scope='row'>
                  <Link to={`/user-management/users/${data.deviceNum}`}>
                    {data.deviceNum}
                  </Link>
                </TableCell>
                <TableCell align='center'>{data.userName}</TableCell>
                <TableCell align='center'></TableCell>
                <TableCell align='center'>{data.deviceType}</TableCell>
                <TableCell align='center'>{data.manufactureDate}</TableCell>
                <TableCell align='center'>{data.modelName}</TableCell>
                <TableCell align='center'>{data.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={pageInfo.totalPageCnt}
          onChange={handleChangePage}
          page={pageInfo.page}
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

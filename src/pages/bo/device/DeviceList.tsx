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
import PageHeader from '@/components/bo/PageHeader';
import { showAlert } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import type { AppDispatch } from '@/store';
import type { PageInfo } from '@/common/types/common';

export default function DeviceList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('userNm');
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
      const response = await api.get('/bo/deviceList', {
        params: {
          searchType: searchType,
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
    navigate('/bo/user-management/users/create');
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
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <MenuItem value='userNm'>이름</MenuItem>
            <MenuItem value='userId'>아이디</MenuItem>
            <MenuItem value='deptNm'>부서</MenuItem>
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
              <TableCell align='center'>장비명</TableCell>
              <TableCell align='center'>내용</TableCell>
              <TableCell align='center'>등록자명</TableCell>
              <TableCell align='center'>수정자명</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.map((data) => (
              <TableRow
                key={data.deviceNumber}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align='center' component='th' scope='row'>
                  <Link to={`/bo/user-management/users/${data.deviceNumber}`}>
                    {data.deviceNumber}
                  </Link>
                </TableCell>
                <TableCell align='center'>{data.deviceName}</TableCell>
                <TableCell align='center'>{data.contents}</TableCell>
                <TableCell align='center'>{data.regUser}</TableCell>
                <TableCell align='center'>{data.modUser}</TableCell>
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

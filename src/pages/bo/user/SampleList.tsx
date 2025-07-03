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
import type { SampleData } from '@/common/types/sample';
import PageHeader from '@/components/bo/PageHeader';
import { showAlert } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import type { AppDispatch } from '@/store';
import type { PageInfo } from '@/common/types/common';

export default function SampleList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('userNm');
  const [searchValue, setSearchValue] = useState('');
  const [datas, setDatas] = useState<SampleData[]>([]);
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
      const response = await api.get('/users', {
        params: {
          searchType: searchType,
          searchValue: searchValue,
          page: currentPage,
          size: pageInfo.pageSize,
        },
      });

      if (response.status === 200) {
        setDatas(response.data);
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
      // 임시 데이터 설정
      setDatas([
        {
          userNo: '1',
          userId: 'cookie',
          userNm: '쿠키',
          phoneNo: '010-8888-9999',
          deptNm: '기술연구소',
          createDt: '2025.01.01',
        },
        {
          userNo: '2',
          userId: 'cake',
          userNm: '케이크',
          phoneNo: '010-7777-1111',
          deptNm: '개발팀',
          createDt: '2025.01.05',
        },
      ]);
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
              <TableCell align='center'>아이디</TableCell>
              <TableCell align='center'>이름</TableCell>
              <TableCell align='center'>부서</TableCell>
              <TableCell align='center'>휴대전화</TableCell>
              <TableCell align='center'>등록일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.map((data) => (
              <TableRow
                key={data.userNo}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align='center' component='th' scope='row'>
                  <Link to={`/bo/user-management/users/${data.userNo}`}>
                    {data.userId}
                  </Link>
                </TableCell>
                <TableCell align='center'>{data.userNm}</TableCell>
                <TableCell align='center'>{data.deptNm}</TableCell>
                <TableCell align='center'>{data.phoneNo}</TableCell>
                <TableCell align='center'>{data.createDt}</TableCell>
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

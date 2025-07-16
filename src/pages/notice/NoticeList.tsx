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
import type { NoticeData } from '@/common/types/notice';
import PageHeader from '@/components/common/PageHeader';
import { showAlert } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import type { AppDispatch } from '@/store';
import type { PageInfo } from '@/common/types/common';

export default function NoticeList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState('title');
  const [searchValue, setSearchValue] = useState('');
  const [datas, setDatas] = useState<NoticeData[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 10,
    page: 1,
  });

  useEffect(() => {
    searchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  // 데이터 검색
  const searchData = async (currentPage = pageInfo.page) => {
    try {
      const response = await api.get('/noticeList', {
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
    navigate('/notice/notices/create');
  };

  return (
    <>
      <PageHeader contents='공지사항 목록' />
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
            <MenuItem value='title'>제목</MenuItem>
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
              <TableCell align='center'>No.</TableCell>
              <TableCell align='center'>제목</TableCell>
              <TableCell align='center'>부서/작성자</TableCell>
              <TableCell align='center'>등록일자</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              datas.map((data, index) => (
                <TableRow
                  key={data.noticeNum}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center'>
                    {(pageInfo.page - 1) * pageInfo.pageSize + index + 1}
                  </TableCell>
                  <TableCell align='center' component='th' scope='row'>
                    <Link to={`/notice/notices/${data.noticeNum}`}>
                      {data.title}
                    </Link>
                  </TableCell>
                  <TableCell align='center'>{data.createUser}</TableCell>
                  <TableCell align='center'>
                    {data.createDateTime?.slice(0, 10)}
                  </TableCell>
                </TableRow>
              ))
            )}
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

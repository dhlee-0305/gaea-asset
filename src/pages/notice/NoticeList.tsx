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
  const [searchColumn, setSearchColumn] = useState('title');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [noticeDatas, setNoticeDatas] = useState<NoticeData[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 10,
    currentPage: 1,
  });

  useEffect(() => {
    searchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터 검색
  const searchData = async (currentPage = pageInfo.currentPage) => {
    try {
      const response = await api.get('/notices', {
        params: {
          searchColumn: searchColumn,
          searchKeyword: searchKeyword,
          currentPage: currentPage,
          pageSize: pageInfo.pageSize,
        },
      });

      if (response.status === 200) {
        setNoticeDatas(response.data.data);
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
    if (page === pageInfo.currentPage) return;
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
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
          >
            <MenuItem value='title'>제목</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size='small'
          label='검색어'
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
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
            {noticeDatas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              noticeDatas.map((noticeData, index) => (
                <TableRow
                  key={noticeData.noticeNum}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center'>
                    {noticeDatas.length - index}
                  </TableCell>
                  <TableCell align='center' component='th' scope='row'>
                    <Link to={`/notice/notices/${noticeData.noticeNum}`}>
                      {noticeData.title}
                    </Link>
                  </TableCell>
                  <TableCell align='center'>{noticeData.createUser}</TableCell>
                  <TableCell align='center'>
                    {noticeData.createDateTime?.slice(0, 10)}
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

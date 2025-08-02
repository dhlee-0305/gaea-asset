import {
  Box,
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
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import api from '@/common/utils/api';
import type { DeviceHistoryData } from '@/common/types/device';
import PageHeader from '@/components/common/PageHeader';
import { showAlert } from '@/store/dialogAction';
import { MESSAGE } from '@/common/constants';
import type { AppDispatch } from '@/store';
import type { PageInfo } from '@/common/types/common';

export default function DeviceHistoryList() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchColumn, setSearchColumn] = useState('deviceNum');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deviceHistoryDatas, setDeviceHistoryDatas] = useState<DeviceHistoryData[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 10,
    currentPage: 1,
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터 조회
  const fetchData = async (currentPage = pageInfo.currentPage) => {
    try {
      const response = await api.get('/histories', {
        params: {
          currentPage: currentPage,
          pageSize: pageInfo.pageSize,
          searchColumn: searchColumn,
          searchKeyword: searchKeyword,
        },
      });

      if (response.status === 200 && response.data.resultCode === '0000') {
        setDeviceHistoryDatas(response.data.data);
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

  // 검색 버튼 클릭 핸들러
  const handleSearch = (): void => {
    fetchData(1);
  };

  // 검색어 입력 핸들러
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      fetchData(1);
    }
  };

  // 페이지 변경 핸들러
  const handleChangePage = (_: React.ChangeEvent<unknown>, page: number) => {
    if (page === pageInfo.currentPage) return;
    fetchData(page);
  };

  return (
    <>
      <PageHeader contents={`장비 이력 목록`} />
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
            <MenuItem value='deviceNum'>장비번호</MenuItem>
            <MenuItem value='changeContents'>변경내용</MenuItem>
            <MenuItem value='reason'>사유</MenuItem>
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
              <TableCell align='center'>No.</TableCell>
              <TableCell align='center'>장비 번호</TableCell>
              <TableCell align='center'>장비 유형</TableCell>
              <TableCell align='center'>현재 담당자</TableCell>
              <TableCell align='center'>장비상태</TableCell>
              <TableCell align='center'>결재 상태</TableCell>
              <TableCell align='center'>변경일시</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceHistoryDatas.length > 0 ? (
              deviceHistoryDatas.map((historyData, idx) => (
                <TableRow
                  key={historyData.historyNum}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center'>{historyData.historyNum}</TableCell>
                  <TableCell align='center'>{historyData.deviceNum ?? ''}</TableCell>
                  <TableCell align='center'>{historyData.deviceType ?? ''}</TableCell> {/* deviceType 없음 */}
                  <TableCell align='center'>{historyData.userName ?? ''}</TableCell> {/* userName 없음 */}
                  <TableCell align='center'>{historyData.deviceStatus ?? ''}</TableCell>
                  <TableCell align='center'>{historyData.approvalStatus ?? ''}</TableCell>
                  <TableCell align='center'>{historyData.createDatetime ? historyData.createDatetime.split(' ')[0].replace(/-/g, '.') : ''}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align='center' colSpan={7}>
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        {deviceHistoryDatas.length > 0 && (
          <Pagination
            count={pageInfo.totalPageCnt}
            onChange={handleChangePage}
            page={pageInfo.currentPage}
            shape='rounded'
          />
        )}
      </Box>
    </>
  );
} 
import {
  Box,
  Button,
  ButtonGroup,
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
import { isAdminRole } from '@/common/utils/auth';

export default function DeviceList() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchColumn, setSearchColumn] = useState('userName');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deviceDatas, setDeviceDatas] = useState<DeviceData[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 10,
    currentPage: 1,
  });
  const isAdmin = isAdminRole();

  const excelButtonStyle = {
    fontSize: '11px',
    minWidth: 'auto',
    padding: '2px 8px',
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 데이터 조회
  const fetchData = async (currentPage = pageInfo.currentPage) => {
    try {
      const response = await api.get('/devices', {
        params: {
          searchColumn: searchColumn,
          searchKeyword: searchKeyword,
          currentPage: currentPage,
          pageSize: pageInfo.pageSize,
        },
      });

      if (response.status === 200 && response.data.resultCode === '0000') {
        setDeviceDatas(response.data.data);
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

  // 등록 버튼 클릭 핸들러
  const handleMoveCreate = (): void => {
    navigate('/device-management/devices/create');
  };

  const excelDownload = async (): Promise<void> => {
    let url: string | null = null;
    try {
      const response = await api.get('/devices/download/excel', {
        responseType: 'blob',
      });
      const contentDisposition = response.headers['content-disposition'];
      const match = contentDisposition?.match(/filename="?([^"]+)"?/);
      const fileName = match ? match[1] : 'DeviceList.xlsx';

      const blob = new Blob([response.data]);
      url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', decodeURIComponent(fileName));
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      dispatch(
        showAlert({
          title: 'Error',
          contents: MESSAGE.error,
        }),
      );
    } finally {
      if (url) URL.revokeObjectURL(url);
    }
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
          mb: 1.2,
        }}
      >
        <FormControl size='small'>
          <Select
            value={searchColumn}
            onChange={(e) => setSearchColumn(e.target.value)}
          >
            <MenuItem value='userName'>장비담당자</MenuItem>
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
      {/* 액셀 영역 */}
      <Box display='flex' justifyContent='flex-end' sx={{ mt: 0.1, mb: 2.5 }}>
        <ButtonGroup>
          <Button size='small' sx={excelButtonStyle} onClick={excelDownload}>
            액셀 다운로드
          </Button>
          {isAdmin && (
            <Button size='small' sx={excelButtonStyle}>
              액셀 업로드
            </Button>
          )}
        </ButtonGroup>
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
              <TableCell align='center'>장비상태</TableCell>
              <TableCell align='center'>결재상태</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deviceDatas.length > 0 ? (
              deviceDatas.map((deviceData) => (
                <TableRow
                  key={deviceData.deviceNum}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align='center' component='th' scope='row'>
                    <Link
                      to={`/device-management/devices/${deviceData.deviceNum}`}
                    >
                      {deviceData.deviceNum}
                    </Link>
                  </TableCell>
                  <TableCell align='center'>{deviceData.userName}</TableCell>
                  <TableCell align='center'>{deviceData.orgName}</TableCell>
                  <TableCell align='center'>{deviceData.deviceType}</TableCell>
                  <TableCell align='center'>
                    {deviceData.manufactureDate}
                  </TableCell>
                  <TableCell align='center'>{deviceData.modelName}</TableCell>
                  <TableCell align='center'>
                    {deviceData.deviceStatus}
                  </TableCell>
                  <TableCell align='center'>
                    {deviceData.approvalStatus}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align='center' colSpan={8}>
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        {deviceDatas.length > 0 && (
          <Pagination
            count={pageInfo.totalPageCnt}
            onChange={handleChangePage}
            page={pageInfo.currentPage}
            shape='rounded'
          />
        )}
      </Box>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        {isAdmin && (
          <Button variant='contained' onClick={handleMoveCreate}>
            등록
          </Button>
        )}
      </Box>
    </>
  );
}

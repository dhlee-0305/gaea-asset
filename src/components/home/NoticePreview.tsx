import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '@/common/utils/api';
import type { NoticeData } from '@/common/types/notice';

export default function NoticePreview() {
  const [noticeList, setNoticeList] = useState<NoticeData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getNoticeList();
  }, []);

  const getNoticeList = async () => {
    try {
      const response = await api.get('/notices', {
        params: {
          currentPage: 1,
          pageSize: 5,
        },
      });
      if (response.status === 200 && response.data.resultCode === '0000') {
        setNoticeList(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewAll = () => {
    navigate('/notice/notices');
  };

  const handleClickRow = (noticeNum: number) => {
    navigate(`/notice/notices/${noticeNum}`);
  };

  return (
    <Box border='1px solid #ccc' padding={2} borderRadius={2}>
      <Box display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant='h6'>
          <CampaignIcon sx={{ mr: 1 }} />
          공지사항
        </Typography>
        <Button size='small' onClick={handleViewAll}>
          전체보기
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 1 }}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell align='left'>제목</TableCell>
              <TableCell align='center'>작성자</TableCell>
              <TableCell align='center'>등록일자</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {noticeList.length > 0 ? (
              <>
                {noticeList.map((notice) => (
                  <TableRow
                    key={notice.noticeNum}
                    hover
                    sx={{ cursor: 'pointer', height: 35 }}
                    onClick={() => handleClickRow(Number(notice.noticeNum))}
                  >
                    <TableCell align='left'>{notice.title}</TableCell>
                    <TableCell align='center'>{notice.createUser}</TableCell>
                    <TableCell align='center'>
                      {notice.createDateTime}
                    </TableCell>
                  </TableRow>
                ))}
                {[...Array(5 - noticeList.length)].map((_, index) => (
                  <TableRow key={`empty-${index}`} sx={{ height: 35 }}>
                    <TableCell colSpan={3} />
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={3} align='center'>
                  등록된 공지사항이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

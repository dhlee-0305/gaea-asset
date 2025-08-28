import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  styled,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/store';
import { showAlert, showConfirm } from '@/store/dialogAction';

const MAX_FILE_SIZE_MB = 5; // 최대 파일 크기 (MB)

export default function ExcelUpload({
  sx = { fontSize: '11px', minWidth: 'auto', padding: '2px 8px' },
  children,
  excelUpload,
}: {
  sx?: object;
  children: React.ReactNode;
  excelUpload: (file: File) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const VisuallyHiddenInput = styled('input')({
    display: 'none',
  });

  useEffect(() => {
    if (!isOpen) {
      setUploadFile(null);
    }
  }, [isOpen]);

  // 파일 선택 처리
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        dispatch(
          showAlert({
            contents: `${MAX_FILE_SIZE_MB}MB 이하만 업로드 가능합니다.`,
          }),
        );
        return;
      }

      setUploadFile(file);
    }
  };

  // 엑셀 업로드 다이얼로그 열기
  const handleExcelUpload = () => {
    setIsOpen(true);
  };

  // 업로드 버튼 클릭 핸들러
  const handleUpload = async () => {
    if (!uploadFile) {
      dispatch(
        showAlert({
          contents: `업로드할 파일을 선택하세요.`,
        }),
      );
      return;
    }

    const confirmed = await dispatch(
      showConfirm({
        contents: '업로드하시겠습니까?',
      }),
    );

    if (!confirmed) return;

    setIsOpen(false);
    excelUpload(uploadFile);
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Button size='small' sx={sx} onClick={handleExcelUpload}>
        {children}
      </Button>
      <Dialog
        open={isOpen}
        slotProps={{
          paper: {
            sx: { minWidth: 450 },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>엑셀 업로드</DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleCancel}
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
              justifyContent: 'flex-start',
            }}
          >
            <Grid container alignItems='center' spacing={2}>
              <Grid>
                <Button
                  variant='outlined'
                  size='small'
                  component='label'
                  startIcon={<CloudUploadIcon />}
                >
                  파일 선택
                  <VisuallyHiddenInput
                    type='file'
                    onChange={handleFileChange}
                    accept='.xlsx, .xls'
                  />
                </Button>
              </Grid>
              {uploadFile ? (
                <Grid>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        height: 32,
                        border: '1px solid #eee',
                        borderRadius: 1,
                        padding: '2px 6px',
                      }}
                    >
                      <Typography
                        variant='body2'
                        sx={{
                          fontSize: '0.75rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '80%',
                        }}
                      >
                        📄 {uploadFile.name}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ) : (
                <Grid>
                  <Typography
                    variant='body2'
                    sx={{ fontSize: '0.75rem', color: 'gray' }}
                  >
                    업로드할 파일을 선택하세요.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleCancel}>
            취소
          </Button>
          <Button variant='contained' onClick={handleUpload}>
            업로드
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

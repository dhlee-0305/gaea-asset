import {
  Box,
  Button,
  Grid,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import React from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

import api from '@/common/utils/api';
import type { FileData } from '@/common/types/common';
import { showAlert } from '@/store/dialogAction';
import type { AppDispatch } from '@/store';

interface FileUploadProps {
  postType: string;
  existingFiles: FileData[];
  addedFiles: File[];
  setExistingFiles: React.Dispatch<React.SetStateAction<FileData[]>>;
  setAddedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  dispatch: AppDispatch;
}

const VisuallyHiddenInput = styled('input')({
  display: 'none',
});

const boxStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 32,
  border: '1px solid #eee',
  borderRadius: 1,
  padding: '2px 6px',
};

const textStyle = {
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '80%',
};

export default function FileUpload({
  postType,
  existingFiles,
  addedFiles,
  setExistingFiles,
  setAddedFiles,
  dispatch,
}: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const existingNames = [
        ...existingFiles.map((file) => file.originFileName),
        ...addedFiles.map((file) => file.name),
      ];
      const filtered = newFiles.filter(
        (file) => !existingNames.includes(file.name),
      );
      if (filtered.length < newFiles.length) {
        dispatch(
          showAlert({
            title: '알림',
            contents: '이미 등록된 파일입니다.',
          }),
        );
      }
      setAddedFiles((prev) => [...prev, ...filtered]);
    }
  };

  // 파일 삭제 처리
  const handleRemoveFile = async (fileNum: number) => {
    try {
      await api.delete(`/files/${postType}/${fileNum}`);
      setExistingFiles((prev) => prev.filter((f) => f.fileNum !== fileNum));
    } catch (error) {
      console.error('파일 삭제 실패:', error);
      dispatch(
        showAlert({
          title: '삭제 실패',
          contents: '파일 삭제 중 오류가 발생했습니다.',
        }),
      );
    }
  };

  // 파일 업로드 취소
  const handleUploadCancel = (index: number) => {
    setAddedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
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
            multiple
            hidden
            onChange={handleFileChange}
            accept='.jpg,.jpeg,.png,.gif,.pdf,.hwp,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt'
          />
        </Button>
      </Grid>
      {addedFiles.length === 0 && existingFiles.length === 0 && (
        <Grid spacing={12}>
          <Typography sx={{ fontSize: '0.8rem', color: 'gray' }}>
            선택된 파일 없음
          </Typography>
        </Grid>
      )}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {[...existingFiles, ...addedFiles].map((file, index) => {
          const isNewFile = !('fileNum' in file);
          const fileKey = isNewFile
            ? `new-${index}`
            : `existing-${file.fileNum}`;
          const fileName =
            'originFileName' in file ? file.originFileName : file.name;

          return (
            <Box key={fileKey} sx={boxStyle}>
              <Tooltip title={isNewFile ? '추가된 파일' : '등록된 파일'}>
                <Typography
                  sx={{
                    ...textStyle,
                    color: isNewFile ? 'blue' : 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  📄 {fileName}
                </Typography>
              </Tooltip>
              <IconButton
                size='small'
                onClick={() =>
                  isNewFile
                    ? handleUploadCancel(index)
                    : handleRemoveFile(file.fileNum)
                }
              >
                <CloseIcon fontSize='small' />
              </IconButton>
            </Box>
          );
        })}
      </Box>
    </Grid>
  );
}

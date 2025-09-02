import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

import api from '@/common/utils/api';
import type { NoticeData } from '@/common/types/notice';
import type { FileData } from '@/common/types/file';
import { MESSAGE } from '@/common/constants';
import PageHeader from '@/components/common/PageHeader';
import { showAlert, showConfirm } from '@/store/dialogAction';
import type { AppDispatch } from '@/store';
import { getToken, parseJwt } from '@/common/utils/auth';

export default function NoticeForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { noticeNum } = useParams();
  const noticeId = Number(noticeNum ?? 0);
  const isUpdate = !!noticeId;
  const token = getToken();
  const loginInfo = token ? parseJwt(token) : null;
  const [existingFiles, setExistingFiles] = useState<FileData[]>([]);
  const [addedFiles, setAddedFiles] = useState<File[]>([]);

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

  // useForm 선언
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoticeData>({
    defaultValues: {
      title: '',
      content: '',
      createDateTime: '',
      createUser: loginInfo?.empNum ?? '',
      fileList: [],
    },
  });

  useEffect(() => {
    // 공지사항 정보 조회
    if (isUpdate) {
      (async () => {
        try {
          const response = await api.get(`/notices/${noticeId}`);
          const { resultCode, description, data } = response.data;

          if (resultCode === '0000' && data) {
            reset(data);

            if (Array.isArray(data.fileList)) {
              setExistingFiles(data.fileList);
            }
          } else {
            dispatch(
              showAlert({
                title: '알림',
                contents: description || '서버 오류가 발생했습니다.',
              }),
            );
            navigate('/notice/notices');
          }
        } catch (error) {
          console.error(error);
          dispatch(
            showAlert({
              title: 'Error',
              contents: MESSAGE.error,
            }),
          );
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 파일 업로드 처리
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);

      setAddedFiles((prev) => {
        const existingNames = prev.map((file) => file.name);
        const filtered = newFiles.filter(
          (file) => !existingNames.includes(file.name),
        );
        return [...prev, ...filtered];
      });
    }
  };

  // 파일 삭제 처리
  const handleRemoveFile = async (fileNum: number) => {
    try {
      await api.delete(`/files/${fileNum}`);
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

  // 저장(등록, 수정) 처리
  const save = async (data: NoticeData): Promise<void> => {
    const confirmed = await dispatch(
      showConfirm({
        contents: '저장하시겠습니까?',
      }),
    );

    if (!confirmed) return;

    try {
      setIsLoading(true);

      const formData = new FormData();

      // 공지사항 데이터 추가
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('createUser', data.createUser);
      formData.append('createDateTime', data.createDateTime);

      if (isUpdate && loginInfo?.empNum != null) {
        formData.append('updateUser', String(loginInfo.empNum));
      }

      // 파일 추가
      addedFiles.forEach((file) => {
        formData.append('files', file);
      });

      const url = isUpdate ? `/notices/${noticeId}` : '/notices';
      const response = isUpdate
        ? await api.put(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          })
        : await api.post(url, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

      const { resultCode, description } = response.data;

      setIsLoading(false);

      if (resultCode === '0000' && data) {
        await dispatch(
          showAlert({
            contents: isUpdate
              ? '공지사항이 수정되었습니다.'
              : '공지사항이 등록되었습니다.',
          }),
        );
        handleCancel();
      } else if (resultCode === '400') {
        dispatch(
          showAlert({
            title: '오류',
            contents: description || '요청이 잘못되었습니다.',
          }),
        );
      } else {
        dispatch(
          showAlert({
            title: '알림',
            contents: description || '서버 오류가 발생했습니다.',
          }),
        );
        navigate('/notice/notices');
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      dispatch(
        showAlert({
          title: 'Error',
          contents: MESSAGE.error,
        }),
      );
    }
  };

  // 목록 화면 이동
  const handleCancel = (): void => {
    if (isUpdate) {
      navigate(`/notice/notices/${noticeId}`);
    } else {
      navigate('/notice/notices');
    }
  };

  return (
    <>
      <PageHeader contents={isUpdate ? '공지사항 수정' : '공지사항 등록'} />
      <Box sx={{ maxWidth: 600, mx: 'auto' }}>
        <form onSubmit={handleSubmit(save)} encType='multipart/form-data'>
          <Paper sx={{ p: 4, mb: 4 }} elevation={4}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <TextField
                  label='제목'
                  fullWidth
                  size='small'
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('title', { required: '제목은 필수입니다.' })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              </Grid>

              {isUpdate && (
                <Grid size={12}>
                  <TextField
                    label='부서/작성자'
                    fullWidth
                    size='small'
                    variant='outlined'
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    {...register('createUser')}
                    disabled
                  />
                </Grid>
              )}

              {isUpdate && (
                <Grid size={12}>
                  <TextField
                    label='등록일자'
                    fullWidth
                    size='small'
                    variant='outlined'
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    {...register('createDateTime')}
                    disabled
                  />
                </Grid>
              )}

              <Grid size={12}>
                <TextField
                  label='내용'
                  multiline
                  minRows={4}
                  fullWidth
                  variant='outlined'
                  slotProps={{
                    inputLabel: {
                      shrink: true,
                    },
                  }}
                  {...register('content', { required: '내용은 필수입니다.' })}
                  error={!!errors.content}
                  helperText={errors.content?.message}
                />
              </Grid>
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
                      onChange={handleFileChange}
                      accept='.jpg,.jpeg,.png, .gif,.pdf,.hwp,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.csv,.txt'
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
                      'originFileName' in file
                        ? file.originFileName
                        : file.name;

                    return (
                      <Box key={fileKey} sx={boxStyle}>
                        <Tooltip
                          title={isNewFile ? '추가된 파일' : '등록된 파일'}
                        >
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
            </Grid>
            <Box
              sx={{
                mt: 3,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              <Button variant='outlined' onClick={handleCancel}>
                취소
              </Button>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                loading={isLoading}
                loadingPosition='start'
              >
                저장
              </Button>
            </Box>
          </Paper>
        </form>
      </Box>
    </>
  );
}

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch } from 'react-redux';

import PageHeader from '@/components/common/PageHeader';
import { MESSAGE } from '@/common/constants';
import { showAlert, showConfirm } from '@/store/dialogAction';
import api from '@/common/utils/api';
import type { AppDispatch } from '@/store';
import type { CodeData } from '@/common/types/code';

export default function CodeManager() {
  const [codes, setCodes] = useState<CodeData[]>([]);
  const [originalCodes, setOriginalCodes] = useState<Record<number, CodeData>>(
    {},
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [nextId, setNextId] = useState<number>(1000); // 로컬용 ID
  const dispatch = useDispatch<AppDispatch>();

  const [newlyAddedId, setNewlyAddedId] = useState<number | null>(null);
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/codes');
      if (response.status === 200 && response.data.resultCode === '0000') {
        let tempId = nextId;
        const rawData: CodeData[] = response.data.data;
        const enrichedData = rawData.map((item) => ({
          ...item,
          id: tempId++,
          isNew: false,
          isEditing: false,
          isDeletable: true,
        }));
        setCodes(enrichedData);

        const originalData: Record<number, CodeData> = {};
        enrichedData.forEach((item) => {
          originalData[item.id] = { ...item };
        });
        setOriginalCodes(originalData);
        setNextId(tempId);
      } else {
        dispatch(
          showAlert({ title: '공통코드 조회 실패', contents: MESSAGE.error }),
        );
      }
    } catch (error) {
      console.error('공통코드 조회 실패:', error);
      dispatch(
        showAlert({ title: '공통코드 조회 실패', contents: MESSAGE.error }),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);
  // 새 행 추가 후 첫 번째 입력란에 포커스 주기
  useEffect(() => {
    if (newlyAddedId !== null) {
      const input = inputRefs.current[newlyAddedId];
      if (input) {
        input.focus();
      }
      setNewlyAddedId(null);
    }
  }, [newlyAddedId]);

  const handleAdd = () => {
    const hasEmptyRow = codes.some(
      (code) =>
        !code.category && !code.categoryName && !code.code && !code.codeName,
    );

    if (hasEmptyRow) {
      dispatch(
        showAlert({
          title: '',
          contents: '먼저 추가된 입력 항목을 완료하거나 삭제해주세요.',
        }),
      );
      return;
    }

    const newId = nextId;
    setCodes((prev) => [
      ...prev,
      {
        id: newId,
        category: '',
        categoryName: '',
        code: '',
        codeName: '',
        isNew: true,
        isEditing: true,
        isDeletable: true,
      },
    ]);
    setNextId((prev) => prev + 1);
    setNewlyAddedId(newId); // 새로 추가된 id 저장
  };

  const handleChange = (id: number, field: keyof CodeData, value: string) => {
    setCodes((prev) =>
      prev.map((code) => (code.id === id ? { ...code, [field]: value } : code)),
    );
  };

  const handleRemove = (id: number) => {
    setCodes((prev) => prev.filter((code) => code.id !== id));
  };

  const handleDelete = async (category: string, code: string) => {
    const confirmed = await dispatch(
      showConfirm({ contents: '공통 코드를 삭제하시겠습니까?' }),
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/codes/${category}/${code}`);

      if (response.status === 200 && response.data.resultCode === '0000') {
        dispatch(
          showAlert({ title: '', contents: '공통 코드가 삭제되었습니다.' }),
        );
        fetchCodes();
      } else {
        dispatch(
          showAlert({ title: '공통 코드 삭제 실패', contents: MESSAGE.error }),
        );
      }
    } catch (error) {
      console.error('공통코드 삭제 실패:', error);
      dispatch(
        showAlert({ title: '공통 코드 삭제 실패', contents: MESSAGE.error }),
      );
    }
  };

  const toggleEditMode = (id: number) => {
    const code = codes.find((c) => c.id === id);
    if (code && !code.isEditing) {
      setOriginalCodes((prev) => ({
        ...prev,
        [id]: { ...code },
      }));
    }

    setCodes((prev) =>
      prev.map((code) =>
        code.id === id ? { ...code, isEditing: !code.isEditing } : code,
      ),
    );
  };

  const handleCancelEdit = (id: number) => {
    const original = originalCodes[id];
    if (original) {
      setCodes((prev) =>
        prev.map((code) =>
          code.id === id ? { ...original, isEditing: false } : code,
        ),
      );
    }
  };

  const handleSave = async (code: CodeData) => {
    if (!code.category || !code.categoryName || !code.code || !code.codeName) {
      dispatch(showAlert({ title: '', contents: '모든 항목을 입력해주세요.' }));
      return;
    }

    try {
      let response;

      if (code.isNew) {
        const isDuplicate = codes.some(
          (c) =>
            !c.isNew && c.category === code.category && c.code === code.code,
        );
        if (isDuplicate) {
          dispatch(
            showAlert({ title: '', contents: '이미 존재하는 코드입니다.' }),
          );
          return;
        }

        response = await api.post('/codes', code);
      } else {
        response = await api.put('/codes', code);
      }

      if (response.status === 200 && response.data.resultCode === '0000') {
        dispatch(showAlert({ title: '', contents: '저장되었습니다.' }));
        fetchCodes();
      } else {
        dispatch(
          showAlert({ title: '공통코드 저장 실패', contents: MESSAGE.error }),
        );
      }
    } catch (error) {
      console.error('공통코드 저장 실패:', error);
      dispatch(
        showAlert({ title: '공통코드 저장 실패', contents: MESSAGE.error }),
      );
    }
  };

  return (
    <Box p={2}>
      <PageHeader contents='공통 코드 관리' />
      <Box display='flex' justifyContent='flex-end' mb={2}>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size='small'
        >
          코드 추가
        </Button>
      </Box>

      {loading ? (
        <Box mt={4} textAlign='center'>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size='small'>
            <TableHead>
              <TableRow sx={{ height: 36 }}>
                <TableCell>그룹 코드</TableCell>
                <TableCell>그룹 명</TableCell>
                <TableCell>코드</TableCell>
                <TableCell>코드명</TableCell>
                <TableCell align='right'>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {codes.map((code) => (
                <TableRow key={code.id} sx={{ height: 36 }}>
                  <TableCell>
                    <TextField
                      fullWidth
                      size='small'
                      variant='standard'
                      value={code.category}
                      onChange={(e) =>
                        handleChange(code.id, 'category', e.target.value)
                      }
                      disabled={!code.isNew}
                      inputRef={(el) => (inputRefs.current[code.id] = el)}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size='small'
                      variant='standard'
                      value={code.categoryName}
                      onChange={(e) =>
                        handleChange(code.id, 'categoryName', e.target.value)
                      }
                      disabled={!code.isNew && !code.isEditing}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size='small'
                      variant='standard'
                      value={code.code}
                      onChange={(e) =>
                        handleChange(code.id, 'code', e.target.value)
                      }
                      disabled={!code.isNew}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      size='small'
                      variant='standard'
                      value={code.codeName}
                      onChange={(e) =>
                        handleChange(code.id, 'codeName', e.target.value)
                      }
                      disabled={!code.isNew && !code.isEditing}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    {code.isNew ? (
                      <>
                        <Button
                          variant='outlined'
                          size='small'
                          startIcon={<SaveIcon />}
                          onClick={() => handleSave(code)}
                          sx={{ mr: 1 }}
                        >
                          등록
                        </Button>
                        <IconButton
                          onClick={() => handleRemove(code.id)}
                          size='small'
                          color='error'
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : code.isEditing ? (
                      <>
                        <Button
                          variant='contained'
                          size='small'
                          startIcon={<SaveIcon />}
                          onClick={() => handleSave(code)}
                          sx={{ mr: 1 }}
                        >
                          저장
                        </Button>
                        <IconButton
                          onClick={() => handleCancelEdit(code.id)}
                          size='small'
                          color='warning'
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <Button
                          variant='outlined'
                          size='small'
                          startIcon={<EditIcon />}
                          onClick={() => toggleEditMode(code.id)}
                          sx={{ mr: 1 }}
                        >
                          수정
                        </Button>
                        {code.isDeletable && (
                          <IconButton
                            onClick={() =>
                              handleDelete(code.category, code.code)
                            }
                            size='small'
                            color='error'
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {codes.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} align='center'>
                    등록된 코드가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

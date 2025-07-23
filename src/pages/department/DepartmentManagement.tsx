import GroupIcon from '@mui/icons-material/Group';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BusinessIcon from '@mui/icons-material/Business';
import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import api from '@/common/utils/api';

type Dept = {
  orgId?: string | number;
  orgName: string;
  parentOrgId?: string | number | null;
  orgType?: string;
};

export default function DepartmentManagement() {
  const [departments, setDepartments] = useState<Dept[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [editDept, setEditDept] = useState<Dept | null>(null);

  // Dialog 닫힘 시 상태 초기화
  const handleDialogClose = () => {
    setOpen(false);
    setEditDept(null);
    setInput('');
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get<{ data: Dept[] }>('/organization');
      setDepartments(res.data.data);
    } catch {
      setError('부서 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 부서 등록
  const handleAdd = (
    parentOrgId?: string | number | null,
    orgType?: string,
  ) => {
    setEditDept({ orgName: '', parentOrgId, orgType });
    setInput('');
    setOpen(false);
    setTimeout(() => {
      setOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }, 0);
  };

  // 부서 수정
  const handleEdit = async (dept: Dept) => {
    setEditDept(dept);
    setInput(dept.orgName);
    setOpen(true);
  };

  // 회사 등록
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleCompanySubmit = async () => {
    if (!input.trim() || submitLoading) return;
    setSubmitLoading(true);
    try {
      await api.post('/organization', { orgName: input });
      setOpen(false);
      fetchDepartments();
    } catch {
      alert('등록 실패');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 하위 부서 등록
  const handleDeptSubmit = async () => {
    if (!input.trim() || !editDept?.parentOrgId || submitLoading) return;
    setSubmitLoading(true);
    try {
      await api.post(`/organization/${editDept.parentOrgId}/child`, {
        orgName: input,
      });
      setOpen(false);
      fetchDepartments();
    } catch {
      alert('등록 실패');
    } finally {
      setSubmitLoading(false);
    }
  };

  // 수정
  const handleEditSubmit = async () => {
    if (!input.trim() || !editDept?.orgId) return;
    try {
      await api.put(`/organization/${editDept.orgId}`, {
        ...editDept,
        orgName: input,
      });
      setOpen(false);
      fetchDepartments();
    } catch {
      alert('수정 실패');
    }
  };

  // 부서 삭제
  const handleDelete = async (dept: Dept) => {
    if (!window.confirm(`삭제하시겠습니까? (${dept.orgName})`)) return;
    try {
      await api.put(`/organization/${dept.orgId}/inactive`);
      fetchDepartments();
    } catch {
      alert('삭제 실패');
    }
  };

  // 엑셀 업로드

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post('/organization/excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchDepartments();
      alert('엑셀 업로드 성공');
    } catch {
      alert('엑셀 업로드 실패');
    }
    e.target.value = '';
  };

  // 계층 구조
  function buildTree(
    list: Dept[],
    parentId: string | number | null = null,
  ): (Dept & { children?: Dept[] })[] {
    return list
      .filter((dept) => (dept.parentOrgId ?? null) === parentId)
      .map((dept) => ({
        ...dept,
        children: buildTree(list, dept.orgId),
      }));
  }

  // 모든 아코디언 펼친 상태
  function renderAccordion(nodes: (Dept & { children?: Dept[] })[], level = 0) {
    return nodes.map((dept) => {
      // 아이콘 및 텍스트 스타일 분기
      let icon = null;
      let nameStyle = {};
      if (dept.orgType === 'DIVISION') {
        icon = (
          <ApartmentIcon
            style={{ color: '#388e3c', fontSize: 18, marginRight: 4 }}
          />
        );
        nameStyle = { fontWeight: 500 };
      } else if (dept.orgType === 'TEAM') {
        icon = (
          <GroupIcon
            style={{ color: '#fbc02d', fontSize: 18, marginRight: 4 }}
          />
        );
        nameStyle = { fontWeight: 400 };
      } else {
        icon = (
          <BusinessIcon
            style={{ color: '#1976d2', fontSize: 20, marginRight: 4 }}
          />
        );
        nameStyle = { fontWeight: 700 };
      }

      if (dept.children && dept.children.length > 0) {
        return (
          <Accordion
            key={dept.orgId}
            defaultExpanded
            disableGutters
            style={{ marginLeft: level * 2, boxShadow: 'none', border: 'none' }}
          >
            <AccordionSummary style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Box
                style={{ display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <Typography
                  style={{ flex: 1, display: 'flex', alignItems: 'center' }}
                >
                  {icon}
                  <span style={nameStyle}>{dept.orgName}</span>
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction='row' spacing={1} style={{ marginLeft: 8 }}>
                {dept.orgType !== 'TEAM' && (
                  <IconButton
                    size='small'
                    onClick={() => handleAdd(dept.orgId)}
                  >
                    <AddIcon fontSize='small' style={{ color: '#bdbdbd' }} />
                  </IconButton>
                )}
                <IconButton size='small' onClick={() => handleEdit(dept)}>
                  <EditIcon fontSize='small' style={{ color: '#bdbdbd' }} />
                </IconButton>
                <IconButton size='small' onClick={() => handleDelete(dept)}>
                  <DeleteIcon fontSize='small' style={{ color: '#bdbdbd' }} />
                </IconButton>
              </Stack>
              {renderAccordion(dept.children, level + 1)}
            </AccordionDetails>
          </Accordion>
        );
      } else {
        return (
          <Box
            key={dept.orgId}
            style={{
              marginLeft: level * 2,
              marginTop: 8,
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography
              style={{ flex: 1, display: 'flex', alignItems: 'center' }}
            >
              {icon}
              <span style={nameStyle}>{dept.orgName}</span>
            </Typography>
            <Stack direction='row' spacing={1} style={{ marginLeft: 8 }}>
              {dept.orgType !== 'TEAM' && (
                <IconButton
                  size='small'
                  onClick={() => handleAdd(dept.orgId, dept.orgType)}
                >
                  <AddIcon fontSize='small' style={{ color: '#bdbdbd' }} />
                </IconButton>
              )}
              <IconButton size='small' onClick={() => handleEdit(dept)}>
                <EditIcon fontSize='small' style={{ color: '#bdbdbd' }} />
              </IconButton>
              <IconButton size='small' onClick={() => handleDelete(dept)}>
                <DeleteIcon fontSize='small' style={{ color: '#bdbdbd' }} />
              </IconButton>
            </Stack>
          </Box>
        );
      }
    });
  }

  const tree = buildTree(departments);

  return (
    <Box>
      <Typography variant='h5' style={{ marginBottom: 16, fontWeight: 700 }}>
        부서 관리
      </Typography>
      <Stack
        direction='row'
        spacing={1}
        style={{ marginBottom: 16, justifyContent: 'flex-end' }}
      >
        <Button
          variant='contained'
          color='primary'
          startIcon={<AddIcon />}
          onClick={() => handleAdd(null, 'TOP')}
          disabled={submitLoading}
        >
          회사 등록
        </Button>
        <Button
          variant='contained'
          color='success'
          startIcon={<UploadFileIcon />}
          onClick={() => fileInputRef.current?.click()}
          sx={{ display: 'none' }}
        >
          엑셀 업로드
        </Button>
        <input
          ref={fileInputRef}
          type='file'
          accept='.xlsx,.xls'
          style={{ display: 'none' }}
          onChange={handleExcelUpload}
        />
      </Stack>
      <Paper style={{ padding: 8 }}>
        {loading ? (
          <Typography>로딩 중...</Typography>
        ) : error ? (
          <Typography color='error'>{error}</Typography>
        ) : departments.length === 0 ? (
          <Typography
            style={{ color: '#888', textAlign: 'center', padding: '48px 0' }}
          >
            등록된 부서정보가 없습니다.
          </Typography>
        ) : (
          renderAccordion(tree)
        )}
      </Paper>
      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>
          {editDept?.orgType === 'TOP'
            ? '회사 등록'
            : editDept?.orgId
              ? '부서 수정'
              : '부서 등록'}
        </DialogTitle>
        <DialogContent>
          <TextField
            inputRef={inputRef}
            autoFocus
            margin='dense'
            label={editDept?.orgType === 'TOP' ? '회사명' : '부서명'}
            fullWidth
            value={input}
            onChange={(e) => {
              let value = e.target.value;
              // 50자 제한
              if (value.length > 50) value = value.slice(0, 50);
              setInput(value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>취소</Button>
          <Button
            onClick={
              editDept?.orgId
                ? handleEditSubmit
                : editDept?.orgType === 'TOP'
                  ? handleCompanySubmit
                  : handleDeptSubmit
            }
            disabled={submitLoading}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

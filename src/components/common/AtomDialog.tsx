import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';

import type { RootState } from '@/store';
import { resolveDialog } from '@/store/dialogAction';

export default function AtomDialog() {
  const dispatch = useDispatch();
  const { dialog } = useSelector((state: RootState) => state.dialog);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (dialog.visible) {
      setInputValue(dialog.input?.defaultValue ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog.visible]);

  const handleClose = (result: boolean | string | null) => {
    if (dialog.input) {
      if (result === true) {
        resolveDialog(inputValue, dispatch);
      } else {
        resolveDialog(null, dispatch);
      }
    } else {
      resolveDialog(result as boolean, dispatch);
    }
  };

  return (
    <>
      {/* Dialog */}
      <Dialog
        slotProps={{
          paper: {
            sx: { minWidth: 250 },
          },
        }}
        open={dialog.visible}
        onClose={() => handleClose(false)}
      >
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          {dialog.contents}
          {dialog.input && (
            <TextField
              placeholder={dialog.input.placeholder}
              required={dialog.input.required}
              minRows={dialog.input?.minRows ?? 3}
              helperText={dialog.input.helperText}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              fullWidth
              multiline
              margin='normal'
            />
          )}
        </DialogContent>
        <DialogActions>
          {dialog.cancelButtonLabel && (
            <Button onClick={() => handleClose(false)}>
              {dialog.cancelButtonLabel}
            </Button>
          )}
          <Button onClick={() => handleClose(true)} autoFocus>
            {dialog.confirmButtonLabel ?? '확인'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

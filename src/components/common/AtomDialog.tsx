import { useSelector, useDispatch } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

import type { RootState } from '@/store';
import { resolveDialog } from '@/store/dialogAction';

export default function AtomDialog() {
  const dispatch = useDispatch();
  const { dialog } = useSelector((state: RootState) => state.dialog);

  const handleClose = (result: boolean) => {
    resolveDialog(result, dispatch);
  };

  return (
    <>
      {/* Dialog */}
      <Dialog open={dialog.visible} onClose={() => handleClose(false)}>
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>{dialog.contents}</DialogContent>
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

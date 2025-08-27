import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface DialogState {
  visible: boolean;
  title?: string;
  contents: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  input?: DialogInput;
}

interface DialogInput {
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  minRows?: number;
  helperText?: string;
}

const initialState: { dialog: DialogState } = {
  dialog: {
    visible: false,
    title: '',
    contents: '',
    confirmButtonLabel: '',
    cancelButtonLabel: '',
    input: undefined,
  },
};

const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    showDialog: (
      state,
      action: PayloadAction<{
        title?: string;
        contents: string;
        confirmButtonLabel?: string;
        cancelButtonLabel?: string;
        input?: DialogInput;
      }>,
    ) => {
      state.dialog = {
        visible: true,
        title: action.payload.title || '',
        contents: action.payload.contents,
        confirmButtonLabel: action.payload.confirmButtonLabel,
        cancelButtonLabel: action.payload.cancelButtonLabel,
        input: action.payload.input,
      };
    },
    hideDialog: (state) => {
      state.dialog.visible = false;
    },
  },
});

export const { showDialog, hideDialog } = dialogSlice.actions;
export default dialogSlice.reducer;

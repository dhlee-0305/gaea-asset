import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface DialogState {
  visible: boolean;
  title?: string;
  contents: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
}

const initialState: { dialog: DialogState } = {
  dialog: {
    visible: false,
    title: '',
    contents: '',
    confirmButtonLabel: '',
    cancelButtonLabel: '',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showDialog: (
      state,
      action: PayloadAction<{
        title?: string;
        contents: string;
        confirmButtonLabel?: string;
        cancelButtonLabel?: string;
      }>,
    ) => {
      state.dialog = {
        visible: true,
        title: action.payload.title || '',
        contents: action.payload.contents,
        confirmButtonLabel: action.payload.confirmButtonLabel,
        cancelButtonLabel: action.payload.cancelButtonLabel,
      };
    },
    hideDialog: (state) => {
      state.dialog.visible = false;
    },
  },
});

export const { showDialog, hideDialog } = uiSlice.actions;
export default uiSlice.reducer;

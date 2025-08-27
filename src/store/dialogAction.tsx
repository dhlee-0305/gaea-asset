import { showDialog, hideDialog } from '@/store/dialogSlice';
import type { AppDispatch } from '@/store';

let resolver: ((result: boolean | string | null) => void) | null = null;

// Alert 창 호출
export const showAlert = (payload: {
  title?: string;
  contents: string;
  confirmButtonLabel?: string;
}) => {
  return (dispatch: AppDispatch): Promise<void> => {
    return new Promise((resolve) => {
      resolver = () => {
        resolve(); // 무조건 resolve (확인만 있음)
      };
      dispatch(
        showDialog({
          ...payload,
          cancelButtonLabel: undefined, // 취소 버튼 제거
        }),
      );
    });
  };
};

// Confirm 창 호출
export const showConfirm = (payload: {
  title?: string;
  contents: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
}) => {
  return (dispatch: AppDispatch): Promise<boolean> => {
    return new Promise((resolve) => {
      resolver = (result) => resolve(result as boolean);
      dispatch(
        showDialog({
          ...payload,
          confirmButtonLabel: payload.confirmButtonLabel ?? '확인',
          cancelButtonLabel: payload.cancelButtonLabel ?? '취소',
        }),
      );
    });
  };
};

// Prompt 창 호출 (텍스트/텍스트에어리어 입력 지원)
export const showPrompt = (payload: {
  title?: string;
  contents: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  // input 옵션
  type?: 'text' | 'textarea';
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  minRows?: number;
  helperText?: string;
}) => {
  return (dispatch: AppDispatch): Promise<string | null> => {
    return new Promise((resolve) => {
      resolver = (result) => resolve(result as string | null);
      dispatch(
        showDialog({
          title: payload.title,
          contents: payload.contents,
          confirmButtonLabel: payload.confirmButtonLabel ?? '확인',
          cancelButtonLabel: payload.cancelButtonLabel ?? '취소',
          input: {
            placeholder: payload.placeholder,
            defaultValue: payload.defaultValue,
            required: payload.required,
            minRows: payload.minRows,
            helperText: payload.helperText,
          },
        }),
      );
    });
  };
};

export const resolveDialog = (
  result: boolean | string | null,
  dispatch: AppDispatch,
) => {
  if (resolver) {
    resolver(result);
    resolver = null;
  }
  dispatch(hideDialog());
};

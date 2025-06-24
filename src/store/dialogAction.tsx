import { showDialog, hideDialog } from '@/store/dialogSlice';
import type { AppDispatch } from '@/store';

let resolver: ((result: boolean) => void) | null = null;

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
      resolver = resolve;
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

export const resolveDialog = (result: boolean, dispatch: AppDispatch) => {
  if (resolver) {
    resolver(result);
    resolver = null;
  }
  dispatch(hideDialog());
};

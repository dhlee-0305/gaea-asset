import api from '@/common/utils/api';
import { showAlert } from '@/store/dialogAction';
import type { AppDispatch } from '@/store';
import { MESSAGE } from '@/common/constants';

// 파일 다운로드
export async function FileDownload({
  fileNum,
  postType,
  originFileName,
  dispatch,
}: {
  fileNum: number;
  postType: string;
  originFileName: string;
  dispatch: AppDispatch;
}) {
  let blobUrl: string | null = null;
  try {
    const response = await api.get(`/files/${postType}/${fileNum}`, {
      responseType: 'blob',
    });
    blobUrl = window.URL.createObjectURL(response.data);
    const downloadLink = document.createElement('a');
    downloadLink.href = blobUrl;
    downloadLink.setAttribute('download', originFileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error('파일 다운로드 실패:', error);
    dispatch(
      showAlert({
        title: 'Error',
        contents: MESSAGE.error,
      }),
    );
  } finally {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
  }
}

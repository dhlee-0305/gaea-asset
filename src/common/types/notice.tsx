import type { FileData } from './file';

// 공지사항 데이터
export interface NoticeData {
  rowNum?: number;
  noticeNum?: number;
  title: string;
  content: string;
  createDateTime: string;
  createUser: string;
  updateDateTime?: string;
  updateUser?: string;
  fileList?: FileData[];
}

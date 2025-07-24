// 공지사항 데이터
export interface NoticeData {
  noticeNum?: number;
  title: string;
  content: string;
  createDateTime: string;
  createUser: string;
  updateDateTime?: string;
  updateUser?: string;
}

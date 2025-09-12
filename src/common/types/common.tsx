// 페이지 정보
export interface PageInfo {
  /* 페이지 크기 */
  pageSize: number;
  /* 현재 페이지 */
  currentPage: number;
  /* 전체 데이터 개수 */
  totalCount?: number;
  /* 전체 페이지 개수 */
  totalPageCnt?: number;
}

// 파일 데이터
export interface FileData {
  fileNum: number;
  originFileName: string;
  storedFileName: string;
  uploadDateTime: string;
  isDeleted: string;
  postNum: number;
  postType: string;
}

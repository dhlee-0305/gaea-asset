import type { Dayjs } from 'dayjs';

// 장비 데이터
export interface DeviceData {
  /* 장비순번 */
  deviceNum: number;
  /* 사원번호 */
  empNum: number;
  /* 사용자명 */
  userName: string;
  /* 조직명 */
  orgName: string;
  /* 기존 장비 관리 번호 */
  oldDeviceId: string;
  /* 용도구분 */
  usageDivision: string;
  /* 사용용도 */
  usagePurpose: string;
  /* 사용/보관 위치 */
  archiveLocation: string;
  /* 장비 유형 코드 */
  deviceTypeCode: string;
  /* 장비 유형 */
  deviceType: string;
  /* 제조사 코드 */
  manufacturerCode: string;
  /* 모델명 */
  modelName: string;
  /* 제조일자 */
  manufactureDate: string;
  /* CPU 사양 */
  cpuSpec: string;
  /* 메모리 */
  memorySize: number;
  /* 스토리지 정보 */
  storageInfo: string;
  /* 운영체제 */
  operatingSystem: string;
  /* 화면 크기 */
  screenSize: number;
  /* GPU */
  gpuSpec: number;
  /* 장비 상태 */
  status: string;
  /* 구매일자 */
  purchaseDate: Dayjs | null;
  /* 반납일자 */
  returnDate: Dayjs | null;
  /* 비고 */
  remarks: string;
  /* 생성일시 */
  createDatetime: string;
  /* 생성자 */
  createUser: string;
  /* 최종 변경일시 */
  updateDatetime: string;
  /* 최종 변경자 */
  updateUser: string;
}

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
  /* 용도구분 코드 */
  usageDivisionCode: string;
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
  manufacturer: string;
  /* 모델명 */
  modelName: string;
  /* 제조일자 */
  manufactureDate: string;
  /* CPU 사양 */
  cpuSpec: string;
  /* 메모리 */
  memorySize: string;
  /* 스토리지 정보 */
  storageInfo: string;
  /* 운영체제 */
  operatingSystem: string;
  /* 화면 크기 */
  screenSize: string;
  /* GPU */
  gpuSpec: string;
  /* 장비 상태 코드*/
  deviceStatusCode: string;
  /* 장비 상태 */
  deviceStatus: string;
  /* 결재 상태 코드*/
  approvalStatusCode: string;
  /* 결재 상태 */
  approvalStatus: string;
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
  /* 장비 변경 요청 사유 */
  changeReason: string;
}

export const deviceLabels: Partial<Record<keyof DeviceData, string>> = {
  userName: '장비담당자',
  deviceStatus: '장비 상태',
  deviceType: '장비 유형',
  usageDivision: '용도 구분',
  usagePurpose: '사용용도',
  archiveLocation: '사용/보관 위치',
  oldDeviceId: '기존 장비관리번호',
  manufacturer: '제조사',
  modelName: '모델명',
  manufactureDate: '제조년도',
  cpuSpec: 'CPU',
  memorySize: '메모리',
  storageInfo: 'SSD/HDD',
  operatingSystem: 'OS',
  screenSize: '인치',
  gpuSpec: 'GPU',
  purchaseDate: '구매 일자',
  returnDate: '반납 일자',
  remarks: '비고',
  changeReason: '변경 사유',
};

// 장비 이력 데이터
export interface DeviceHistoryData {
  /* 이력 순번 */
  historyNum: number;
  /* 장비 번호 */
  deviceNum: string;
  /* 사원번호 */
  empNum?: number;
  /* 장비 유형 */
  deviceType: string;
  /* 현재 담당자 */
  userName: string;
  /* 장비 상태 */
  deviceStatus: string;
  /* 결재 상태 */
  approvalStatus: string;
  /* 변경일시 */
  createDatetime: string;
  /* 생성자 */
  createUser?: number;
  /* 모델명 */
  modelName?: string;
  /* 변경 내용 */
  changeContents?: string;
  /* 사유 */
  reason?: string;
  /* 장비 상태 코드 */
  deviceStatusCode?: string;
  /* 결재 상태 코드 */
  approvalStatusCode?: string;
  /* 수정일 */
  modifyDate?: string;
}

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
  userName: '담당자',
  usagePurpose: '사용용도',
  oldDeviceId: '기존 장비관리번호',
  deviceType: '장비 유형',
  modelName: '모델명',
  manufactureDate: '제조년도',
  cpuSpec: 'CPU',
  memorySize: '메모리',
  storageInfo: 'SSD/HDD',
  operatingSystem: 'OS',
  screenSize: '인치',
  purchaseDate: '구매일자',
  returnDate: '반납일자',
  deviceStatus: '장비 상태',
  changeReason: '변경 사유',
};

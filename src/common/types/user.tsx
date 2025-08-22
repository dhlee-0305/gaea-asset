// 사용자 데이터
export interface UserData {
  no: number;
  empNum: number;
  userId: string;
  userName: string;
  orgName: string;
  password: string;
  orgId: number | string;
  userPositionCd: string;
  userPositionName: string;
  userGradeCd: string;
  userGradeName: string;
  roleCode: string;
  isEmployed: string;
  passwordChangeDate: string;
  createDatetime: string;
  passwordResetReq: string;
}

export const USER_ROLE = {
  USER: '00',
  TEAM_MANAGER: '01',
  ASSET_MANAGER: '02',
  SYSTEM_MANAGER: '03',
};

export const MESSAGE = {
  error: '오류가 발생했습니다.',
  login_error: '아이디 또는 비밀번호를 확인하세요.',
};

export const VALID_RULES = {
  mobile: {
    regex: /^\d{3}-\d{3,4}-\d{4}$/,
    message: '휴대전화 형식이 올바르지 않습니다.',
  },
  email: {
    regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: '이메일 형식이 올바르지 않습니다.',
  },
  whiteSpace: {
    regex: /\s/g,
  },
};

export const CODE = {
  deviceType: [
    { code: 'PC', codeName: '컴퓨터' },
    { code: 'MO', codeName: '모니터' },
    { code: 'HP', codeName: '핸드폰' },
    { code: 'ETC', codeName: '기타' },
  ],
  deviceStatus: [
    { code: '01', codeName: '사용' },
    { code: '02', codeName: '반납' },
    { code: '03', codeName: '파손' },
    { code: '04', codeName: '폐기' },
  ],
  approvalStatus: [
    { code: 'A1', codeName: '부서장 승인대기' },
    { code: 'A2', codeName: '관리자 승인대기' },
    { code: 'A3', codeName: '승인완료' },
    { code: 'A4', codeName: '반려' },
  ],
  usageDivision: [
    { code: '01', codeName: '업무용' },
    { code: '02', codeName: '개발용' },
    { code: '03', codeName: '실증용' },
  ],
  userPositionCd: [
    { code: '03', codeName: '팀장' },
    { code: '04', codeName: '팀원' },
  ],
  orgId: [
    { code: 121, orgName: '지능형플랫폼사업팀' },
    { code: 122, orgName: '전략사업팀' },
    { code: 123, orgName: 'D-Inno 개발팀' },
    { code: 124, orgName: '플랫폼개발팀' },
    { code: 125, orgName: '오픈서비스사업팀' },
    { code: 126, orgName: '비즈니스 기술연구소' },
    { code: 127, orgName: 'SD본부' },
  ],
  userGradeCd: [
    { code: '03', userGradeName: '부장' },
    { code: '04', userGradeName: '차장' },
    { code: '05', userGradeName: '과장' },
    { code: '06', userGradeName: '대리' },
    { code: '07', userGradeName: '사원' },
  ],
};

export const USER_ROLE = {
  USER: '00',
  TEAM_MANAGER: '01',
  ASSET_MANAGER: '02',
  SYSTEM_MANAGER: '03',
};

export const DEVICE_APPROVAL_STATUS = {
  TEAM_MANAGER_PENDING: 'A1',
  ADMIN_PENDING: 'A2',
  APPROVED: 'A3',
  REJECTED: 'A4',
};

export const DEVICE_TYPE = {
  COMPUTER: 'PC',
  MONITOR: 'MO',
  PHONE: 'HP',
  ETC: 'ETC',
};

export const DEVICE_STATUS = {
  USE: '01',
  RETURN: '02',
  BREAKAGE: '03',
  DISPOSAL: '04',
};

export const USAGE_DIVISION = {
  BUSINESS: '01',
  DEVELOPMENT: '02',
};

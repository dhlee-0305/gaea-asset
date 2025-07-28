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
};

export const CODE = {
  deviceType: [
    { code: 'PC', codeName: '컴퓨터' },
    { code: 'MO', codeName: '모니터' },
    { code: 'HP', codeName: '핸드폰' },
    { code: 'ETC', codeName: '기타' },
  ],
  deviceStatus: [
    { code: '01', codeName: '대기' },
    { code: '02', codeName: '사용' },
    { code: '03', codeName: '반납' },
    { code: '04', codeName: '파손' },
    { code: '05', codeName: '폐기' },
  ],
  usageDivision: [
    { code: '01', codeName: '업무용' },
    { code: '02', codeName: '개발용' },
    { code: '03', codeName: '실증용' },
  ],
};

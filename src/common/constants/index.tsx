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

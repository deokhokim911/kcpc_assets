export interface AuthConfig {
  username: string;
  password: string;
}

// 환경 변수에서 인증 정보를 가져오거나 기본값 사용
const getAuthConfig = (): AuthConfig => {
  // 환경 변수가 설정되어 있으면 사용, 없으면 기본값 사용
  const username = process.env.NEXT_PUBLIC_AUTH_USERNAME || 'admin';
  const password = process.env.NEXT_PUBLIC_AUTH_PASSWORD || 'kcpc2025';
  
  return { username, password };
};

export const authConfig: AuthConfig = getAuthConfig();

export const validateCredentials = (username: string, password: string): boolean => {
  return username === authConfig.username && password === authConfig.password;
};

// 보안 강화를 위한 추가 함수들
export const getSessionTimeout = (): number => {
  return parseInt(process.env.NEXT_PUBLIC_SESSION_TIMEOUT || '3600000'); // 기본 1시간
};

export const getMaxLoginAttempts = (): number => {
  return parseInt(process.env.NEXT_PUBLIC_MAX_LOGIN_ATTEMPTS || '5');
}; 
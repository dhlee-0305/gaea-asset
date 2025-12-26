import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useAuth } from '@/common/utils/useAuth';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return null; // 또는 로딩 스피너
  }

  if (!isAuthenticated) {
    if (location.pathname === '/login') {
      // 로그인 페이지라면 from 없이 그냥 로그인 페이지로 이동
      return <Navigate to='/login' replace />;
    }

    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

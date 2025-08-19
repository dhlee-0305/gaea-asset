import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

import { getUserInfo } from '@/common/utils/auth';

interface RequireRolesProps {
  allowedRoles: string[];
  children: ReactNode;
}

export default function RequireRoles({ allowedRoles, children }: RequireRolesProps) {
  const roleCode = getUserInfo()?.roleCode;

  if (!roleCode) {
    return <Navigate to='/' replace />;
  }

  const isAllowed = allowedRoles.includes(roleCode);

  if (!isAllowed) {
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
}



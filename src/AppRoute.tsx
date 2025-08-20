import { Route, Routes } from 'react-router-dom';

import NoticeForm from './pages/notice/NoticeForm';
import DeviceDetail from './pages/device/DeviceDetail';
import DeviceForm from './pages/device/DeviceForm';
import DeviceHistoryList from './pages/device/DeviceHistoryList';
import UserList from './pages/user/UserList';
import UserDetail from './pages/user/UserDetail';
import UserForm from './pages/user/UserForm';

import LayoutBo from '@/layout/Layout';
import RequireRoles from '@/components/common/RequireRoles';
import NoticeDetail from '@/pages/notice/NoticeDetail';
import Home from '@/pages/Home';
import DeviceList from '@/pages/device/DeviceList';
import NoticeList from '@/pages/notice/NoticeList';
import LoginPage from '@/pages/login/LoginPage';
import ChangePasswordPage from '@/pages/login/ChangePasswordPage';
import DepartmentManagement from '@/pages/department/DepartmentManagement';
import CodeManager from '@/pages/code/CodeManager';

export default function AppRoute() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/change-password' element={<ChangePasswordPage />} />
        <Route path='/' element={<LayoutBo />}>
          <Route index element={<Home />} />
          <Route
            path='/user-management/users'
            element={
              <RequireRoles allowedRoles={['01','02','03']}>
                <UserList />
              </RequireRoles>
            }
          />
          <Route
            path='/user-management/users/:userNo'
            element={
              <RequireRoles allowedRoles={['01','02','03']}>
                <UserDetail />
              </RequireRoles>
            }
          />
          <Route
            path='/user-management/users/create'
            element={
              <RequireRoles allowedRoles={['01','02','03']}>
                <UserForm />
              </RequireRoles>
            }
          />
          <Route
            path='/user-management/users/:userNo/update'
            element={
              <RequireRoles allowedRoles={['01','02','03']}>
                <UserForm />
              </RequireRoles>
            }
          />
          <Route
            path='/user-management/departments'
            element={
              <RequireRoles allowedRoles={['01','02','03']}>
                <DepartmentManagement />
              </RequireRoles>
            }
          />
          <Route path='/device-management/devices' element={<DeviceList />} />
          <Route
            path='/device-management/devices/:deviceNum'
            element={<DeviceDetail />}
          />
          <Route
            path='/device-management/devices/create'
            element={<DeviceForm />}
          />
          <Route
            path='/device-management/devices/:deviceNum/update'
            element={<DeviceForm />}
          />
          <Route
            path='/device-management/device-history'
            element={<DeviceHistoryList />}
          />
          <Route path='/notice/notices' element={<NoticeList />} />
          <Route path='/notice/notices/:noticeNum' element={<NoticeDetail />} />
          <Route path='/notice/notices/create' element={<NoticeForm />} />
          <Route
            path='/notice/notices/update/:noticeNum'
            element={<NoticeForm />}
          />
          <Route
            path='/notice/notices/delete:noticeNum'
            element={<NoticeDetail />}
          />
          <Route
            path='/code-management/codes'
            element={
              <RequireRoles allowedRoles={['03']}>
                <CodeManager />
              </RequireRoles>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}

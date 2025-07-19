import { Route, Routes } from 'react-router-dom';

import NoticeForm from './pages/notice/NoticeForm';
import DeviceDetail from './pages/device/DeviceDetail';
import DeviceForm from './pages/device/DeviceForm';
import UserList from './pages/user/UserList';
import UserDetail from './pages/user/UserDetail';
import UserForm from './pages/user/UserForm';

import LayoutBo from '@/layout/Layout';
import NoticeDetail from '@/pages/notice/NoticeDetail';
import Home from '@/pages/Home';
import DeviceList from '@/pages/device/DeviceList';
import NoticeList from '@/pages/notice/NoticeList';
import LoginPage from '@/pages/login/LoginPage';

export default function AppRoute() {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<LayoutBo />}>
          <Route index element={<Home />} />
          <Route path='/user-management/users' element={<UserList />} />
          <Route
            path='/user-management/users/:userNo'
            element={<UserDetail />}
          />
          <Route path='/user-management/users/create' element={<UserForm />} />
          <Route
            path='/user-management/users/:userNo/update'
            element={<UserForm />}
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
        </Route>
      </Routes>
    </div>
  );
}

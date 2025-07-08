import { Route, Routes } from 'react-router-dom';

import LayoutBo from '@/layout/Layout';
import SampleDetail from '@/pages/user/SampleDetail';
import SampleForm from '@/pages/user/SampleForm';
import Home from '@/pages/Home';
import SampleList from '@/pages/user/SampleList';
import DeviceList from '@/pages/device/DeviceList';

export default function AppRoute() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<LayoutBo />}>
          <Route index element={<Home />} />
          <Route path='/user-management/users' element={<SampleList />} />
          <Route
            path='/user-management/users/:userNo'
            element={<SampleDetail />}
          />
          <Route
            path='/user-management/users/create'
            element={<SampleForm />}
          />
          <Route
            path='/user-management/users/:userNo/update'
            element={<SampleForm />}
          />
          <Route path='/device-management/devices' element={<DeviceList />} />
        </Route>
      </Routes>
    </div>
  );
}

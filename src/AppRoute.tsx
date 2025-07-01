import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import LayoutBo from '@/layout/LayoutBo';
import LayoutFo from '@/layout/LayoutFo';
import SampleDetail from '@/pages/bo/user-management/SampleDetail';
import SampleForm from '@/pages/bo/user-management/SampleForm';
import Home from '@/pages/Home';
import SampleList from '@/pages/bo/user-management/SampleList';
import DeviceList from '@/pages/bo/device-management/DeviceList';

export default function AppRoute() {
  const [userType] = useState('BO');
  return (
    <div>
      <Routes>
        {userType === 'BO' ? (
          <Route path='/' element={<LayoutBo />}>
            <Route index element={<Home />} />
            <Route path='/bo/user-management/users' element={<SampleList />} />
            <Route
              path='/bo/user-management/users/:userNo'
              element={<SampleDetail />}
            />
            <Route
              path='/bo/user-management/users/create'
              element={<SampleForm />}
            />
            <Route
              path='/bo/user-management/users/:userNo/update'
              element={<SampleForm />}
            />
            <Route
              path='/bo/device-management/devices'
              element={<DeviceList />}
            />
          </Route>
        ) : (
          <Route path='/' element={<LayoutFo />}>
            <Route index element={<Home />} />
            <Route path='/fo/user-management/users' element={<SampleList />} />
            <Route
              path='/fo/user-management/users/:userNo'
              element={<SampleDetail />}
            />
            <Route
              path='/fo/user-management/users/create'
              element={<SampleForm />}
            />
            <Route
              path='/fo/user-management/users/:userNo/update'
              element={<SampleForm />}
            />
          </Route>
        )}
      </Routes>
    </div>
  );
}

import { Route, Routes } from 'react-router-dom';

import SampleDetail from '@/pages/user-management/SampleDetail';
import SampleForm from '@/pages/user-management/SampleForm';
import Layout from '@/layout/Layout';
import Home from '@/pages/Home';
import SampleList from '@/pages/user-management/SampleList';

export default function AppRoute() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Layout />}>
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
        </Route>
      </Routes>
    </div>
  );
}

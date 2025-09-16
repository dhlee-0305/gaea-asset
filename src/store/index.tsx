import { configureStore } from '@reduxjs/toolkit';

import dialogReducer from './dialogSlice';
import commonCodeReducer from './commonCodeSlice';

const store = configureStore({
  reducer: {
    dialog: dialogReducer,
    commonCode: commonCodeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

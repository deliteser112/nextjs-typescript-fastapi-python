// store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import incidentReducer from './incidentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    incident: incidentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import analyzeReducer from './analyzeSlice'
import historyReducer from './historySlice'
export const store = configureStore({
  reducer:{
    auth: authReducer,
    analyze: analyzeReducer,
    history: historyReducer, // ✅ 注册 historySlice
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

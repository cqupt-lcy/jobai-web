// src/store/historySlice.ts
import { createSlice } from '@reduxjs/toolkit'

interface HistoryState {
  refreshCount: number
}

const initialState: HistoryState = {
  refreshCount: 0,
}

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    refreshHistory(state) {
      state.refreshCount += 1 // 每次调用刷新次数+1
    },
  },
})

export const { refreshHistory } = historySlice.actions

export default historySlice.reducer

import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface AnalyzeState{
   analyzing: boolean
   latestResultId : string | null
   latestResultOwner:string | null
   error :string |null
}

interface LatestResultMessage {
  latestResultId: string
  latestResultOwner: string
}

// 初始状态
const initialState: AnalyzeState = {
  analyzing: false,
  latestResultId: null,
  latestResultOwner: null,
  error: null,
}
const analyzeSlice = createSlice({
  name: 'analyze',
  initialState,
  reducers: {
    startAnalyze(state) {
      state.analyzing = true
      state.error = null
    },
    analyzeSuccess(state, action: PayloadAction<LatestResultMessage>) {
      state.analyzing = false
      state.latestResultId = action.payload.latestResultId
      state.latestResultOwner = action.payload.latestResultOwner
      state.error = null

      // 保存到 localStorage
      const message = JSON.stringify({
        latestResultId: action.payload.latestResultId,
        latestResultOwner: action.payload.latestResultOwner,
      })
      localStorage.setItem('latestResultMessage', message)
    },
    analyzeFailed(state, action: PayloadAction<string>) {
      state.analyzing = false
      state.error = action.payload
    },
    clearAnalyzeState(state) {
      state.analyzing = false
      state.latestResultId = null
      state.latestResultOwner = null
      state.error = null
      localStorage.removeItem('latestResultMessage')
    },
    // 登录后尝试恢复本地保存的 latestResultMessage
    restoreAnalyzeState(state, action: PayloadAction<{ username: string }>) {
      const message = localStorage.getItem('latestResultMessage')
      if (message) {
        try {
          const parsed: LatestResultMessage = JSON.parse(message)
          if (parsed.latestResultOwner === action.payload.username) {
            state.latestResultId = parsed.latestResultId
            state.latestResultOwner = parsed.latestResultOwner
          } else {
            // 用户不匹配，清空
            state.latestResultId = null
            state.latestResultOwner = null
          }
        } catch (err) {
          console.error('解析latestResultMessage失败', err)
        }
      }
    },
  },
})

export const { startAnalyze, analyzeSuccess, analyzeFailed, clearAnalyzeState, restoreAnalyzeState } = analyzeSlice.actions

export default analyzeSlice.reducer
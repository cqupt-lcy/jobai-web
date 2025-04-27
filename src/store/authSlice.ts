import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  isLoggedIn: boolean
  token: string | null
  username: string | null
}
const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  username: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ token: string; username: string }>) {
      state.isLoggedIn = true
      state.token = action.payload.token
      state.username = action.payload.username
    },
    logout(state) {
      state.isLoggedIn = false
      state.token = null
      state.username = null
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    },
    restoreAuth(state){
      const token = localStorage.getItem('token')
      const username = localStorage.getItem('username')
      if (token && username) {
        state.isLoggedIn = true
        state.username = username
        state.token = token
      }
    }
  }
})

export const { login, logout,restoreAuth  } = authSlice.actions
export default authSlice.reducer
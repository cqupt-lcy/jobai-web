'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { logout } from '@/store/authSlice' // 需要在authSlice里有logout动作

export default function UserInfoHeader() {
  const router = useRouter()
  const dispatch = useDispatch()

  const { isLoggedIn, username } = useSelector((state: RootState) => state.auth)

  const handleLogin = () => {
    router.push('/login')
  }

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login') // 退出后跳转到登录页
  }

  const handleUserCenter = () => {
    router.push('/user') // 假设以后有 /user 页面
  }

  return (
    <header className="bg-white shadow flex justify-between items-center px-6 py-4">
      <div className="text-2xl font-bold text-blue-600">
        🧠 智能简历分析系统
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <span className="text-gray-700">👋 欢迎，{username}</span>
            <button
              onClick={handleUserCenter}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              用户中心
            </button>
            <button
              onClick={handleLogout}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              退出登录
            </button>
          </>
        ) : (
          <>
            <span className="text-gray-500">未登录</span>
            <button
              onClick={handleLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              登录
            </button>
          </>
        )}
      </div>
    </header>
  )
}

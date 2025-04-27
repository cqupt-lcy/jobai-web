'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { login } from '@/store/authSlice'

export default function LoginForm() {
  const router = useRouter()
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [globalError, setGlobalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)  // 🔵 新增：成功提示
  const [loading, setLoading] = useState(false)

  // 防抖验证用户名
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!username) {
        setUsernameError('用户名不能为空')
      } else {
        setUsernameError('')
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [username])

  // 防抖验证密码
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!password) {
        setPasswordError('密码不能为空')
      } else {
        setPasswordError('')
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [password])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError(null)

    if (!username || !password) {
      setGlobalError('请填写用户名和密码')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '登录失败')
      }

      // 保存到 Redux
      dispatch(login({ token: data.token, username }))
      // 保存到 localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', username)

      // 登录成功 ✅
      setSuccessMessage('🎉 登录成功！正在跳转...')
      setTimeout(() => {
        router.push('/home')
      }, 2000) // 2秒后跳转
    } catch (err: any) {
      setGlobalError(err.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat z-0" />
      
      <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl z-10">
        <h2 className="text-2xl font-bold text-center mb-6">🔐 用户登录</h2>

        {/* 全局错误 */}
        {globalError && (
          <div className="mb-4 text-red-500 text-sm text-center">{globalError}</div>
        )}

        {/* 成功提示 ✅ */}
        {successMessage && (
          <div className="mb-4 text-green-600 bg-green-50 border border-green-200 p-3 rounded text-center animate-fade-in">
            {successMessage}
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${
                usernameError ? 'border-red-500 ring-red-200' : 'focus:ring-blue-500'
              }`}
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && (
              <p className="text-sm text-red-500 mt-1">{usernameError}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${
                passwordError ? 'border-red-500 ring-red-200' : 'focus:ring-blue-500'
              }`}
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-sm text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? '登录中...' : '立即登录'}
          </button>
        </form>

        {/* 去注册 */}
        <p className="text-sm text-center text-gray-600 mt-6">
          还没有账号？
          <a
            href="/register"
            className="text-blue-600 hover:underline font-medium ml-1"
          >
            去注册
          </a>
        </p>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function RegisterForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!username) {
        setUsernameError('用户名不能为空')
      } else if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(username)) {
        setUsernameError('用户名必须是英文和数字且不能以数字开头')
      } else {
        setUsernameError('')
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [username])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!password) {
        setPasswordError('密码不能为空')
      } else if (password.length < 6) {
        setPasswordError('密码长度必须大于6位')
      } else {
        setPasswordError('')
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [password])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (confirmPassword && confirmPassword !== password) {
        setConfirmPasswordError('两次密码不一致')
      } else {
        setConfirmPasswordError('')
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [confirmPassword, password])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username || !password || !confirmPassword) {
      setError('用户名和密码不能为空')
      return
    }
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }
    if(usernameError || passwordError || confirmPasswordError){
      setError('请检查输入格式!')
      return
    }
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '注册失败')
      }

      alert('注册成功，请前往登录')
      router.push('/login')
    } catch (err: any) {
      setError(err.message || '网络错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-blue-200 px-6 relative overflow-hidden">
      <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl z-10">
        <h2 className="text-2xl font-bold text-center mb-6">🎉 用户注册</h2>

        {error && <div className="mb-4 text-red-500 text-sm text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${usernameError ? 'border-red-500 ring-red-200' : 'focus:ring-blue-500'
              }`}
            placeholder="用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && (
            <p className="text-sm text-red-500 ">{usernameError}</p>
          )}

          <input
            type="password"
            className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${passwordError ? 'border-red-500 ring-red-200' : 'focus:ring-blue-500'
              }`}
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <p className="text-sm text-red-500 mt-1">{passwordError}</p>
          )}

          <input
            type="password"
            className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${confirmPasswordError ? 'border-red-500 ring-red-200' : 'focus:ring-blue-500'
            }`}
            placeholder="重复密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPasswordError && (
            <p className="text-sm text-red-500 mt-1">{confirmPasswordError}</p>
          )}


          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? '注册中...' : '立即注册'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          已有账号？
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium ml-1"
          >
            立即登录
          </a>
        </p>
      </div>
    </div>
  )
}

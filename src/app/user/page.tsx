'use client'

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store'
import { useRouter } from 'next/navigation'
import { logout } from '@/store/authSlice'

interface UserInfo {
  id: string
  username: string
  createdAt: string
}

export default function UserCenterPage() {
  const { token } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const dispatch = useDispatch()

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const res = await fetch('/api/me', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('登录已失效，请重新登录')
        }

        const data = await res.json()
        setUserInfo(data)
      } catch (err: any) {
        console.error(err)
        setError(err.message || '请求失败')
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [token, router])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={handleLogout} className="bg-blue-600 text-white px-4 py-2 rounded">
          返回登录
        </button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-xl">
        {/* 顶部标题 */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-blue-600">🧑 用户中心</h1>
          <button
            onClick={() => router.push('/home')}
            className="text-blue-500 hover:underline text-sm"
          >
            ← 返回首页
          </button>
        </div>

        {/* 基本信息卡片 */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">基本信息</h2>
          <div className="bg-gray-100 p-6 rounded-lg space-y-2">
            <p><strong>用户名：</strong> {userInfo?.username}</p>
            <p><strong>用户ID：</strong> {userInfo?.id}</p>
          </div>
        </section>

        {/* 其它模块（修改密码、历史记录、使用统计、退出按钮） */}
        {/* ... 这里可以继续保持不变，后续逐步对接 ... */}
      </div>
    </main>
  )
}

'use client'

import ResumeUpload from '@/components/ResumeUpload'
import UserInfoHeader from '@/components/UserInfoHeader'
import SidebarHistoryList from '@/components/SidebarHistoryList'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { restoreAuth } from '@/store/authSlice'
import { useRouter } from 'next/navigation'
import { logout } from '@/store/authSlice'
export default function HomePage() {
  const dispatch = useDispatch()
  const router = useRouter()
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        // 没token，不需要校验
        return
      }

      try {
        const res = await fetch('/api/check-token', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('token无效')
        }

        // 校验成功，恢复 Redux 登录状态
        const data = await res.json()
        dispatch(restoreAuth())

      } catch (err) {
        console.error('token校验失败', err)
        dispatch(logout())
        router.push('/login')
      }
    }

    checkLoginStatus()
  }, [dispatch, router])


  useEffect(() => {
    dispatch(restoreAuth())
  }, [dispatch])
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 顶部用户信息栏 */}
      <UserInfoHeader />

      {/* 主体内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧：历史记录列表 */}
        <aside className="w-64 bg-white shadow-md p-4 hidden md:block overflow-y-auto">
          <SidebarHistoryList />
        </aside>

        {/* 主内容区：简历上传 */}
        <main className="flex-1 p-6 overflow-y-auto">
          <ResumeUpload />
        </main>
      </div>
    </div>
  )
}

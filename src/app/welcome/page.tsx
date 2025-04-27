'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

export default function WelcomePage() {
  const router = useRouter()
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

  const handleClick = () => {
    const token = localStorage.getItem('token')
    if (isLoggedIn || token) {
      router.push('/') // 登录则进入主页
    } else {
      router.push('/login') // 未登录跳转登录页
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden">
      {/* 背景动画图案（可替换成更酷的动效） */}
      <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl top-[-100px] left-[-100px] animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-white/10 rounded-full blur-2xl bottom-[-80px] right-[-80px] animate-ping" />

      <h1 className="text-5xl font-extrabold z-10 drop-shadow-xl">
        ✨ 欢迎来到智能简历分析系统
      </h1>
      <p className="text-lg mt-6 text-white/90 z-10 drop-shadow">
        使用 AI 技术为你的简历打分、优化、提升通过率
      </p>

      <button
        onClick={handleClick}
        className="mt-10 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition z-10"
      >
        🚀 开始使用
      </button>
    </div>
  )
}

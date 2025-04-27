'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ResultShow from '@/components/ResultShow'

export default function ResultDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const router = useRouter()

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/get-result?id=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || '加载失败')
        }

        setResult(data.result)
      } catch (err: any) {
        setError(err.message || '请求失败')
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>加载中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.back()} className="bg-blue-600 text-white px-4 py-2 rounded">
          返回上一页
        </button>
      </div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-xl">
        {/* 顶部操作区 */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-2xl font-bold">🎯 分析报告详情</h1>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/home')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              返回首页
            </button>

            <button
              onClick={() => alert('功能开发中...')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              保存为 PDF
            </button>
          </div>
        </div>

        {/* 分析报告展示区 */}
        <ResultShow result={result} />
      </div>
    </main>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
interface HistoryItem {
  id: string
  created_at: string
  resume_text: string
}

export default function SidebarHistoryList() {
  const router = useRouter()

  const [historyList, setHistoryList] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const refreshCount = useSelector((state: RootState) => state.history.refreshCount)
  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      setError(null)

      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/list-results', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || '加载失败')
        }

        setHistoryList(data.results || [])
      } catch (err: any) {
        console.error(err)
        setError(err.message || '请求失败')
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  // useEffect里加 refreshCount 作为依赖
  useEffect(() => {
    const fetchHistory = async () => {
      // 之前的请求逻辑
    }

    fetchHistory()
  }, [refreshCount])

  const handleClickItem = (id: string) => {
    router.push(`/result/${id}`)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">📚 历史记录</h2>

      {loading && <p className="text-gray-500">加载中...</p>}

      {error && (
        <div className="text-red-500 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && historyList.length === 0 && (
        <p className="text-gray-400 text-sm">暂无历史记录</p>
      )}

      <ul className="space-y-2">
        {historyList.map(item => (
          <li
            key={item.id}
            onClick={() => handleClickItem(item.id)}
            className="p-3 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer transition"
          >
            <p className="text-sm font-medium truncate">
              {item.resume_text.slice(0, 20)}...
            </p>
            <p className="text-xs text-gray-500">
              {new Date(item.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

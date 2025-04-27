'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { refreshHistory } from '@/store/historySlice'

export default function ResumeUpload() {
  const [resume, setResume] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultId, setResultId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false) // 👈 新增：控制弹窗显示

  const router = useRouter()
  const dispatch = useDispatch()

  const handleAnalyze = async () => {
    if (!agreePrivacy) {
      alert('请先同意隐私协议')
      return
    }

    setLoading(true)
    setError(null)

    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resume }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '请求失败')
      }

      if (data.result_id) {
        setResultId(data.result_id)
        dispatch(refreshHistory())
      } else {
        throw new Error('未获取到分析ID')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || '请求失败')
    } finally {
      setLoading(false)
    }
  }

  const handleViewResult = () => {
    if (resultId) {
      router.push(`/result/${resultId}`)
    }
  }

  return (
    <main className="flex justify-center">
      <div className="w-full max-w-4xl bg-white p-10 rounded-xl shadow-xl relative">
        <h1 className="text-2xl font-bold mb-6 text-center">🧠 智能简历评估</h1>

        {!resultId && (
          <>
            <textarea
              className="w-full h-60 border border-gray-300 rounded p-4 mb-4 resize-none"
              placeholder="请粘贴你的简历内容..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              disabled={loading}
            />

            {/* 隐私协议勾选框 */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                disabled={loading}
                className="mr-2"
              />
              <label className="text-sm text-gray-600">
                我已阅读并同意
                <span
                  className="text-blue-600 underline cursor-pointer ml-1"
                  onClick={() => setShowPrivacyModal(true)}
                >
                  使用须知
                </span>
              </label>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error}
              </div>
            )}

            {/* 开始分析按钮 */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !resume.trim() || !agreePrivacy}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? '分析中...' : '开始分析'}
            </button>
          </>
        )}

        {/* 分析完成界面 */}
        {resultId && (
          <div className="text-center space-y-6">
            <p className="text-green-600 text-lg font-semibold mt-8">🎉 分析完成！</p>
            <button
              onClick={handleViewResult}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-semibold transition"
            >
              查看分析结果
            </button>
          </div>
        )}

        {/* 隐私政策模态框 */}
        {showPrivacyModal && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg relative">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              <h2 className="text-xl font-bold mb-4">使用须知</h2>
              <p className="text-sm text-gray-600 mb-6">
                我们非常重视您的隐私。您的输入内容仅用于调用AI接口进行分析，不会被保存或者转发。
                本系统不会记录您的个人敏感信息，分析结果由AI生成，仅供个人参考。
              </p>
              <div className="text-center">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  我已阅读
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

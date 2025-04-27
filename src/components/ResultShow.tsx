'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// 动态引入雷达图，禁用 SSR（因为很多 chart 库依赖浏览器环境）
const ScoreRadarChart = dynamic(() => import('@/components/ScoreRadarChart'), { ssr: false })

interface ResultShowProps {
  result: any
}

export default function ResultShow({ result }: ResultShowProps) {
  if (!result) {
    return <div className="text-center text-gray-500">暂无分析结果</div>
  }

  return (
    <div className="space-y-8">
      {result.summary && (
        <div className="bg-green-50 p-4 rounded">
          <h2 className="font-bold mb-2">🧠 AI 总结：</h2>
          <p>{result.summary}</p>
        </div>
      )}

      {Array.isArray(result.pros) && result.pros.length > 0 && (
        <div>
          <h3 className="font-semibold text-green-700 mb-2">✅ 优点：</h3>
          <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
            {result.pros.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(result.cons) && result.cons.length > 0 && (
        <div>
          <h3 className="font-semibold text-yellow-700 mb-2">⚠️ 不足：</h3>
          <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
            {result.cons.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {Array.isArray(result.advice) && result.advice.length > 0 && (
        <div>
          <h3 className="font-semibold text-blue-700 mb-2">🛠️ 改进建议：</h3>
          <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700">
            {result.advice.map((item: string, idx: number) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {result.scores && (
        <div>
          <h3 className="font-semibold text-purple-700 mb-2">📊 综合评分：</h3>
          <ScoreRadarChart scores={result.scores} />
        </div>
      )}
    </div>
  )
}

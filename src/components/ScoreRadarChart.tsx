'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// 正确导入，兼容 Next.js App Router & dynamic
const ReactECharts = dynamic(() => import('echarts-for-react').then((mod) => mod.default as unknown as React.FC<any>), { ssr: false })

type ScoreData = {
  [key: string]: number
}

export default function ScoreRadarChart({ scores }: { scores: ScoreData }) {
  const indicators = Object.keys(scores).map((key) => ({
    name: key,
    max: 10,
  }))

  const values = Object.values(scores)

  const option = {
    tooltip: {},
    radar: {
      indicator: indicators,
      shape: 'circle',
      radius: 80,
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: values,
            name: '评分',
            areaStyle: { opacity: 0.3 },
          },
        ],
      },
    ],
  }

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <h3 className="font-semibold text-lg mb-4">📊 简历维度评分</h3>
      <ReactECharts option={option} style={{ height: 300 }} />
    </div>
  )
}

// src/pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_KEY!
const JWT_SECRET = process.env.JWT_SECRET! // 你的JWT签发密钥
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '仅支持 GET 请求' })
  }

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供有效的 token' })
  }

  const token = authHeader.split(' ')[1]

  let userId: string

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    userId = decoded.id
  } catch (err) {
    return res.status(401).json({ error: 'token无效或已过期' })
  }

  // 查询数据库，获取用户信息
  const { data, error } = await supabase
    .from('UserSys') // ⚡ 这里是你的用户表，注意表名
    .select('id, username')
    .eq('id', userId)
    .single()

  if (error || !data) {
    console.error('查询用户信息失败', error)
    return res.status(500).json({ error: '获取用户信息失败' })
  }

  return res.status(200).json({
    id: data.id,
    username: data.username,
    
  })
}

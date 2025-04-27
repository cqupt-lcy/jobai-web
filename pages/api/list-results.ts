import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_KEY!
const JWT_SECRET = process.env.JWT_SECRET!
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '仅支持 GET 请求' })
  }

  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供有效的身份令牌' })
  }

  const token = authHeader.split(' ')[1]
  let userId: string

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    userId = decoded.id
  } catch (err) {
    return res.status(401).json({ error: '身份验证失败' })
  }

  const { data, error } = await supabase
    .from('results')
    .select('id, created_at, resume_text')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase查询失败', error)
    return res.status(500).json({ error: '查询失败' })
  }

  return res.status(200).json({ results: data })
}

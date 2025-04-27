import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET! 

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '仅支持 GET 请求' })
  }

  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供有效的 token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string, username: string }
    // ✅ 校验通过
    return res.status(200).json({ success: true, user: decoded })
  } catch (err) {
    // ❌ Token无效/过期
    return res.status(401).json({ error: 'token无效或已过期' })
  }
}

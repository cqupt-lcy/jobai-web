// src/pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

const JWT_SECRET = process.env.JWT_SECRET!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' })
  }

  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ error: '用户名或密码不能为空' })
  }

  // 查找用户
  const { data: users, error: findError } = await supabase
    .from('UserSys')
    .select('*')
    .eq('username', username)

  const user = users?.[0]

  if (!user) {
    console.log(findError);
    
    return res.status(401).json({ error: '用户不存在' })
  }

  // 验证密码
  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    return res.status(401).json({ error: '密码错误' })
  }

  // 生成 JWT
  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: '7d' } // 有效期 7 天
  )

  return res.status(200).json({ token, message: '登录成功' })
}

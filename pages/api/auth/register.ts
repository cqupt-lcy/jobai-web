// src/pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' })
  }

  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: '用户名或密码不能为空' })
  }

  // 检查是否已注册
  const { data: existingUsers, error: findError } = await supabase
    .from('UserSys')
    .select('*')
    .eq('username', username)

  if (existingUsers && existingUsers.length > 0) {
    return res.status(409).json({ error: '该用户名已注册' })
  }

  // 加密密码
  const passwordHash = await bcrypt.hash(password, 10)

  // 插入用户数据
  const { error: insertError } = await supabase.from('UserSys').insert([
    { username, password: passwordHash },
  ]).select()

  if (insertError) {
    return res.status(500).json({ error: '注册失败，请稍后重试' ,mes:insertError })
  }

  return res.status(200).json({ message: '注册成功' })
}

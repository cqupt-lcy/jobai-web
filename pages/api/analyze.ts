// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
const DASHSCOPE_API_KEY = process.env.DASHSCOPE_API_KEY!
const SUPABASE_URL = process.env.SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_KEY!
const JWT_SECRET = process.env.JWT_SECRET!
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization
  const { resume } = req.body
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持 POST 请求' })
  }
  // 解析用户身份（从 Authorization header 中取出 token）

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供有效的身份令牌' })
  }
  if (!resume || typeof resume !== 'string') {
    return res.status(400).json({ error: '请提供简历内容' })
  }
  const token = authHeader.split(' ')[1]
  let userId: string
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    userId = decoded.id
  } catch (err) {
    return res.status(401).json({ error: err })
  }

  try {
    const response = await fetch(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'qwen-plus',
          messages: [
            {
              role: 'system',
              content:
                `
                你是一位前端开发工程师招聘的面试官，请阅读以下简历内容，返回结构化分析结果，
                JSON 格式包括 summary, pros, cons, advice,scores 五个字段，其中scores字段要从"技术能力"、"项目经验"、"教育背景"、"简历完整度"、"软技能与潜力"、"差异化亮点"，这六个维度进行打分，每项得分在0~10之间。
                请你客观公正地给出建议和得分，如果简历内容中缺少内容无法进行分析，你也要遵循输出格式，可以给出提示信息，例如：用户信息不足，无法给出建议。
                总之，你的返回值必须只是JSON格式，不要出现任何其它内容，确保你给的结果能够被JSON.parse方法所解析。
                `

            },
            {
              role: 'user',
              content: resume,
            },
          ],
          temperature: 0.7,
        }),
      }
    )

    const myResult = await response.json()
    const text = myResult?.choices?.[0]?.message?.content || '无返回内容'

    //     const text =
    //       `{
    //   "summary": "该候选人具备扎实的前端开发技能，熟悉HTML、CSS和JavaScript等核心技术，并掌握现代前端框架React及后端NodeJS的基础应用。同时，对前端性能优化和网络安全有一定了解，且具备Android开发的基础知识。",
    //   "pros": [
    //     "掌握前端核心技能，包括HTML、CSS和JavaScript，理解语义化标签、盒模型、样式优先级等。",
    //     "熟悉React框架及其相关技术（如组件生命周期、Hooks、路由管理），表明在现代前端开发中有较强的实际操作能力。",
    //     "了解NodeJS并使用Express框架进行过个人项目开发，展示了全栈开发的潜力。",
    //     "熟悉常用的开发工具（如Axios、Redux、Antd、Tailwind、Webpack），表明具有良好的工程实践能力。",
    //     "对前端性能优化和网络安全有基础认识，说明关注用户体验和系统安全。"
    //   ],
    //   "cons": [
    //     "简历内容偏技术罗列，缺乏具体项目经验和成果的描述，无法全面评估实际开发能力。",
    //     "Android开发仅提到'了解'，但未说明具体掌握的技术或参与的项目，深度不足。",
    //     "没有提及版本控制工具（如Git）的使用经验，可能在协作开发方面存在短板。",
    //     "缺乏对测试工具或自动化测试流程的认识，这在现代软件开发中非常重要。"
    //   ],
    //   "advice": [
    //     "补充具体的项目经验，详细描述项目的背景、职责、技术栈以及取得的成果，以增强简历的说服力。",
    //     "如果Android开发是重要技能，请提供更详细的说明，例如使用的框架、开发工具或完成的应用功能。",
    //     "增加对版本控制工具（如Git）的使用经验，这是团队协作开发中的基本要求。",
    //     "学习并补充测试相关的技能，例如Jest、Enzyme或其他测试框架，以提升代码质量保障能力。",
    //     "考虑添加软技能部分，例如沟通能力、团队合作经验等，以展示综合职业素养。"
    //   ],
    //   "scores": {
    //     "技术能力": 8,
    //     "项目经验": 7,
    //     "教育背景": 9,
    //     "简历完整度": 6,
    //     "软技能与潜力": 6,
    //     "差异化亮点": 9
    //   }
    // }`

    // const parsed = JSON.parse(text)

    let parsed: Record<string, any> | null = null

    try {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        parsed = JSON.parse(match[0])
      } else {
        throw new Error('找不到有效的 JSON 块')
      }
    } catch (err) {
      console.error('[解析错误]', err)
      parsed = { summary: text } // fallback
    }

    // try {
    //   parsed = JSON.parse(text)
    // } catch (err) {
    //   console.log(err);
    //   parsed = { summary: text } // fallback 显示原始文本
    // }

    //将结果保存到 Supabase 的 results 表
    const { data, error } = await supabase
      .from('results')
      .insert([
        {
          user_id: userId,
          resume_text: resume,
          result_json: parsed,
        },
      ])
      .select('id') // ✅ 重点！要求返回新插入记录的 id
      .single()     // ✅ 保证只返回一条数据

    if (error || !data) {
      console.error('[Supabase Error]', error)
      return res.status(500).json({ error: '结果保存失败' })
    }

    res.status(200).json({ result: parsed, result_id: data.id })
  } catch (error: any) {
    console.error('[接口或数据库错误]', error)
    res.status(500).json({ error: 'AI 分析失败，请稍后重试' })
  }
}

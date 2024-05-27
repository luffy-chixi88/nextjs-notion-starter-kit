import { NextApiRequest, NextApiResponse } from 'next'

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

const fromArr = ['PassTo Pay官網', 'PassTo Credit官網', 'Multi Markets官網']

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    name: string
    email: string // 邮箱
    source: number // 来源
    phone?: string // 手机号码
  }
}

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    const email = req.body.email || ''
    if (!isValidEmail(email)) {
      throw new Error('email error')
    }
    const url = `https://api.notion.com/v1/pages`
    const data = {
      parent: { database_id: process.env.NOTION_DB_ID },
      properties: {
        email: { email: email },
        source: {
          select: {
            name: fromArr[req.body.source] || fromArr[0]
          }
        }
      }
    }
    if (req.body.phone) {
      // @ts-ignore
      data.properties.phone = {
        phone_number: req.body.phone
      }
    }
    if (req.body.name) {
      // @ts-ignore
      data.properties.name = {
        title: [
          {
            type: 'text',
            text: {
              content: req.body.name
            }
          }
        ]
      }
    }
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NOTION_SECRET}`,
        'Notion-Version': '2021-08-16'
      },
      body: JSON.stringify(data)
    })
    console.log('rr', result)
    if (result.status !== 200) {
      throw new Error('failure')
    }
    res.status(200).json({ success: true, msg: '' })
  } catch (err) {
    console.log('eee', err)
    res.status(200).json({ success: false })
  }
}

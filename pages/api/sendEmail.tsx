import { NextApiResponse } from 'next'

import dayjs from 'dayjs'

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

export default async function handler(req: Request, res: NextApiResponse) {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const email = req.body?.email || ''
    if (!isValidEmail(email)) {
      throw new Error('email error')
    }
    const url = `https://api.notion.com/v1/pages`
    const data = {
      parent: { database_id: process.env.NOTION_DB_ID },
      properties: {
        Email: { email: email },
        CreateTime: {
          // 2020-12-08T12:00:00Z dayjs().format('YYYY-MM-DDThh:mm:ss') + 'Z'
          date: { start: dayjs().format('YYYY-MM-DDThh:mm:ss') + 'Z' }
        }
      }
    }
    console.log('data', data, process.env.NOTION_SECRET)
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

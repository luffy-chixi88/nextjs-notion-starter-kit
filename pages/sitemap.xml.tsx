import type { GetServerSideProps } from 'next'

import { host } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import type { SiteMap } from '@/lib/types'

// 判断是否有中文字符
function isChinese(str) {
  return /[\u4E00-\u9FA5]+/g.test(str)
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()
    return {
      props: {}
    }
  }

  const siteMap = await getSiteMap()

  // cache for up to 8 hours
  res.setHeader('Cache-Control', 'public, max-age=28800, stale-while-revalidate=28800')
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap(siteMap))
  res.end()

  return {
    props: {}
  }
}

const createSitemap = (siteMap: SiteMap) => {
  const res = []
  // 過濾中文url
  Object.keys(siteMap.canonicalPageMap).forEach((canonicalPagePath) => {
    if (!isChinese(canonicalPagePath)) {
      res.push(
        `
          <url>
            <loc>${host}/${canonicalPagePath}</loc>
          </url>
       `.trim()
      )
    }
  })
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${host}</loc>
      </url>

      <url>
        <loc>${host}/</loc>
      </url>
      ${res.join('')}
    </urlset>
  `
}

export default () => null

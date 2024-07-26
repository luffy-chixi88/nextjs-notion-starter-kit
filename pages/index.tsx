import * as React from 'react'

import { NotionPage } from '@/components/NotionPage'
import { domain } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'

export const getStaticProps = async () => {
  try {
    const props = await resolveNotionPage(domain)

    return { props, revalidate: 10 }
  } catch (err) {
    console.error('page error', domain, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export default function NotionDomainPage(props) {
  // 监听首页banner 弹窗
  React.useEffect(() => {
    const showBannerDialog = () => {
      const dialog = document.querySelector('.pt-trialDialog') as HTMLElement
      dialog.style.display = 'block'
    }
    const hideBannerDialog = () => {
      const dialog = document.querySelector('.pt-trialDialog') as HTMLElement
      dialog.style.display = 'none'
    }
    const clickHandler = (e: MouseEvent) => {
      const closeBtn = document.querySelector('.pt-trialDialog .closeBtn') as HTMLElement
      const showBtn = document.querySelector(
        '.pt-bannerv2 .header .notion-link[href*="https://mch.ylbhd.com/login?type=demo"]'
      ) as HTMLElement
      const clickTarget = e.target as HTMLElement
      closeBtn.contains(clickTarget) && hideBannerDialog()
      if (showBtn.contains(clickTarget)) {
        e.preventDefault()
        showBannerDialog()
      }
    }
    document.body?.addEventListener('click', clickHandler)

    return () => {
      document.body?.removeEventListener('click', clickHandler)
    }
  }, [])
  return <NotionPage {...props} />
}

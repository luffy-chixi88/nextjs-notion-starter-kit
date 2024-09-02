// global styles shared across the entire site
import * as React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import Script from 'next/script'

import * as Fathom from 'fathom-client'
import { fathomConfig, fathomId, posthogConfig, posthogId } from '@/lib/config'
import { SnackbarUtilsConfig } from '@/lib/toast'
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
import { SnackbarProvider } from 'notistack'
import posthog from 'posthog-js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-tomorrow.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// 自定义主题样式
import 'styles/global.css'
import 'styles/notion.scss'
import 'styles/passto/index.scss'
// swiper 样式
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    function onRouteChangeComplete() {
      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  React.useEffect(() => {
    // 处理页脚邮件点击事件
    const clickHandler = (e: MouseEvent) => {
      const clickTarget = e.target as HTMLElement
      // console.log('clickTarget', clickTarget.tagName, clickTarget.getAttribute('alt'))
      if (
        clickTarget.tagName.toLowerCase() === 'img' &&
        clickTarget.getAttribute('alt')?.startsWith('mailto:')
      ) {
        window.location.href = clickTarget.getAttribute('alt')
        return
      }
    }

    document.body?.addEventListener('click', clickHandler)

    return () => {
      document.body?.removeEventListener('click', clickHandler)
    }
  }, [])

  return (
    <SnackbarProvider maxSnack={3}>
      <SnackbarUtilsConfig />
      <Script id='track-script'>{`
       ;(function (w, d, s, l, i) {
        w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NJGQN5D8')
      `}</Script>
      <Component {...pageProps} />
      <Script>
        {`
        if(document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded',opentoggles);
        } else {
          opentoggles();
        }
        function opentoggles() {
          var detailsElements = document.querySelector(".pt-faq .notion-toggle");
          detailsElements && detailsElements.setAttribute("open", true);
        }
        `}
      </Script>

      <Script>
        {`
          (function(h,o,t,j,a,r){ h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)}; h._hjSettings={hjid:5070229,hjsv:6}; a=o.getElementsByTagName('head')[0]; r=o.createElement('script');r.async=1; r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv; a.appendChild(r); })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </Script>
    </SnackbarProvider>
  )
}

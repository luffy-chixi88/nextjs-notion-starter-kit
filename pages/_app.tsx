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

  return (
    <SnackbarProvider maxSnack={3}>
      <SnackbarUtilsConfig />
      <Script id='track-script'>{`
       ;(function (w, d, s, l, i) {
        if (w.location.host.indexOf('passtopay.io') === -1) return
        var script = d.createElement(s)
        script.type = 'text/javascript'
        script.async = true
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + i
        var tmp = d.getElementsByTagName(s)[0]
        tmp.parentNode.insertBefore(script, tmp)
        w.dataLayer = w.dataLayer || []
        w.gtag = function () {
          w.dataLayer.push(arguments)
        }
        w.gtag('js', new Date())
        w.gtag('config', i)
      })(window, document, 'script', 'dataLayer', 'G-EVGK61NYDS')
      `}</Script>
      <Script
        async
        defer
        src='https://maxkb.zapto.org/api/application/embed?protocol=https&host=maxkb.zapto.org&token=18d20fd8c7303ca7'
      ></Script>
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
    </SnackbarProvider>
  )
}

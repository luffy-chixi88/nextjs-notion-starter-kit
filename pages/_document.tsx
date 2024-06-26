import * as React from 'react'
import Document, { Head, Html, Main, NextScript } from 'next/document'

import { IconContext } from '@react-icons/all-files'

export default class MyDocument extends Document {
  render() {
    const buildTime = process.env.NEXT_PUBLIC_buildTime
    return (
      <IconContext.Provider value={{ style: { verticalAlign: 'middle' } }}>
        <Html lang='zh-HK' data-buildtime={buildTime}>
          <Head>
            <link rel='shortcut icon' href='/favicon.ico' />
            <link rel='icon' type='image/png' sizes='32x32' href='favicon.png' />
            <link rel='manifest' href='/manifest.json' />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      </IconContext.Provider>
    )
  }
}

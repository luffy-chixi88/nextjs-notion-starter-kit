import React, { useState } from 'react'

import fetch from 'isomorphic-unfetch'
import { NotionRenderer, Text, useNotionContext } from 'react-notion-x'

export function PasstoReadme(props) {
  const { recordMap } = useNotionContext()
  const [html, setHtml] = useState('')
  React.useEffect(() => {
    searchNotionImpl().then((r) => {
      setHtml(r)
    })
  }, [])
  console.log('sss', props, recordMap)
  return <div dangerouslySetInnerHTML={{ __html: html }}></div>
}

async function searchNotionImpl(): Promise<any> {
  return fetch('/reference/whats-passto-pay', {
    method: 'GET'
  })
    .then((res) => {
      console.log('eee', res)
      if (res.ok) {
        return res.text()
      }
    })
    .catch((r) => console.log('accc', r))
}

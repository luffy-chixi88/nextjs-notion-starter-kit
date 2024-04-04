import React from 'react'

import cs from 'classnames'
import { NotionBlockRenderer, useNotionContext } from 'react-notion-x'

export default function VideoAutoPlay({ block, className, meta }) {
  const { recordMap } = useNotionContext()
  let url = ''
  block.content?.some((item) => {
    if (recordMap.signed_urls[item]) {
      url = recordMap.signed_urls[item]
      return true
    }
  })
  if (!url) return null
  return (
    <div className={cs('pt-video', className)}>
      <video autoPlay src={url} muted loop={meta.loop ?? true} />
    </div>
  )
}

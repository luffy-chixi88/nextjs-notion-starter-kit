import React, { useEffect, useMemo, useRef } from 'react'

import cs from 'classnames'
import { useNotionContext } from 'react-notion-x'

export default function VideoAutoPlay({ block, className, meta }) {
  const { recordMap } = useNotionContext()
  // 视频地址
  const URL = useMemo(() => {
    let url = ''
    block.content?.some((item) => {
      if (recordMap.signed_urls[item]) {
        url = recordMap.signed_urls[item]
        return true
      }
    })
    return url
  }, [block, recordMap])

  if (!URL) return null
  return (
    <div className={cs('pt-video', className)}>
      <video src={URL} playsInline controls preload='metadata' {...meta} />
    </div>
  )
}

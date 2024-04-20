import React, { useEffect, useMemo, useRef } from 'react'

import cs from 'classnames'
import { useNotionContext } from 'react-notion-x'

export default function VideoAutoPlay({ block, className, meta }) {
  const { recordMap } = useNotionContext()
  const videoRef = useRef(null)
  // 滚动自动播放
  useEffect(() => {
    if (meta.scrollAutoPlay === '1') {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current.play()
          } else {
            videoRef.current.pause()
          }
        })
      })
      observer.observe(videoRef.current)
      return () => observer?.disconnect()
    }
  }, [meta])

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
      <video
        ref={videoRef}
        autoPlay={meta.autoPlay === '0' ? false : true}
        src={URL}
        loop={meta.loop === '0' ? false : true}
        muted={meta.muted === '0' ? false : true}
        // eslint-disable-next-line react/no-unknown-property
        webkit-playsinline={true}
        // eslint-disable-next-line react/no-unknown-property
        x5-playsinline
        playsInline
      />
    </div>
  )
}

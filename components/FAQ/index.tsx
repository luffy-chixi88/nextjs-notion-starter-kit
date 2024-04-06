import React, { useEffect, useRef } from 'react'

export default function FAQ(props) {
  const { className, children } = props
  const faqRef = useRef(null)

  useEffect(() => {
    // 第一個自動展開
    const detailsElements = faqRef.current?.querySelector('.notion-toggle')
    detailsElements && detailsElements.setAttribute('open', true)
  }, [faqRef])

  return (
    <div className={className} ref={faqRef}>
      {children}
    </div>
  )
}

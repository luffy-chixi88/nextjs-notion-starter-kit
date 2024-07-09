import { useEffect, useRef } from 'react'

import clsx from 'clsx'
import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  themeCSS: `
    svg {
      max-width: 100% !important;
    }
    .actor {
      font-size: 14px !important;
      fill: #fff !important;
      stroke: var(--bd-solid);
    }
    line{
      stroke-dasharray: 6 6;
      stroke: var(--bd-solid);
      stroke-opacity: 0.5;
    }
    .messageText{
      font-size: 14px !important;
    }
    .messageLine0{
      stroke: var(--primary);
    }
    #arrowhead path{
      fill: var(--primary);
    }
  `
})

export default function Mermain({ chart, className = '' }) {
  const mermaidRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chart) {
      mermaidRef.current?.removeAttribute('data-processed')
      mermaid.init(undefined, mermaidRef.current)
    }
  }, [chart])
  return (
    <div ref={mermaidRef} className={clsx('flex justify-center', className)}>
      {chart}
    </div>
  )
}

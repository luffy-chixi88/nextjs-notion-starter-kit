import { useEffect, useRef } from 'react'

import mermaid from 'mermaid'

mermaid.initialize({
  startOnLoad: true,
  theme: 'default'
})

export default function Mermain({ id, chart }) {
  const mermaidRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    mermaidRef.current?.removeAttribute('data-processed')
    mermaid.init(undefined, mermaidRef.current)
  }, [chart])
  return <div ref={mermaidRef}>{chart}</div>
}

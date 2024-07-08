import React, { useEffect, useMemo, useRef, useState } from 'react'

import Mermain from '../Mermain'
import { iMeta } from '@/hooks/useBlockType'
import { CodeBlock } from 'notion-types'
import { useNotionContext } from 'react-notion-x'

interface iProps {
  block: CodeBlock
  className: string
  meta?: iMeta
}

// API接口文档解析
export function PasstoMermaid({ block, className }: iProps) {
  const { recordMap } = useNotionContext()

  // 读取code block
  const chart = useMemo(() => {
    let res = ''
    block.content.find((item) => {
      const currentBlock = recordMap.block[item].value
      const { type } = currentBlock
      console.log('typetype', type)
      if (type === 'code') {
        res = currentBlock.properties?.title?.[0]?.[0] || ''
      } else {
        return false
      }
    })
    return res
  }, [block, recordMap])

  return (
    <div>
      <Mermain chart={chart} />
    </div>
  )
}

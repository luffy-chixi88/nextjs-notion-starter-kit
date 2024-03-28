import React, { useEffect, useMemo, useRef, useState } from 'react'

import { iMeta } from '@/hooks/useBlockType'
import cs from 'classnames'
import { CodeBlock } from 'notion-types'
import { getTextContent } from 'notion-utils'
import { highlightElement } from 'prismjs'
import 'prismjs/components/prism-go.min.js'
import 'prismjs/components/prism-java.min.js'
import 'prismjs/components/prism-javascript.min.js'
import 'prismjs/components/prism-python.min.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js'
import { useNotionContext } from 'react-notion-x'

interface iProps {
  block: CodeBlock
  className: string
  meta?: iMeta
}

// API接口文档解析
export function PasstoCode({ block, className }: iProps) {
  const { recordMap } = useNotionContext()

  const [act, setAct] = useState(0)

  // 读取code block
  const codeBlocks = useMemo(() => {
    const res = []
    block.content.map((item) => {
      const toggleBlock = recordMap.block[item]?.value
      if (toggleBlock && toggleBlock?.type === 'toggle' && toggleBlock.content[0]) {
        toggleBlock?.content.forEach((sitem) => {
          const codeBlock = recordMap.block[sitem]?.value
          if (codeBlock && codeBlock?.type === 'code') {
            res.push({
              language: getTextContent(codeBlock.properties?.language),
              content: getTextContent(codeBlock.properties.title)
            })
          }
        })
      }
    })
    return res
  }, [block, recordMap])

  return (
    <div className={cs('rounded-2xl overflow-hidden bg-black pt-code', className)}>
      <div className='flex'>
        {codeBlocks.map((item, i) => {
          return (
            <a
              key={i}
              onClick={() => setAct(i)}
              className={cs('cursor-pointer p-4 text-sm', {
                'text-[color:white] border-b-2 border-b-[color:white]': act === i,
                'text-[color:#6D6D82]': act !== i
              })}
            >
              {item.language}
            </a>
          )
        })}
      </div>
      <div className='toolpanel'>
        <Code
          key={codeBlocks[act].language}
          content={codeBlocks[act].content}
          language={codeBlocks[act].language}
        />
      </div>
    </div>
  )
}

export function Code(props) {
  const { className, language, content, defaultLanguage = 'javascript' } = props

  const codeRef = useRef()
  useEffect(() => {
    if (codeRef.current) {
      try {
        highlightElement(codeRef.current)
      } catch (err) {
        console.warn('prismjs highlight error', err)
      }
    }
  }, [codeRef])

  const formatLang = useMemo(() => {
    const lang = (language || defaultLanguage).toLowerCase()
    return lang === 'nodejs' || lang === 'php' ? defaultLanguage : lang
  }, [language, defaultLanguage])

  return (
    <pre className={cs('notion-code', className)}>
      <code className={`language-${formatLang} line-numbers`} ref={codeRef}>
        {content}
      </code>
    </pre>
  )
}

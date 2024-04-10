import Link from 'next/link'
import React, { useMemo } from 'react'

import clsx from 'classnames'
import { useNotionContext } from 'react-notion-x'

interface IBtn {
  children: React.ReactNode
  type?: string // default primary gradient
  disabled?: boolean // 禁用
  onClick?: () => void // 点击事件
  href?: string // 链接
  block?: boolean
  className?: string
  size?: string // default small large
  loading?: boolean
}

function Btn({ size, className, type, disabled, block, onClick, children, href, loading }: IBtn) {
  const { components, mapPageUrl } = useNotionContext()
  const handleClick = () => {
    if (disabled || loading) return
    onClick?.()
  }
  const formatClsx = clsx([
    'items-center justify-center',
    className,
    {
      'h-8 rounded': size == 'default',
      'h-12 rounded-lg': size === 'large',
      'w-full flex': block,
      'inline-flex': !block,
      'cursor-pointer': !disabled,
      'opacity-50 cursor-not-allowed': disabled || loading,
      'text-light': type,
      'bg-[var(--primary)] text-white': type === 'primary'
    }
  ])

  const formatChildren = useMemo(() => {
    return (
      <>
        {loading && <div className='spinner mr-3'></div>}
        {children}
      </>
    )
  }, [loading, children])

  // notion page id
  if (href && !href.startsWith('/') && !href.startsWith('http')) {
    return (
      <components.PageLink href={mapPageUrl(href)} className={formatClsx}>
        {formatChildren}
      </components.PageLink>
    )
  } else if (href && !href.startsWith('http')) {
    // 相对路径
    const newHref = href.indexOf('?pvs') === -1 ? href : mapPageUrl(href)
    return (
      <Link href={newHref}>
        <a onClick={handleClick} className={formatClsx}>
          {formatChildren}
        </a>
      </Link>
    )
  } else {
    const otherProps = {} as any
    if (href) {
      otherProps.href = href
      otherProps.target = '_blank'
    }
    return (
      <a onClick={handleClick} className={formatClsx} {...otherProps}>
        {formatChildren}
      </a>
    )
  }
}

export default Btn

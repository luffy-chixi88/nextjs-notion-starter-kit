import React from 'react'
import clsx from 'classnames'
import Link from 'next/link'
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
}

function Btn({ size, className, type, disabled, block, onClick, children, href }: IBtn) {
  const { components, mapPageUrl } = useNotionContext()
  const handleClick = () => {
    if (disabled) return
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
      'opacity-50 cursor-not-allowed': disabled,
      'text-light': type,
      'bg-[var(--primary)]': type === 'primary',
    },
  ])
  // notion page id
  if(href && !href.startsWith('/') && !href.startsWith('http')){
    return (
        <components.PageLink
            href={mapPageUrl(href)}
            className={formatClsx}
        >
            {children}
        </components.PageLink>
        )
  }else if (href && !href.startsWith('http')) {
    // 相对路径
    return (
      <Link className={formatClsx} onClick={handleClick} href={href}>
        {children}
      </Link>
    )
  }else{
    const otherProps = {} as any
    if(href) {
        otherProps.href = href
        otherProps.target = '_blank'
    }
    return (
        <a onClick={handleClick} className={formatClsx} {...otherProps}>
            {children}
        </a>
    )
  }
}

export default Btn

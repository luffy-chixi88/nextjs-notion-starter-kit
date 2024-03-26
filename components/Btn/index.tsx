import React from 'react'
import clsx from 'classnames'
import Link from 'next/link'

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
      'bg-bmBlue': type === 'default',
      'bg-primary': type === 'primary',
      'btn-gradient hover:btn-gradient-hover': type === 'gradient',
    },
  ])
  if (href && !href.startsWith('http')) {
    return (
      <Link className={formatClsx} onClick={handleClick} href={href}>
        {children}
      </Link>
    )
  }
  return (
    <a onClick={handleClick} className={formatClsx}>
      {children}
    </a>
  )
}

export default Btn

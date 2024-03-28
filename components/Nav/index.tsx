import React from 'react'

export default function Nav({ children }) {
  return (
    <header className='notion-header'>
      <div className='notion-nav-header'>{children}</div>
    </header>
  )
}

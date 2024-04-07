import React, { useState } from 'react'

import { domain } from '@/lib/config'

export function PasstoReadme(props) {
  return (
    <iframe
      src={`https://${domain}${props.meta.url}`}
      width='100%'
      height='1000'
      style={{ marginTop: '-64px', overflow: 'hidden' }}
    />
  )
}

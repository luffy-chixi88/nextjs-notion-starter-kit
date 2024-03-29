import React, { useState } from 'react'

export function PasstoReadme(props) {
  return (
    <iframe
      src={`https://passto2pay.zapto.org${props.meta.url}`}
      width='100%'
      height='1000'
      style={{ marginTop: '-64px', overflow: 'hidden' }}
    />
  )
}

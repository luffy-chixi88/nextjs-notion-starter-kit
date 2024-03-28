import { defaultPageCover, defaultPageIcon } from './config'
import { Block } from 'notion-types'
import { defaultMapImageUrl } from 'react-notion-x'

export const mapImageUrl = (url: string, block: Block) => {
  if (url === defaultPageCover || url === defaultPageIcon) {
    return url
  }

  return defaultMapImageUrl(url, block)
}

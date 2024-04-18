import { useMemo } from 'react'

import VideoAutoPlay from '@/components/Video/autoPlay'
import { useDataBase } from '@/hooks/useDataBase'
import { useNotionContext } from 'react-notion-x'

interface iTableschema {
  Name: string // 名字
  Image: string //
  Description: string
}

export function PasstoBannerVideo(props) {
  const { recordMap } = useNotionContext()

  const blockList = useMemo(() => {
    let selectBlockList = null
    Object.keys(recordMap.collection_view).forEach((item) => {
      if (
        recordMap.collection_view[item]?.value?.name === 'PasstoBanner' &&
        recordMap.collection_view[item]?.value?.id
      ) {
        selectBlockList = recordMap[recordMap.collection_view[item]?.value?.id]
        console.log('blockList', recordMap.collection_view[item]?.value?.id)
      }
    })
    return selectBlockList
  }, [recordMap])

  console.log('blockList', blockList)

  const list = useDataBase<iTableschema>({ block: blockList })

  console.log('bbbb', list)
  return (
    <div>
      <VideoAutoPlay {...props} />
    </div>
  )
}

import React, { useMemo } from 'react'

import VideoAutoPlay from '@/components/Video/autoPlay'
import { getCalloutAttr } from '@/hooks/useBlockType'
import { useDataBase } from '@/hooks/useDataBase'
import cs from 'classnames'
import { useNotionContext } from 'react-notion-x'

function Banner(props) {
  const { block, className, children } = props
  const { recordMap } = useNotionContext()
  // 指定callout内容返回
  const content = useMemo(() => {
    const res = { header: null, type: 'image', center: null, list: null }
    block.content.forEach((item, i) => {
      const currentBlock = recordMap.block[item].value
      const { type } = currentBlock
      if (type === 'callout') {
        // @ts-ignore
        const blockType = getCalloutAttr(currentBlock)
        if (blockType?.title === 'BannerHead') {
          res.header = children[i]
        } else if (blockType?.title === 'PasstoBannerVideo') {
          res.type = 'video'
          res.center = (
            <VideoAutoPlay className={blockType.title} block={currentBlock} meta={blockType.meta} />
          )
        } else if (blockType?.title === 'BannerImage') {
          res.type = 'image'
          res.center = children[i]
        }
      } else if (type === 'collection_view') {
        res.list = <List block={currentBlock} />
      }
    })
    return res
  }, [block, recordMap, children])

  return (
    <div className={cs(props.className, className)}>
      <div>{content.header}</div>
      <div className='flex justify-center relative max-lg:flex-col'>
        <div className='content'>
          <div className={content.type === 'video' ? 'banner-video' : 'banner-image'}>
            <div className='banner-content'>{content.center}</div>
          </div>
        </div>
        {content.list}
      </div>
    </div>
  )
}

export default Banner

interface iTableschema {
  Name: string
  Image: string
  Description: string
}

function List({ block }) {
  const list = useDataBase<iTableschema>({ block })
  return (
    <div className='pt-list'>
      {list.map((item, i) => {
        return <ListItem item={item} key={i} />
      })}
    </div>
  )
}

function ListItem({ item }) {
  return (
    <div className='item'>
      <div className='item-content'>
        <div className='relative'>
          <img
            src={item.Image}
            alt={item.Name}
            className='block w-[64px] h-[64px] max-lg:w-[48px] max-lg:h-[48px]'
          />
        </div>
        <div className='flex-1'>
          <h5 className='text-2xl  max-lg:text-xl'>{item.Name}</h5>
          <p className='pt-2 text-sm text-[color:--gray] whitespace-pre-line'>{item.Description}</p>
        </div>
      </div>
    </div>
  )
}

import Image from 'next/image'
import React, { useMemo, useState } from 'react'

import Btn from '@/components/Btn'
import { useDataBase } from '@/hooks/useDataBase'
import { mapImageUrl } from '@/lib/map-image-url'
import cs from 'classnames'

interface iTableSchema {
  Title: string // 标题
  Description: string // 描述
  Link: string // 链接【联系我们】
  LinkUrl: string // 链接地址
  TabIcon: string // 图标
  TabIconAct: string // 选中图标
  TabTitle: string // tab标题
  VideoUrl: string // video地址
}

// 收款场景组件
export function PasstoScence(props) {
  const { block, className } = props
  const list = useDataBase<iTableSchema>({ block, multipleFile: false })

  const [index, setIndex] = useState(0)

  const selectItem = useMemo(() => list[index], [list, index])

  return (
    <div className={cs(className)}>
      <div className='flex items-center justify-start pt-10 max-lg:pt-8 border-b border-b-dashed border-slate-800 overflow-hidden overflow-x-auto'>
        {list?.map((item, i) => {
          return (
            <div
              key={i}
              className={cs(
                'cursor-pointer flex-1 whitespace-nowrap	text-center basis-28  border-white/10 mr-6 last:mr-0 py-5',
                {
                  'border-b-2': index === i,
                  'border-b-[var(--light-primary)]': (i + 1) % 3 === 1 && index === i,
                  'border-b-[#009444]': (i + 1) % 3 === 2 && index === i,
                  'border-b-[#5B3BEA]': (i + 1) % 3 === 0 && index === i,
                  'hover:border-[var(--light-primary)]': (i + 1) % 3 === 1,
                  'hover:border-b-[#009444]': (i + 1) % 3 === 2,
                  'hover:border-b-[#5B3BEA]': (i + 1) % 3 === 0
                }
              )}
              onClick={() => setIndex(i)}
            >
              <div>
                <div className='relative inline-flex items-center w-[32px] h-[32px]'>
                  <Image
                    src={index === i ? item.TabIconAct : item.TabIcon}
                    alt={item.TabTitle}
                    layout='fill'
                  />
                  {/* 预加载图片 */}
                  <Image
                    className='hidden'
                    src={index !== i ? item.TabIconAct : item.TabIcon}
                    alt={item.TabTitle}
                    layout='fill'
                  />
                </div>
                <p
                  className={cs('mt-1', 'text-sm', {
                    'text-[color:var(--gray)]': index !== i
                  })}
                >
                  {item.TabTitle}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      {selectItem && (
        <div className='my-8  max-lg:my-0'>
          <div className={cs('flex max-lg:flex-col')}>
            <div className='max-w-full w-[380px] mr-8 max-lg:mr-0 max-lg:mb-8 flex flex-wrap items-center'>
              <div>
                <h3 className='notion-h3 font-semibold'>{selectItem.Title}</h3>
                <p className={cs('notion-text notion-gray text-[color:var(--gray)]')}>
                  {selectItem.Description}
                </p>
                <Btn href={selectItem.LinkUrl} className='notion-link mt-6'>
                  <b
                    className={cs({
                      '!bg-[var(--light-primary)]': index === 0,
                      '!bg-[#009444]': index === 1,
                      '!bg-[#5B3BEA]': index === 2
                    })}
                  >
                    <span className='mr-2 '>{selectItem.Link}</span>
                    <Image src='/icon/arrow.svg' alt={selectItem.Link} width={16} height={14} />
                  </b>
                </Btn>
              </div>
            </div>
            <div className='flex-1'>
              <div className='relative w-[100%] h-[400px] overflow-hidden  max-lg:h-[192px]'>
                <video src={selectItem.VideoUrl} muted autoPlay />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

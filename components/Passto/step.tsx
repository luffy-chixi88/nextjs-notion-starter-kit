import React, { useMemo, useRef, useState } from 'react'

import { getBlockType } from '@/hooks/useBlockType'
import { useDataBase } from '@/hooks/useDataBase'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import cs from 'classnames'
import { useNotionContext } from 'react-notion-x'
import { Autoplay } from 'swiper/modules'
import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface iTableschema {
  Name: string
  Image: string
  Description: string
}

export function PasstoStep(props) {
  const { block, className, children } = props
  const { recordMap } = useNotionContext()

  // 指定callout内容返回
  const content = useMemo(() => {
    const res = { header: null, footer: null, swiper: null }
    block.content.forEach((item, i) => {
      const { type } = recordMap.block[item].value
      if (type === 'callout') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const blockType = getBlockType(recordMap.block[item].value)
        if (blockType === 'PasstoStepHeader') {
          res.header = children[i]
        } else if (blockType === 'PasstoStepOption') {
          res.footer = children[i]
        }
      } else if (type === 'collection_view') {
        res.swiper = recordMap.block[item].value
      }
    })
    return res
  }, [block, recordMap, children])

  return (
    <>
      {content.header}
      {content.swiper && (
        <PasstoStepSwiper block={content.swiper} className={className}>
          {content.footer}
        </PasstoStepSwiper>
      )}
    </>
  )
}

// 收款步骤
export function PasstoStepSwiper(props) {
  const { block, className, children } = props
  const list = useDataBase<iTableschema>({ block })
  const swiper = useRef(null)
  const [index, setIndex] = useState(0)

  // true为pc false为小尺寸
  const isPC = useMediaQuery('(min-width: 1024px)')
  const handleSlideTo = (currentIndex) => {
    if (swiper.current.swiper) {
      swiper.current.swiper.slideTo(currentIndex, 1000, false)
      setIndex(currentIndex)
    }
  }
  return (
    <div className={cs('flex pt-20 max-lg:flex-col', className)}>
      <div className='flex items-center justify-center'>
        <Swiper
          pagination={
            isPC
              ? false
              : {
                  clickable: true
                }
          }
          ref={swiper}
          modules={[Autoplay, Pagination]}
          className='w-[600px] h-[648px] max-lg:h-[416px]'
          direction={isPC ? 'vertical' : 'horizontal'}
          autoplay={
            isPC
              ? {
                  pauseOnMouseEnter: true,
                  disableOnInteraction: false,
                  delay: 3000
                }
              : false
          }
          loop={true}
          onSlideChangeTransitionEnd={(swiper) => {
            setIndex(swiper.activeIndex)
          }}
        >
          {list.map((item, i) => {
            return (
              <SwiperSlide key={i} className='slide'>
                <img src={item.Image} />
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>
      <div className='ml-32 max-lg:ml-0'>
        {list.map((item, i) => {
          return (
            <div
              key={i}
              className={cs('flex max-lg:flex-col mb-10 cursor-pointer max-lg:mb-5', {
                'opacity-40': index !== i,
                hidden: index !== i && !isPC
              })}
              onClick={() => handleSlideTo(i)}
            >
              <div className='mr-2'>
                <div className='bg-[var(--primary)] text-white rounded-full w-11 h-11 leading-[44px] text-center max-lg:w-6 max-lg:h-6 max-lg:leading-6'>
                  {i + 1}
                </div>
              </div>
              <div>
                <h5
                  className='notion-h notion-h3 m-0 max-lg:!my-4 max-lg:!text-xl'
                  dangerouslySetInnerHTML={{ __html: item.Name }}
                ></h5>
                <p className='notion-text notion-gray !p-0'>{item.Description}</p>
              </div>
            </div>
          )
        })}
        <div className='flex max-lg:hidden'>{children}</div>
      </div>
    </div>
  )
}

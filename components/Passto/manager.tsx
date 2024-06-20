import React, { useEffect, useMemo, useRef, useState } from 'react'

import { getBlockType } from '@/hooks/useBlockType'
import { useDataBase } from '@/hooks/useDataBase'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import cs from 'classnames'
import { useNotionContext } from 'react-notion-x'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface iTableschema {
  Title: string // 标题
  Name: string // 名字
  Image: string // pc封面
  ImageMobile: string // 移动端图片
  Description: string
}

// 管理后台swiper
export function PasstoManager(props) {
  const { block, className, children } = props
  const list = useDataBase<iTableschema>({ block })
  const swiper = useRef(null)
  const [index, setIndex] = useState(0)

  // true为pc false为小尺寸
  const isPC = useMediaQuery('(min-width: 1024px)')

  const handleNavigation = (type) => {
    const currentSwiper = swiper.current?.swiper
    if (!currentSwiper) return
    type === 'prev' ? currentSwiper.slidePrev() : currentSwiper.slideNext()
  }

  return (
    <div className={cs('pt-[190px] max-lg:pt-0 pb-8 relative', className)}>
      <h1 className='notion-h notion-h2 !mb-12 block text-center'>
        <span className='notion-h-title'>{list[index]?.Title || ''}</span>
      </h1>
      <div className='flex'>
        <div className='mx-32 max-lg:mx-0 flex-1 min-w-0'>
          <Swiper
            loop
            pagination={{
              clickable: true
            }}
            navigation={{
              nextEl: '.swiper-button-next2',
              prevEl: '.swiper-button-prev2'
            }}
            ref={swiper}
            modules={[Autoplay, Pagination, Navigation]}
            className='w-full'
            direction='horizontal'
            autoplay={
              isPC
                ? {
                    pauseOnMouseEnter: true,
                    disableOnInteraction: false,
                    delay: 3000
                  }
                : false
            }
            onSlideChangeTransitionEnd={(swiper) => {
              setIndex(swiper.realIndex)
            }}
            onResize={(swiper) => {
              swiper.update()
            }}
          >
            {list.map((item, i) => {
              return (
                <SwiperSlide key={i} className='slide'>
                  <img className='max-lg:!hidden' src={item.Image} />
                  <img className='lg:!hidden' src={item.ImageMobile} />
                  <div className='absolute left-0 right-0 bottom-0  lg:bg-gradient-to-t lg:from-black p-8 text-white max-lg:relative max-lg:text-black max-lg:pt-8 max-lg:pb-0 max-lg:px-0'>
                    <h3 className='font-bold text-2xl pb-2 max-lg:text-xl max-lg:text-center'>
                      {item.Name}
                    </h3>
                    <p className='!text-sm whitespace-pre-line	max-lg:!text-sm  max-lg:text-center'>
                      {item.Description}
                    </p>
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
        <div className={cs('swiper-button-prev')} onClick={() => handleNavigation('prev')}></div>
        <div className={cs('swiper-button-next')} onClick={() => handleNavigation('next')}></div>
      </div>
    </div>
  )
}

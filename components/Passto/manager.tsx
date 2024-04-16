import React, { useEffect, useMemo, useRef, useState } from 'react'

import { getBlockType } from '@/hooks/useBlockType'
import { useDataBase } from '@/hooks/useDataBase'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import cs from 'classnames'
import { useNotionContext } from 'react-notion-x'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

interface iTableschema {
  Name: string // 名字
  Image: string //
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

  const handleSlideTo = (currentIndex) => {
    const currentSwiper = swiper.current?.swiper
    if (currentSwiper) {
      currentSwiper.slideToLoop(currentIndex, 1000, false)
      setIndex(currentIndex)
    }
  }

  const handleNavigation = (type) => {
    const currentSwiper = swiper.current?.swiper
    if (!currentSwiper) return
    type === 'prev' ? currentSwiper.slidePrev() : currentSwiper.slideNext()
  }

  return (
    <div className={cs('pt-20 relative', className)}>
      <div className='flex'>
        <div className='mx-32 flex-1 min-w-0'>
          <Swiper
            loop
            slidesPerView={1}
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
                  <img src={item.Image} />
                  <div className='absolute left-0 right-0 bottom-0  bg-gradient-to-t from-black p-8 text-white'>
                    <h3 className='text-2xl pb-2'>{item.Name}</h3>
                    <p className='text-sm whitespace-pre-line	'>{item.Description}</p>
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

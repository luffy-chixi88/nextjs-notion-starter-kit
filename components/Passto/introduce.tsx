import React, { useState } from 'react'

import Btn from '@/components/Btn'
import { useDataBase } from '@/hooks/useDataBase'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import cs from 'classnames'

interface iTableSchema {
  Title: string
  Image: string[]
  Description: string
  Link: string
  LinkText: string
  ImageLayout: string
}

function PasstoLink(item) {
  return (
    <div className='shrink-0 mr-16 mb-4 link'>
      <Btn href={item.Link} className='text-[var(--light-primary)]'>
        <b>
          <span className='mr-2'>{item.LinkText || 'View'}</span>
        </b>
      </Btn>
    </div>
  )
}

export function PasstoIntro(props) {
  const { className, block } = props
  const [activeIndex, setActiveIndex] = useState(0)

  const dataList = useDataBase<iTableSchema>({ block, multipleFile: true })
  const isPC = useMediaQuery('(min-width: 1024px)')

  const handleActiveIndex = (index) => {
    console.log('activeIndex', activeIndex, index)
    if (activeIndex === index && !isPC) {
      setActiveIndex(-1)
      return
    }
    setActiveIndex(index)
  }

  return (
    <div className={cs(className, 'intro-list flex  max-lg:flex-col')}>
      {dataList.map((item, index) => {
        return (
          <div
            key={index}
            className={cs('intro-item ', {
              active: index == activeIndex
            })}
            onClick={() => handleActiveIndex(index)}
            onMouseEnter={() => setActiveIndex(index)}
          >
            <p className='title'>{item.Title}</p>
            <div className='content'>
              {item.Description && (
                <ul>
                  {item.Description.split('\n').map((desc, i) => {
                    return <li key={i}>{desc}</li>
                  })}
                </ul>
              )}

              {item.Link && item.ImageLayout !== 'Single' && PasstoLink(item)}

              {item.Image?.length && (
                <>
                  {Array.from(Array(Math.ceil(item.Image.length / 3)).keys()).map((i) => {
                    switch (item.ImageLayout) {
                      case 'Single':
                        return (
                          <div key={i} className='flex items-start'>
                            {item.Link && PasstoLink(item)}
                            <div>
                              <img src={item.Image[i]} alt={item.Title} />
                            </div>
                          </div>
                        )
                      case 'Col':
                        return (
                          <div key={i} className='flex mb-5'>
                            <div className='flex-1'>
                              <img src={item.Image[i]} alt={item.Title} />
                            </div>
                            {item.Image[i + 1] && (
                              <div className='w-1/3 ml-8 flex flex-col justify-between max-lg:ml-2.5'>
                                <div>
                                  <img src={item.Image[i + 1]} alt={item.Title} />
                                </div>
                                {item.Image[i + 2] && (
                                  <div>
                                    <img src={item.Image[i + 2]} alt={item.Title} />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      case 'ImageRow':
                        return (
                          <div key={i} className='mb-5 flex'>
                            <div className='flex'>
                              <img src={item.Image[i]} alt={item.Title} />
                            </div>
                            {item.Image[i + 1] && (
                              <div className='flex ml-6'>
                                <div>
                                  <img src={item.Image[i + 1]} alt={item.Title} />
                                </div>
                                {item.Image[i + 2] && (
                                  <div className='ml-6'>
                                    <img src={item.Image[i + 2]} alt={item.Title} />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      case 'Row':
                      default:
                        return (
                          <div key={i} className='mb-5'>
                            <div className='mb-5'>
                              <img src={item.Image[i]} alt={item.Title} />
                            </div>
                            {item.Image[i + 1] && (
                              <div className='flex'>
                                <div>
                                  <img src={item.Image[i + 1]} alt={item.Title} />
                                </div>
                                {item.Image[i + 2] && (
                                  <div className='ml-6'>
                                    <img src={item.Image[i + 2]} alt={item.Title} />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                    }
                  })}
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

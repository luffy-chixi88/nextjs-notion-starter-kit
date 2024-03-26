import React, { useState, useMemo } from "react"
import cs from "classnames"
import Btn from '@/components/Btn'
import { mapImageUrl } from '@/lib/map-image-url'
import Image from 'next/image'

// 收款场景组件
export function PasstoScence(props){
    const { block, className, ctx } = props
    const { recordMap } = ctx
    const component = recordMap.collection_view[block.view_ids[0]]?.value
    const collectId = component?.format?.collection_pointer?.id
    
    const blockIds = useMemo(() => {
        return recordMap.collection_query?.[collectId]?.[component.id]?.collection_group_results?.blockIds ?? []
    }, [recordMap, collectId, component.id])
   
    // 数据表结构
    const schema = recordMap.collection?.[collectId]?.value?.schema
    // 列表
    const list = useMemo(() => {
        return blockIds.map((blockId) => {
            const res = {}
            const block = recordMap.block[blockId].value
            const { properties } = block
            Object.keys(properties).forEach(item => {
                if( schema[item]){
                    const { type, name } = schema[item]
                    if(type && name){
                        const value = (type === 'title' || type === 'text' || type === 'url') ? properties[item][0][0] : mapImageUrl(properties[item][0][1][0][1], block)
                        res[name] = value ?? ''
                    }
                }     
                })    
            return res
        })
    }, [blockIds, recordMap, schema])

    const [index, setIndex] = useState(0)

    const selectItem = useMemo(() => list[index], [list, index])

    return (
        <div className={cs(className)}>
            <div className="flex items-center justify-center pt-10">
               {list.map((item, i) => {
                    return (
                        <div 
                            key={i} 
                            className={cs("cursor-pointer flex items-center justify-center flex-1 border border-white/10 rounded mr-4 last:mr-0 py-8", 
                                { 
                                    'border-b-2': index === i, 
                                    'border-b-[#1865FF]': (i === 0 && index === i), 
                                    'border-b-[#009444]': i === 1 && index === i,
                                    'border-b-[#5B3BEA]': i === 2 && index === i,
                                }
                            )} 
                            onClick={() => setIndex(i)}
                        >
                          <div>
                            <div className="relative flex items-center w-[56px] h-[56px]">
                                <Image src={index === i ? item.TabIconAct : item.TabIcon} alt={item.TabTitle} layout='fill' />
                            </div>
                            <p className={cs('text-[color:var(--gray)] mt-4', {
                                'text-white': index === i
                            })}>{item.TabTitle}</p>
                          </div>
                        </div>
                    )
               })}
            </div>
            <div className="my-8">
                <div className={cs("flex")}>
                    <div className="max-w-[380px] mr-8 flex flex-wrap items-center">
                        <div>
                            <h3 className="notion-h2">{selectItem.Title}</h3>
                            <p className={cs("notion-text notion-gray text-[color:var(--gray)]")}>{selectItem.Description}</p>
                            <Btn 
                                type="primary"
                                href={selectItem.Link}
                                className="notion-link mt-6"
                            >
                                <b className={cs({
                                    '!bg-[#1865FF]': index === 0,
                                    '!bg-[#009444]': index === 1,
                                    '!bg-[#5B3BEA]': index === 2,
                                })}>
                                    <span className="mr-2 ">{selectItem.LinkText}</span>
                                    <Image 
                                        src='/icon/arrow.svg'
                                        alt={selectItem.LinkText}
                                        width={16}
                                        height={14}
                                    />
                                </b>
                                
                            </Btn>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="relative w-[100%] h-[454px]">
                            <video src={selectItem.VideoUrl} muted autoPlay />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
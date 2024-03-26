import React, { useState, useMemo } from "react"
import classNames from "classnames"
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
                    if(type === 'file'){
                        console.log('type', type, block)
                    }
                    if(type && name){
                        const value = (type === 'title' || type === 'text') ? properties[item][0][0] : mapImageUrl(properties[item][0][1][0][1], block)
                        res[name] = value ?? ''
                    }
                }     
                })    
            return res
        })
    }, [blockIds, recordMap, schema])

    const [index, setIndex] = useState(0)

    console.log('list', list)

    return (
        <div className={classNames(className, 'bg-[/home/scence.png]')}>
            <div className="flex items-center justify-center">
               {list.map((item, i) => {
                    return (
                        <div 
                            key={i} 
                            className={classNames("flex items-center justify-center flex-1 border border-white/10 rounded mr-4 last:mr-0", { 'b': index === i })} 
                            onClick={() => setIndex(i)}
                        >
                          <div>
                            <div className="relative flex items-center w-[56px] h-[56px]">
                                <Image src={index === i ? item.TabIconAct : item.TabIcon} alt={item.TabTitle} layout='fill' />
                            </div>
                            <p>{item.TabTitle}</p>
                          </div>
                        </div>
                    )
               })}
            </div>
            <div className="content">
                {list.map((item, i) => {
                    return (
                        <div key={i} className={classNames("flex", { hidden: index !== i })}>
                          <div>
                            <h3 className="notion-h3">{item.Title}</h3>
                            <p>{item.Description}</p>
                            <Btn type="primary">
                               <span>联系我们</span>
                               <Image src='/icon/arrow.svg' alt="contact us" width={16} height={14} />
                            </Btn>
                           </div>
                           <div className="">
                                <div className="relative w-[808px] h-[454px]">
                                    <Image src={item.Image}  alt={item.Title} layout='fill' />
                                </div>
                           </div>
                        </div>
                    )
               })}
            </div>
        </div>
    )
}
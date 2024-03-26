import React, { useMemo } from "react"
import classNames from "classnames"
import { mapImageUrl } from '@/lib/map-image-url'

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
                if(schema[item]) {
                    const { type, name } = schema[item]
                    if(type && name){
                        const value = (type === 'title' || type === 'text') ? properties[item][0][0] : mapImageUrl(properties[item][0][1][0][1], block)
                        res[name] = value ?? ''
                    }
                }
            })    
            return res
        })
    }, [blockIds, recordMap, schema])

    return (
        <div className={classNames(className)}>
            <div className="tabBar">
               {list.map((item, i) => {
                    return (
                        <div key={i}>
                           <img src={item.TabIcon} alt={item.TabTitle} width={40} height={40} />
                           <p>{item.TabTitle}</p>
                        </div>
                    )
               })}
            </div>
            <div className="content">
                {JSON.stringify(list)}
            </div>
        </div>
    )
}
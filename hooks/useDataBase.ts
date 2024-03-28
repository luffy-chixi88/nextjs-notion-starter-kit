import { useMemo } from "react";
import * as types from 'notion-types'
import { useNotionContext } from 'react-notion-x'
import { mapImageUrl } from '@/lib/map-image-url'
import { getTextContent } from 'notion-utils'


interface iProps {
    block: types.CollectionViewPageBlock
}

// 读取block自定义类型
export function useDataBase<T>({ block }: iProps) {
    const { recordMap } = useNotionContext()
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
            const res = {} as T
            const block = recordMap.block[blockId].value
            const { properties } = block
            Object.keys(properties).forEach(item => {
                if(schema[item]){
                    const { type, name } = schema[item]
                    if(type && name){
                        switch(type){
                            case 'file':
                                properties[item].forEach(sitem => {
                                    console.log('sitem?.[1]?.[1]', sitem)
                                    if(sitem?.[1]?.[0]?.[1]){
                                        if(!res[name]) res[name] = []
                                        res[name].push(mapImageUrl(sitem?.[1]?.[0]?.[1], block))
                                    }
                                })
                                break
                            default:
                                res[name] = properties[item][0][0] ?? ''
                        }
                    }
                }     
            })    
            console.log('res', res)
            return res
        })
    }, [blockIds, recordMap, schema])
    return list
}

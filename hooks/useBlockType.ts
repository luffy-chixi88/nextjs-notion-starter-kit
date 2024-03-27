import { useMemo } from "react";
import qs from 'qs'
import * as types from 'notion-types'

type blockType = types.CollectionViewPageBlock | types.PageBlock

interface iProps {
    block: blockType
}

export type iMeta = qs.ParsedQs;

export interface iBlockType {
    title: string,
    meta: iMeta;
}

// 读取block自定义类型
export function useBlockType({ block }: iProps) {
    const res = useMemo(() => {
        const currentTitle = (block.properties?.title?.[0]?.[0] || '').split('\n')
        const title = currentTitle[0].split('|')
        const meta = qs.parse(title[1]) || {}
        if(title[0]){
            return {
                title: title[0],
                meta
            }
        }
        return {}
    }, [block]) 
    return res
}

// 获取代码块类型
export const getBlockType = (block: blockType) => {
    const currentTitle = (block.properties?.title?.[0]?.[0] || '').split('\n')
    const title = currentTitle[0].split('|')
    return title[0]
}
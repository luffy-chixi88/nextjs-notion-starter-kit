import { useMemo } from 'react'

import * as types from 'notion-types'
import { mapImageUrl } from '@/lib/map-image-url'
import { useNotionContext } from 'react-notion-x'

interface iProps {
  block: types.CollectionViewPageBlock
  multipleFile?: boolean // 是否多文件
}

// 读取block自定义类型
export function useDataBase<T>({ block, multipleFile = false }: iProps) {
  const { recordMap } = useNotionContext()
  const component = recordMap.collection_view[block?.view_ids?.[0]]?.value
  const collectId = component?.format?.collection_pointer?.id

  const blockIds = useMemo(() => {
    return (
      recordMap.collection_query?.[collectId]?.[component.id]?.collection_group_results?.blockIds ??
      []
    )
  }, [recordMap, collectId, component])

  // 数据表结构
  const schema = recordMap.collection?.[collectId]?.value?.schema
  // 列表
  const list = useMemo(() => {
    return blockIds.map((blockId) => {
      const res = {} as T
      const block = recordMap.block[blockId].value
      const { properties } = block
      Object.keys(properties).forEach((item) => {
        if (schema[item]) {
          const { type, name } = schema[item]
          if (type && name) {
            switch (type) {
              case 'file':
                if (multipleFile) {
                  properties[item].forEach((sitem) => {
                    if (sitem?.[1]?.[0]?.[1]) {
                      if (!res[name]) res[name] = []
                      res[name].push(mapImageUrl(sitem?.[1]?.[0]?.[1], block))
                    }
                  })
                } else {
                  res[name] = mapImageUrl(properties[item]?.[0]?.[1]?.[0]?.[1], block)
                }
                break
              default:
                res[name] = properties[item][0][0] ?? ''
                if (properties[item]?.[0]?.[1]?.[0]?.[0] === 'a') {
                  res[name + 'Url'] = properties[item]?.[0]?.[1]?.[0]?.[1] || ''
                }
            }
          }
        }
      })
      return res
    })
  }, [blockIds, recordMap, schema, multipleFile])

  if (!component || !blockIds) return null

  return list
}

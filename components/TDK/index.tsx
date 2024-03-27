import React, { useMemo } from 'react'
import Head from 'next/head'
import { useNotionContext } from 'react-notion-x'

export default function TDK({ block }){

    const { recordMap } = useNotionContext()

    // 读取code block
    const seo = useMemo(() => {
        const res = []
        block.content.map((item) => {
            const tableBlock = recordMap.block[item]?.value
            if(tableBlock && tableBlock?.type === 'table'){
                const order = tableBlock?.format?.table_block_column_order || []
                tableBlock?.content.forEach(sitem => {
                    const codeBlock = recordMap.block[sitem]?.value
                    if(codeBlock && codeBlock?.type === 'table_row'){
                        const arr = ['label', 'value']
                        const tmp = {label: '', value: ''}
                        order.forEach((orderItem, i) => {
                            if(arr[i]){
                                tmp[arr[i]] =  codeBlock?.properties?.[orderItem]?.[0] || ''
                            }
                        })
                        res.push(tmp)
                    }
                })
            }
        })
        const result = {
            title: '',
            keywords: '',
            description: ''
        }
        res.forEach((item) => {
            result[item.label] = item?.value?.[0] || ''
        })
        return result
    }, [block, recordMap])

    return (
        <Head>
            <meta property='og:title' content={seo.title} />
            <meta name='twitter:title' content={seo.title} />
            <title>{seo.title}</title>
            <meta name='keywords' content={seo.keywords} />
              {seo.description && (
                <>
                <meta name='description' content={seo.description} />
                <meta property='og:description' content={seo.description} />
                <meta name='twitter:description' content={seo.description} />
                </>
            )}
        </Head>
    )
}
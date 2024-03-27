import React, { useState, useMemo } from "react"
import { useNotionContext } from 'react-notion-x'
import cs from "classnames"

export function PasstoForm(props) {

    const { className, block } = props
    const { recordMap } = useNotionContext()
    const [formData, setFormData] = useState({})
    const [submitText, setSubmitText] = useState('Submit')

    const DataList = useMemo(() => {
        const rowDataList = []
        block.content.map((item) => {
            // 表结构
            const tableBlock = recordMap.block[item]?.value
            if(tableBlock && tableBlock?.type === 'table' && tableBlock.content.length) {
                // 标题列
                const titleRow = tableBlock.content[0]
                const titleBlock = recordMap.block[titleRow]?.value
                const titleProp = titleBlock.properties
                // 表格数据
                const dataRow = tableBlock.content?.slice(1)
                dataRow.forEach(row => {
                    const rowData = {}
                    const rowBlock = recordMap.block[row]?.value
                    Object.keys(titleProp).forEach(key => {
                        const { properties } = rowBlock
                        if(properties[key]) {
                            const name = titleProp[key][0][0]
                            const value = properties[key][0][0]
                            rowData[name] = value
                            if(name == 'SubmitText') {
                                setSubmitText(value)
                            }
                        } 
                    })
                    rowDataList.push(rowData)
                })
            }
        })
        return rowDataList
    }, [block, recordMap])

    // 值改变
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // 提交
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("formData", formData)
    }

    return (
        <div className={cs('form-box', className)}>
            <form onSubmit={handleSubmit}>
                {DataList.map((item, i) => {
                    return (
                        <div key={i} className="form-item">
                            <input name={item.Name} onChange={handleChange} placeholder={item.Placeholder} />
                        </div> 
                    )
                })}
                <div className="submit-btn">
                    <button type="submit">{ submitText }</button>
                </div>
            </form>
        </div>
    )
}


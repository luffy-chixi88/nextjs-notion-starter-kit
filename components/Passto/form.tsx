import React, { useMemo, useState } from 'react'

import Toast from '@/lib/toast'
import cs from 'classnames'
import { useNotionContext } from 'react-notion-x'

function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

export function PasstoForm(props) {
  const { block, className } = props
  const { recordMap } = useNotionContext()
  const [formData, setFormData] = useState({
    email: ''
  })
  const [submitText, setSubmitText] = useState('Submit')

  const DataList = useMemo(() => {
    const rowDataList = []
    block.content.map((item) => {
      // 表结构
      const tableBlock = recordMap.block[item]?.value
      if (tableBlock && tableBlock?.type === 'table' && tableBlock.content.length) {
        // 标题列
        const titleRow = tableBlock.content[0]
        const titleBlock = recordMap.block[titleRow]?.value
        const titleProp = titleBlock.properties
        // 表格数据
        const dataRow = tableBlock.content?.slice(1)
        dataRow.forEach((row) => {
          const rowData = {}
          const rowBlock = recordMap.block[row]?.value
          Object.keys(titleProp).forEach((key) => {
            const { properties } = rowBlock
            if (properties[key]) {
              const name = titleProp[key][0][0]
              const value = properties[key][0][0]
              rowData[name] = value
              if (name == 'SubmitText') {
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
    if (!formData.email || !isValidEmail(formData.email)) {
      return Toast.error('郵箱格式不對')
    }
    fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: formData.email })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setFormData({
            email: ''
          })
        }
        Toast.info(data.success ? '提交成功' : '提交失敗')
      })
      .catch((error) => {
        Toast.error('提交失敗')
      })
  }

  return (
    <div className={cs('form-box', className)}>
      <form onSubmit={handleSubmit}>
        {DataList.map((item, i) => {
          return (
            <div key={i} className='form-item'>
              <input
                value={formData[item.Name]}
                name={item.Name}
                onChange={handleChange}
                placeholder={item.Placeholder}
                autoComplete='false'
              />
            </div>
          )
        })}
        <div className='submit-btn'>
          <button type='submit'>{submitText}</button>
        </div>
      </form>
    </div>
  )
}

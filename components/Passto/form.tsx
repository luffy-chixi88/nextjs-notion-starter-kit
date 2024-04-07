import React, { useMemo, useState } from 'react'

import Btn from '../Btn'
import Toast from '@/lib/toast'
import { isValidEmail } from '@/lib/utils'
import cs from 'classnames'
import { useNotionContext } from 'react-notion-x'

export function PasstoForm(props) {
  const { block, className } = props
  const { recordMap } = useNotionContext()
  const [loading, setLoading] = useState(false)
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
  const handleSubmit = () => {
    if (!isValidEmail(formData.email)) {
      return Toast.error('郵箱格式不正確')
    }
    setLoading(true)
    fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: formData.email, source: 0 })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setFormData({
            ...formData,
            email: ''
          })
        }
        Toast.info(data.success ? '提交成功' : '提交失敗')
      })
      .catch((error) => {
        Toast.error('提交失敗')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className={cs('form-box', className)}>
      <form>
        {DataList.map((item, i) => {
          return (
            <div key={i} className='form-item'>
              <input
                value={formData[item.Name]}
                name={item.Name}
                onChange={handleChange}
                placeholder={item.Placeholder}
                autoComplete='off'
              />
            </div>
          )
        })}
        <div className='submit-btn'>
          <Btn type='primary' loading={loading} onClick={handleSubmit}>
            {submitText}
          </Btn>
        </div>
      </form>
    </div>
  )
}

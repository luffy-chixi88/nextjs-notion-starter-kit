import { useRouter } from 'next/router'
import React, { useState } from 'react'

import Btn from '@/components/Btn'
import Toast from '@/lib/toast'
import { isValidEmail } from '@/lib/utils'

export default function PasstoForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '', //姓名
    email: '', // 郵箱
    phone: '' //手機號碼
  })
  const router = useRouter()
  // 值改变
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() })
  }

  // 提交
  const handleSubmit = () => {
    if (formData.name === '') {
      return Toast.error('請輸入您的姓名')
    }
    if (!isValidEmail(formData.email)) {
      return Toast.error('郵箱格式不正確')
    }
    if (formData.phone === '') {
      return Toast.error('請輸入您的手機號碼')
    }
    setLoading(true)
    fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData,
        source: router.query?.source || 0
      })
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setFormData({
            ...formData,
            name: '',
            email: '',
            phone: ''
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
    <form className='max-w-lg mx-auto p-4'>
      <div className='mb-5'>
        <label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900'>
          您的姓名：
        </label>
        <input
          type='text'
          id='name'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          placeholder='輸入您的姓名'
          required
          onChange={handleChange}
          name='name'
          value={formData.name}
        />
      </div>
      <div className='mb-5'>
        <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900'>
          您的郵箱：
        </label>
        <input
          type='email'
          id='email'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
          required
          placeholder='輸入您的郵箱'
          onChange={handleChange}
          name='email'
          value={formData.email}
        />
      </div>
      <div className='mb-5'>
        <label htmlFor='phone' className='block mb-2 text-sm font-medium text-gray-900'>
          您的手機號碼：
        </label>
        <input
          type='tel'
          id='phone'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 '
          required
          placeholder='輸入您的手機號碼'
          onChange={handleChange}
          name='phone'
          value={formData.phone}
        />
      </div>
      <div className='w-2/3 mx-auto mt-12 my-6'>
        <Btn
          className='hover:opacity-80'
          type='primary'
          block
          size={'large'}
          loading={loading}
          onClick={handleSubmit}
        >
          提交
        </Btn>
      </div>
    </form>
  )
}

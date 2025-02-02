'use client'

import useConversation from '@/app/hooks/useConversation'
import { fetcher } from '@/app/libs/fetcher'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { useState } from 'react'
import { HiPaperAirplane, HiPhoto } from 'react-icons/hi2'
import MessageInput from './MessageInput'
import { CldUploadWidget } from 'next-cloudinary'
import toast from 'react-hot-toast'

const FormSendMessage = () => {
  const { conversationId } = useConversation()
  const [isLoading, setIsLoading] = useState(false)

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      message: ''
    }
  })

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)
    try {
      setValue('message', '', { shouldValidate: true })
      const responseData = await fetcher('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, conversationId })
      })
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (result) => {
    if (result && result.info) {
      setIsLoading(true)

      const image = result.info.secure_url

      try {
        setValue('message', '', { shouldValidate: true })

        const response = await fetcher('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image, conversationId })
        })
        toast.success('Send image successfully')
      } catch (error) {
        console.error('Error sending message:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className='relative p-4 bg-white border-t z-50 flex items-center lg:gap-4 w-full gap-2'>
      <CldUploadWidget uploadPreset='chatapp_nextjs' onSuccess={handleUpload}>
        {({ open }) => (
          <button onClick={() => open()}>
            <HiPhoto size={30} className='text-green-500' />
          </button>
        )}
      </CldUploadWidget>
      <form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-2 lg:gap-4 w-full'>
        <MessageInput
          id='message'
          errors={errors}
          register={register}
          required
          placeholder='Write a message'
        />
        <button
          type='submit'
          className='rounded-full p-2 bg-green-500 cursor-pointer hover:bg-green-600 transition'>
          <HiPaperAirplane size={18} className='text-white' />
        </button>
      </form>
    </div>
  )
}

export default FormSendMessage

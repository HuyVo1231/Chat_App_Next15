'use client'

import Button from '@/app/components/button/Button'
import Input from '@/app/components/input/Input'
import Select from '@/app/components/input/Select'
import Modal from '@/app/components/modal/Modal'
import { fetcher } from '@/app/libs/fetcher'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface GroupChatModalProps {
  isOpen?: boolean
  onClose: () => void
  users: User[]
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ isOpen, onClose, users }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      members: []
    }
  })
  const members = watch('members')

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (data.members.length < 2) {
      toast.error('You need to add at least 2 members')
      return
    }
    setIsLoading(true)

    const requestData = {
      ...data,
      isGroup: true
    }

    try {
      const res = await fetcher('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
      toast.success('Create group chat successfully')
      router.refresh()
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12'>
            <div className='text-base leading-7 font-semibold text-gray-900'>
              Create a group chat
            </div>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Create a chat with more than 2 people.
            </p>
            <div className='mt-10 flex flex-col gap-y-8'>
              <Input
                register={register}
                id='name'
                label='Name'
                disabled={isLoading}
                required={{ value: true, message: 'Name is required' }}
                errors={errors}
              />
              <Select
                disabled={isLoading}
                label='Members'
                value={members}
                options={users.map((user) => ({ value: user.id, label: user.name }))}
                onChange={(value) => setValue('members', value, { shouldValidate: true })}
              />
            </div>
          </div>
        </div>

        <div className='flex justify-end items-center mt-6'>
          <Button disabled={isLoading} type='button' secondary onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading} type='submit'>
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default GroupChatModal

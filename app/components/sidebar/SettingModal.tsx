'use client'
import { User } from '@prisma/client'
import Modal from '../modal/Modal'
import { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { fetcher } from '@/app/libs/fetcher'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { CldUploadWidget } from 'next-cloudinary'
import { HiPhoto } from 'react-icons/hi2'
import Input from '../input/Input'
import Button from '../button/Button'
interface SettingModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User
}

const SettingModal: React.FC<SettingModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [isLoading, setIsLoading] = useState(false)

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  })

  const image = watch('image')

  const handleUpload = async (result) => {
    if (result && result.info) {
      const uploadedImageUrl = result.info.secure_url
      setValue('image', uploadedImageUrl, { shouldValidate: true })
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)
    if (data.name === currentUser.name && data.image === currentUser.image) {
      return
    }
    try {
      setValue('image', '', { shouldValidate: true })
      await fetcher('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      toast.success('Settings updated successfully')
    } catch (error) {
      console.error('ERROR_SETTINGS:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-4'>
          <div className='border-b pb-4 w-full sm:text-left text-center'>
            <h2 className='text-base font-semibold text-gray-900 leading-7'>Profile</h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>Edit your infomation.</p>
          </div>

          <div className='flex flex-col items-center justify-center gap-1'>
            <div className='relative inline-block rounded-full overflow-hidden w-20 h-20 sm:w-24 sm:h-24'>
              <Image
                alt='Avatar'
                src={image || currentUser?.image || '/images/placeholder.jpg'}
                fill
              />
            </div>
            <CldUploadWidget uploadPreset='chatapp_nextjs' onSuccess={handleUpload}>
              {({ open }) => (
                <button onClick={() => open()} type='button'>
                  <HiPhoto size={30} className='text-green-500' />
                </button>
              )}
            </CldUploadWidget>
          </div>

          <div className='flex flex-col'>
            <Input
              disabled={isLoading}
              label='Name'
              id='name'
              errors={errors}
              required={{ value: true, message: 'Name is required' }}
              register={register}
            />
          </div>
          <div className='mt-5 sm:mt-4 flex flex-row-reverse'>
            <Button disabled={isLoading} type='submit'>
              Save
            </Button>
            <Button disabled={isLoading} type='button' onClick={onClose} secondary>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default SettingModal

'use client'

import Button from '@/app/components/button/Button'
import Modal from '@/app/components/modal/Modal'
import useConversation from '@/app/hooks/useConversation'
import { fetcher } from '@/app/libs/fetcher'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { FiAlertTriangle } from 'react-icons/fi'
interface ConfirmModalProps {
  isOpen?: boolean
  onClose: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter()
  const { conversationId } = useConversation()
  const [isLoading, setIsLoading] = useState(false)

  const onDelete = useCallback(async () => {
    setIsLoading(true)

    try {
      await fetcher(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      toast.success('Successfully deleted conversation')
      onClose()
      router.push('/conversations')
      router.refresh()
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }, [conversationId, router, onClose])
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='sm:flex sm:items-start'>
        <div className='flex items-center justify-center rounded-full bg-red-100 w-12 h-12 flex-shrink-0 sm:w-10 sm:h-10 mx-auto'>
          <FiAlertTriangle size={24} className='text-red-600' />
        </div>
        <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
          <h3 className='text-gray-900 font-bold text-base leading-6'>Delete Conversation</h3>
          <div className='mt-2'>
            <p className='text-sm text-gray-500'>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <div className='mt-5 sm:mt-4 flex flex-row-reverse'>
        <Button disabled={isLoading} danger onClick={onDelete}>
          Delete
        </Button>
        <Button disabled={isLoading} secondary onClick={onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmModal

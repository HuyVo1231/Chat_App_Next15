'use client'

import Avatar from '@/app/components/avatar/Avatar'
import { fetcher } from '@/app/libs/fetcher'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'

interface UserBoxProps {
  user: User | null
}

const UserBox: React.FC<UserBoxProps> = ({ user }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(async () => {
    setIsLoading(true)

    try {
      const res = await fetcher('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user?.id })
      })
      if (res?.id) {
        router.push(`/conversations/${res.id}`)
      } else {
        toast.error('Không tìm thấy cuộc trò chuyện.')
      }
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }, [router, user])

  return (
    <div
      onClick={handleClick}
      className='w-full flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100
        rounded-lg transition cursor-pointer'>
      <Avatar user={user} />
      <div className='min-w-0 flex-1'>
        <div className='flex justify-between items-center mb-1'>
          <p className='text-sm font-medium text-gray-900'>{user?.name}</p>
        </div>
      </div>
    </div>
  )
}

export default UserBox

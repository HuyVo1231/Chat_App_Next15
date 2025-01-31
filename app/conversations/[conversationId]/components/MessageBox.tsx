'use client'

import clsx from 'clsx'
import { format } from 'date-fns'
import { useSession } from 'next-auth/react'
import { FullMessageType } from '@/app/types'
import Avatar from '@/app/components/avatar/Avatar'
import Image from 'next/image'
import { useState } from 'react'
import ImageModal from './ImageModal'

interface MessageBoxProps {
  isLast?: boolean
  message: FullMessageType
}

const MessageBox: React.FC<MessageBoxProps> = ({ isLast, message }) => {
  const { data: session, status } = useSession()
  const [imageModalOpen, setImageModalOpen] = useState(false)

  const yourMessage = session?.user?.email === message.sender.email

  const seenUsersWithOutCurrentUser = (
    message?.seen?.filter((user) => user.email !== message.sender.email) || []
  )
    .map((user) => user.name)
    .join(',')

  const seenUsersText = seenUsersWithOutCurrentUser ? `${seenUsersWithOutCurrentUser} đã xem` : ''

  // Wait for the session to be ready before displaying the message (Fix flickering Nextjs)
  if (status === 'loading') {
    return (
      <div className='flex gap-3 p-4'>
        <div className='w-10 h-10 bg-gray-300 rounded-full animate-pulse'></div>
        <div className='flex-1 flex flex-col gap-2'>
          <div className='h-4 w-24 bg-gray-300 rounded-md animate-pulse'></div>
          <div className='h-6 w-48 bg-gray-300 rounded-full animate-pulse'></div>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(`flex gap-3 p-4`, yourMessage && 'justify-end')}>
      <div className={clsx(yourMessage && 'order-2')}>
        <Avatar user={message.sender} />
      </div>
      <div className={clsx(`flex flex-col gap-2`, yourMessage && 'items-end')}>
        <div className='flex items-center gap-1'>
          <div className='text-md text-gray-600'>{message.sender.name}</div>
          <div className='mt-[2px] text-xs text-gray-400'>
            {format(new Date(message.createdAt), 'p')}
          </div>
        </div>
        <div
          className={clsx(
            `text-md overflow-hidden`,
            yourMessage ? 'bg-green-500 text-white' : 'bg-gray-100',
            message.image ? 'rounded-md p-0' : 'rounded-full py-2 px-3'
          )}>
          <ImageModal
            src={message.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
          {message?.image ? (
            <Image
              onClick={() => setImageModalOpen(true)}
              alt='Image'
              height={250}
              width={250}
              src={message.image}
              className='object-cover cursor-pointer hover:scale-110 transition translate'
            />
          ) : (
            message.body
          )}
        </div>
        {isLast && yourMessage && seenUsersText && (
          <div className='text-xs font-medium text-gray-400'>{seenUsersText}</div>
        )}
      </div>
    </div>
  )
}

export default MessageBox

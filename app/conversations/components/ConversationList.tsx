'use client'

import clsx from 'clsx'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { FullConversationType } from '@/app/types'
import useConversation from '@/app/hooks/useConversation'
import { MdOutlineGroupAdd } from 'react-icons/md'
import ConversationBox from './ConversationBox'

interface ConversationListProps {
  initialItems: FullConversationType[]
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems }) => {
  const [conversations, setConversations] = useState(initialItems)

  const route = useRouter()
  const { conversationId, isOpen } = useConversation()
  return (
    <div
      className={clsx(
        'fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-x-gray-200',
        isOpen ? 'hidden' : 'block w-full left-0'
      )}>
      <div className='px-5'>
        <div className='flex justify-between mb-4 pt-4'>
          <div className='text-2xl font-bold text-neutral-800'>Messages</div>
          <div className='rounded-full p-1 text-gray-600 cursor-pointer hover:opacity-75 transition'>
            <MdOutlineGroupAdd size={20} />
          </div>
        </div>
        {conversations.map((conversation) => (
          <ConversationBox
            key={conversation.id}
            conversation={conversation}
            selected={conversationId === conversation.id}
          />
        ))}
      </div>
    </div>
  )
}

export default ConversationList

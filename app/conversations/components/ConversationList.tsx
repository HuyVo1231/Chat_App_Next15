'use client'

import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FullConversationType } from '@/app/types'
import { User } from '@prisma/client'
import { MdOutlineGroupAdd } from 'react-icons/md'
import useConversation from '@/app/hooks/useConversation'
import ConversationBox from './ConversationBox'
import GroupChatModal from './GroupChatModal'
import { pusherClient } from '@/app/libs/pusher'

import find from 'lodash/find'
interface ConversationListProps {
  initialItems: FullConversationType[]
  users: User[]
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems, users }) => {
  const session = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState(initialItems)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const route = useRouter()
  const { conversationId, isOpen } = useConversation()

  useEffect(() => {
    if (!session?.data?.user?.email) {
      return
    }

    const getConversation = (conversation: FullConversationType) => {
      setConversations((prevConversations) => {
        if (find(prevConversations, { id: conversation.id })) {
          return prevConversations
        }

        return [conversation, ...prevConversations]
      })
    }

    const updateConversation = (updateConversation: FullConversationType) => {
      setConversations((prevConversations) =>
        prevConversations.map((currentConversation) => {
          if (currentConversation.id === updateConversation.id) {
            return {
              ...currentConversation,
              messages: updateConversation.messages
            }
          }
          return currentConversation
        })
      )
    }
    const deleteConversation = (deleteConversation: FullConversationType) => {
      setConversations((prevConversations) =>
        prevConversations.filter((conversation) => conversation.id !== deleteConversation.id)
      )

      if (conversationId === deleteConversation.id) {
        router.push('/conversations')
      }
    }

    pusherClient.subscribe(session.data.user.email)
    pusherClient.bind('newConversation', getConversation)
    pusherClient.bind('updateConversation', updateConversation)
    pusherClient.bind('deleteConversation', deleteConversation)

    return () => {
      pusherClient.unsubscribe(session.data.user.email)
      pusherClient.unbind('newConversation', getConversation)
      pusherClient.unbind('updateConversation', updateConversation)
      pusherClient.unbind('deleteConversation', deleteConversation)
    }
  }, [session?.data?.user?.email, conversationId, router])

  return (
    <>
      <GroupChatModal users={users} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div
        className={clsx(
          'fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 lg:w-80 lg:block overflow-y-auto border-r border-x-gray-200',
          isOpen ? 'hidden' : 'block w-full left-0'
        )}>
        <div className='px-5'>
          <div className='flex justify-between mb-4 pt-4'>
            <div className='text-2xl font-bold text-neutral-800'>Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className='rounded-full p-1 text-gray-600 cursor-pointer hover:opacity-75 transition'>
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
    </>
  )
}

export default ConversationList

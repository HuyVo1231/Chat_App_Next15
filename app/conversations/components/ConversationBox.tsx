'use client'
import Avatar from '@/app/components/avatar/Avatar'
import useOtherUser from '@/app/hooks/useOtherUser'
import { FullConversationType } from '@/app/types'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { format } from 'date-fns'
import AvatarGroup from '@/app/components/avatar/AvatarGroup'
interface ConversationBoxProps {
  conversation: FullConversationType
  selected?: boolean
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ conversation, selected }) => {
  const otherUser = useOtherUser(conversation)
  const session = useSession()
  const router = useRouter()

  // Navigates to the conversation's detailed view when the box ic clicked.
  const handleClick = useCallback(() => {
    router.push(`/conversations/${conversation.id}`)
  }, [conversation.id, router])

  // Extracts the last message from the conversation.
  const lastMessage = useMemo(() => {
    const messages = conversation.messages || []

    return messages[messages.length - 1]
  }, [conversation.messages])

  // Retrives the current user's email from the session data.
  const userEmail = useMemo(() => {
    return session?.data?.user?.email
  }, [session?.data?.user?.email])

  // Check if current user has seen the last message.
  const hasSeen = useMemo(() => {
    if (!userEmail || !lastMessage) {
      return false
    }

    const seenArray = lastMessage?.seen || []

    return seenArray.some((user) => user.email === userEmail)
  }, [lastMessage, userEmail])

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image'
    }

    if (lastMessage?.body) {
      return lastMessage.body
    }

    return 'Started a conversation'
  }, [lastMessage])

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `w-full relative flex items-center space-x-3 hover:bg-neutral-100 rounded-lg p-3 transition cursor-pointer`,
        selected ? 'bg-slate-100' : 'bg-white'
      )}>
      {conversation.isGroup ? (
        <AvatarGroup users={conversation.users} />
      ) : (
        <Avatar user={otherUser} />
      )}

      <div className='min-w-0 flex-1'>
        <div className='flex justify-between items-center mb-1'>
          <p className='text-md font-medium text-gray-900'>
            {conversation?.name || otherUser?.name}{' '}
          </p>
          {lastMessage?.createdAt && (
            <p className='text-xs text-gray-400'>{format(new Date(lastMessage.createdAt), 'p')}</p>
          )}
        </div>
        <p
          className={clsx(
            `truncate text-sm`,
            hasSeen ? 'text-gray-500' : 'text-black font-medium'
          )}>
          {lastMessageText}
        </p>
      </div>
    </div>
  )
}

export default ConversationBox

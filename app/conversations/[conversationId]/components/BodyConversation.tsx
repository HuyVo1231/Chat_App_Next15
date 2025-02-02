'use client'

import useConversation from '@/app/hooks/useConversation'
import { FullMessageType } from '@/app/types'
import { useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox'
import { useSession } from 'next-auth/react'
import { fetcher } from '@/app/libs/fetcher'
import { pusherClient } from '@/app/libs/pusher'
import find from 'lodash/find'

interface BodyConversationProps {
  initialMessages: FullMessageType[]
}
const BodyConversation: React.FC<BodyConversationProps> = ({ initialMessages }) => {
  const session = useSession()
  const bottomRef = useRef<HTMLDivElement>(null)
  const { conversationId } = useConversation()
  const [messages, setMessages] = useState(initialMessages)

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Seen message
  useEffect(() => {
    const currentUserEmail = session?.data?.user?.email
    const lastMessage = messages[messages.length - 1]

    // Kiểm tra xem người dùng đã xem tin nhắn này chưa
    if (!lastMessage || lastMessage.seen.some((user) => user.email === currentUserEmail)) {
      return
    }

    const markAsSeen = async () => {
      try {
        await fetcher(`/api/conversations/${conversationId}/seen`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId })
        })
      } catch (error) {
        console.error(error)
      }
    }
    markAsSeen()
  }, [conversationId, messages])

  // Realtime messages
  useEffect(() => {
    pusherClient.subscribe(conversationId)

    const getNewMessage = (message: FullMessageType) => {
      setMessages((prevMessages) => {
        if (find(prevMessages, { id: message.id })) {
          return prevMessages
        }
        return [...prevMessages, message]
      })
    }

    const updateMessage = (newMessage: FullMessageType) => {
      setMessages((prevMessage) =>
        prevMessage.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage
          }
          return currentMessage
        })
      )
    }

    pusherClient.bind('newMessage', getNewMessage)
    pusherClient.bind('updateMessage', updateMessage)

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('newMessage', getNewMessage)
      pusherClient.unbind('updateMessage', updateMessage)
    }
  }, [conversationId])

  return (
    <div className='flex-1 overflow-y-auto'>
      {messages.map((message, index) => (
        <MessageBox key={index} isLast={index === messages.length - 1} message={message} />
      ))}
      <div ref={bottomRef} className='pt-24'></div>
    </div>
  )
}

export default BodyConversation

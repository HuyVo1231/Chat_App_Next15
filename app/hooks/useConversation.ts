import { useParams } from 'next/navigation'
import { useMemo } from 'react'

const useConversation = () => {
  const params = useParams()

  const conversationId = useMemo(() => {
    if (!params?.conversationId) {
      return ''
    }
    return params.conversation as string
  }, [params?.conversationId])

  const isOpen = useMemo(() => !!params?.conversationId, [conversationId])

  return useMemo(
    () => ({
      isOpen,
      conversationId
    }),
    [isOpen, conversationId]
  )
}

export default useConversation

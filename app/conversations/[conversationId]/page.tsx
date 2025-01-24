import getConversationByID from '@/app/actions/conversations/getConversationById'
import EmptyState from '@/app/components/emptystate/EmptyState'
import HeaderConversation from './components/HeaderConversation'
import BodyConversation from './components/BodyConversation'
import FormSendMessage from './components/FormSendMessage'

interface IParams {
  conversationId: string
}

const ConversationId = async ({ params }: { params: IParams }) => {
  const { conversationId } = await params
  const conversation = await getConversationByID(conversationId)
  const messages = conversation?.messages

  if (!conversation) {
    return (
      <div className='lg:pl-80 h-full'>
        <div className='h-full flex flex-col'>
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className='lg:pl-80 h-full'>
      <div className='h-full flex flex-col'>
        <HeaderConversation conversation={conversation} />
        <BodyConversation initialMessages={messages} />
        <FormSendMessage />
      </div>
    </div>
  )
}

export default ConversationId

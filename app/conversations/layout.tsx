import getConversations from '../actions/conversations/getConversations'
import getUsers from '../actions/users/getUsers'
import { Sidebar } from '../components/sidebar/Sidebar'
import ConversationList from './components/ConversationList'

export default async function ConversationsLayout({ children }: { children: React.ReactNode }) {
  const conversations = await getConversations()
  const users = await getUsers()
  return (
    <Sidebar>
      <div className='h-full'>
        <ConversationList users={users} initialItems={conversations} />
        {children}
      </div>
    </Sidebar>
  )
}

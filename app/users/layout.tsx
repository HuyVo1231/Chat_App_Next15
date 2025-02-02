import getUsers from '../actions/users/getUsers'
import ActiveStatus from '../components/ActiveStatus'
import { Sidebar } from '../components/sidebar/Sidebar'
import UserList from './components/UserList'

export default async function UsersLayout({ children }: { children: React.ReactNode }) {
  const users = await getUsers()

  return (
    <Sidebar>
      <ActiveStatus />
      <div className='h-full'>
        <UserList users={users} />
        {children}
      </div>
    </Sidebar>
  )
}

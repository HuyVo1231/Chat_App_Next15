import getUsers from '../actions/users/getUsers'
import EmptyState from '../components/emptystate/EmptyState'

const Users = () => {
  return (
    <div className='hidden lg:block lg:pl-80 h-full'>
      <EmptyState />
    </div>
  )
}

export default Users

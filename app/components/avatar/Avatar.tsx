'use client'

import Image from 'next/image'
import { User } from '@prisma/client'
import activeUsersStore from '@/app/zustand/activeUsers'

interface AvatarProps {
  user: User | null
}

const Avatar: React.FC<AvatarProps> = ({ user }) => {
  const { listActiveUser } = activeUsersStore()
  const isActive = listActiveUser.indexOf(user?.email) !== -1
  return (
    <div className='relative'>
      <div className='relative inline-block rounded-full overflow-hidden h-9 w-9 md:h-11 md:w-11'>
        <Image alt='Avatar' src={user?.image || '/images/placeholder.jpg'} fill />
      </div>
      {isActive && (
        <div className='absolute top-0 right-0 md:h-3 md:w-3 h-2 w-2 rounded-full ring-2 ring-white bg-green-500'></div>
      )}
    </div>
  )
}

export default Avatar

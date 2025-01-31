'use client'

import React from 'react'
import { User } from '@prisma/client'
import clsx from 'clsx'
import Image from 'next/image'

interface AvatarGroupProps {
  users: User[] | null
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users }) => {
  const displayedUsers = users?.slice(0, 3) || []

  const positonAvatar = {
    0: 'top-0 left-[12px]',
    1: 'bottom-0',
    2: 'bottom-0 right-0'
  }

  return (
    <div className='relative w-11 h-11'>
      {displayedUsers.map((user, index) => (
        <div
          key={index}
          className={clsx(
            `absolute rounded-full overflow-hidden h-[20px] w-[20px]`,
            positonAvatar[index]
          )}>
          <Image src={user.image} alt='avatar image' fill />
        </div>
      ))}
    </div>
  )
}

export default AvatarGroup

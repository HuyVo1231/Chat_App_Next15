'use client'

import Avatar from '@/app/components/avatar/Avatar'
import useOtherUser from '@/app/hooks/useOtherUser'
import { FullConversationType } from '@/app/types'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { HiChevronLeft } from 'react-icons/hi'
import { HiEllipsisHorizontal } from 'react-icons/hi2'
import ProfileDrawer from './ProfileDrawer'
import AvatarGroup from '@/app/components/avatar/AvatarGroup'
import activeUsersStore from '@/app/zustand/activeUsers'

interface HeaderConversationProps {
  conversation: FullConversationType
}

const Header: React.FC<HeaderConversationProps> = ({ conversation }) => {
  const otherUser = useOtherUser(conversation)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { listActiveUser } = activeUsersStore()
  const isActive = listActiveUser.indexOf(otherUser?.email) !== -1

  const statusText = useMemo(() => {
    if (conversation.isGroup) {
      return `${conversation.users.length} members`
    }
    return isActive ? 'Active' : 'Offline'
  }, [conversation, isActive])

  return (
    <>
      {/* Profile Drawer */}
      <ProfileDrawer data={conversation} isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Header */}
      <div className='bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm'>
        <div className='flex gap-3 items-center'>
          <Link
            className='lg:hidden block text-green-500 hover:text-green-600 transition cursor-pointer'
            href='/conversations'>
            <HiChevronLeft size={32} />
          </Link>
          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (
            <Avatar user={otherUser} />
          )}
          <div className='flex flex-col'>
            <div>{conversation?.name || otherUser?.name}</div>
            <div className='text-sm font-normal text-neutral-500'>{statusText}</div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className='text-green-500 cursor-pointer hover:text-green-600 transition'
        />
      </div>
    </>
  )
}

export default Header

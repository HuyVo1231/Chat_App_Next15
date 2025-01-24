'use client'

import { Dialog, Transition, TransitionChild } from '@headlessui/react'
import { format } from 'date-fns'
import { FullConversationType } from '@/app/types'
import useOtherUser from '@/app/hooks/useOtherUser'
import { IoMdClose, IoMdTrash } from 'react-icons/io'
import Avatar from '@/app/components/avatar/Avatar'
import { useMemo, useState } from 'react'
import ConfirmModal from './ConfirmModal'

interface ProfileDrawerProps {
  data: Omit<FullConversationType, 'messages'>
  isOpen: boolean
  onClose: () => void
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ data, isOpen, onClose }) => {
  const otherUser = useOtherUser(data)
  const [confirmModal, setConfirmModal] = useState(false)

  const createdDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), 'dd/MM/yyyy')
  }, [otherUser.createdAt])

  const title = useMemo(() => {
    return data.name || otherUser.name
  }, [data.name, otherUser.name])

  const isGroup = useMemo(() => {
    if (data.isGroup) return `${data.users.length} members`
    return 'Active'
  }, [data])

  return (
    <>
      {/* Modal Delete Button */}
      <ConfirmModal isOpen={confirmModal} onClose={() => setConfirmModal(false)}></ConfirmModal>

      {/* Profile*/}
      <Transition show={isOpen}>
        <Dialog className='relative z-50' onClose={onClose}>
          {/* Overlay */}
          <div onClick={onClose} className='fixed inset-0 bg-black bg-opacity-50' />

          <TransitionChild
            enter='ease-out duration-500'
            enterFrom='opacity-0 translate-x-full'
            enterTo='opacity-100 translate-x-0'
            leave='ease-in duration-300'
            leaveFrom='opacity-100 translate-x-0'
            leaveTo='opacity-0 translate-x-full'>
            {/* Drawer Panel */}
            <div className='fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl'>
              {/* Close Button */}
              <div className='flex justify-end p-4 border-b'>
                <button
                  onClick={onClose}
                  className='text-gray-500 hover:text-green-500 transition'
                  aria-label='Close'>
                  <IoMdClose size={24} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className='relative mt-6 px-4 flex-1 sm:px-6'>
                <div className='flex flex-col items-center'>
                  <div className='mb-2'>
                    <Avatar user={otherUser} />
                  </div>
                  <div className='font-medium'>{title}</div>
                  <div className='text-sm text-gray-500'>{isGroup}</div>
                  <div className='flex gap-10 my-8'>
                    <div
                      onClick={() => {
                        setConfirmModal(true)
                      }}
                      className='flex flex-col gap-3 items-center cursor-pointer hover:text-green-500 transition'>
                      <div className='w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center'>
                        <IoMdTrash size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Details Conversation */}
                  <div className='w-full pb-5 pt-5 sm:px-0 sm:pt-0'>
                    <dl className='space-y-6 px-6'>
                      {!data.isGroup && (
                        <div>
                          <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                            Email
                          </dt>
                          <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                            {otherUser.email}
                          </dd>
                        </div>
                      )}
                      {!data.isGroup && (
                        <>
                          <hr />
                          <div>
                            <dt className='text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0'>
                              Joined
                            </dt>
                            <dd className='mt-1 text-sm text-gray-900 sm:col-span-2'>
                              <time dateTime={createdDate}>{createdDate}</time>
                            </dd>
                          </div>
                        </>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  )
}

export default ProfileDrawer

'use client'

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { Fragment } from 'react'
import { ClipLoader } from 'react-spinners'

const Loading = () => {
  return (
    <Transition show as={Fragment}>
      <Dialog className='relative z-50' onClose={() => {}}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-500'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-300'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'>
          <div className='fixed inset-0 bg-gray-100 bg-opacity-50 transition-opacity' />
        </TransitionChild>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full justify-center items-center p-4 text-center'>
            <DialogPanel>
              <ClipLoader size={40} color='#0284c7' />
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Loading

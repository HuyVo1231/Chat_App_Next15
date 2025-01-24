'use client'

import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

interface MessageInputProps {
  id: string
  type?: string
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  placeholder: string
  required?: boolean
}

const MessageInput: React.FC<MessageInputProps> = ({
  id,
  placeholder,
  type,
  required,
  register
}) => {
  return (
    <div className='relative w-full'>
      <input
        type={type}
        placeholder={placeholder}
        {...register(id, { required: required })}
        className='w-full rounded-full text-black font-normal bg-neutral-100 py-2 px-4 border-none  focus:ring-gray-300 focus:border-transparent'
      />
    </div>
  )
}

export default MessageInput

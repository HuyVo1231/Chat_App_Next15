import clsx from 'clsx'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

interface InputProps {
  label: string
  id: string
  type?: string
  required?: { value: boolean; message: string }
  minLength?: { value: number; message: string }
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  disabled?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type = 'text',
  required,
  minLength,
  register,
  errors,
  disabled
}) => {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium leading-6 text-gray-900'>
        {label}
      </label>
      <div className='mt-2'>
        <input
          type={type}
          id={id}
          disabled={disabled}
          autoComplete={id}
          {...register(id, { required, minLength })}
          className={clsx(
            `form-input
            block
            w-full
            rounded-md
            border-0
            text-gray-900
            py-1.5
            shadow-sm
            ring-1
            ring-inset
            ring-gray-300
            placeholder:text-gray-400
            focus:ring-2
            focus:ring-inset
            focus:ring-green-600
            sm:text-sm
            sm:leading-6`,
            errors[id] && 'ring-rose-500 border-rose-500',
            disabled && 'opacity-50 cursor-default'
          )}
        />
      </div>
      {errors[id] && (
        <p className='mt-1 font-medium text-rose-500'>
          {(errors[id]?.message as string) || 'This field is required'}
        </p>
      )}
    </div>
  )
}

export default Input

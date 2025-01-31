'use client'
import ReactSelect from 'react-select'

type SelectValueProps = {
  value: string
  label: string
}

interface SelectProps {
  disabled?: boolean
  label: string
  value?: SelectValueProps[]
  onChange: (value: SelectValueProps[] | null) => void
  options?: SelectValueProps[]
}

const Select: React.FC<SelectProps> = ({ label, value, options, onChange, disabled }) => {
  return (
    <div className='z-[100]'>
      <label className='block text-sm font-medium leading-6 text-gray-900'>{label}</label>
      <div className='mt-2'>
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={onChange}
          isMulti={true}
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 99999
            })
          }}
          classNames={{
            control: () => 'text-sm'
          }}
        />
      </div>
    </div>
  )
}

export default Select

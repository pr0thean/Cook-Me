'use client'

import { CheckIcon } from '@heroicons/react/20/solid'
import { useId } from 'react'
import ReactSelect, { components, StylesConfig } from 'react-select'

export type SelectOption = {
  value: string
  label: string
}

type Props = {
  options: SelectOption[]
  label: string
  handleOnChange: (value: SelectOption | null) => void
  value: SelectOption | null
}

export const Select = ({ options, label, handleOnChange, value }: Props) => {
  const selectStyles: StylesConfig<SelectOption, false> = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'hsl(var(--color-blue-gray-dark))',
      borderColor: state.isFocused ? 'hsl(var(--color-white))' : 'hsl(var(--color-blue-gray))',
      '&:hover': {
        borderColor: 'hsl(var(--color-white))',
      },
      boxShadow: 'none',
      cursor: 'text',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'hsl(var(--color-blue-gray-dark))',
      border: '1px solid hsl(var(--color-blue-gray))',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? 'hsl(var(--color-gray))'
        : 'hsl(var(--color-blue-gray-dark))',
      '&:hover': {
        backgroundColor: 'hsl(var(--color-gray))',
      },
      color: state.isSelected ? 'hsl(var(--color-orange))' : 'hsl(var(--color-white))',
      cursor: 'pointer',
      fontWeight: state.isSelected ? '600' : 'normal',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'hsl(var(--color-white))',
    }),
    input: (provided) => ({
      ...provided,
      color: 'hsl(var(--color-white))',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'hsl(var(--color-blue-gray))',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: 'hsl(var(--color-blue-gray))',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'hsl(var(--color-blue-gray))',
      cursor: 'pointer',
      '&:hover': {
        color: 'hsl(var(--color-white))',
      },
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: 'hsl(var(--color-blue-gray))',
      cursor: 'pointer',
      '&:hover': {
        color: 'hsl(var(--color-white))',
      },
    }),
  }

  return (
    <div className="w-full space-y-1">
      <label className="text-sm text-white" htmlFor={label}>
        {label}
      </label>

      <ReactSelect<SelectOption, false>
        name={label}
        inputId={label}
        instanceId={useId()}
        options={options}
        // openMenuOnFocus
        blurInputOnSelect
        isClearable
        onChange={handleOnChange}
        defaultValue={value}
        components={{
          Input: (props) => <components.Input {...props} aria-activedescendant={undefined} />,
          Option: (props) => (
            <components.Option {...props}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '4px',
                }}
              >
                {props.label}
                {props.isSelected && <CheckIcon width={24} className="text-orange" />}
              </div>
            </components.Option>
          ),
        }}
        styles={selectStyles}
      />
    </div>
  )
}

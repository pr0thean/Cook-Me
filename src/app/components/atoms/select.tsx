'use client'

import { useId } from 'react'
import ReactSelect, { components } from 'react-select'

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
        }}
        styles={{
          control: (provided) => ({
            ...provided,
            width: '100%',
            backgroundColor: '#373A40', // TODO refactor colors
            borderColor: '#686D76',
            // borderColor: state.isFocused ? '#EDEDED' : '#686D76', // TODO refactor colors
            '&:hover': {
              borderColor: '#EDEDED', // TODO refactor colors
            },
            color: 'white',
            cursor: 'text',
            boxShadow: 'none',
          }),
          placeholder: (provided) => ({
            ...provided,
            color: '#686D76',
          }),
          singleValue: (provided) => ({
            ...provided,
            color: 'white',
          }),
          menu: (provided) => ({
            ...provided,
            width: '100%',
            backgroundColor: '#373A40',
            borderColor: '#686D76',
            borderStyle: 'solid',
            borderWidth: 1,
          }),
          option: (provided, state) => ({
            ...provided,
            color: 'white',
            backgroundColor: state.isSelected || state.isFocused ? '#747474' : '#373A40',
            fontWeight: state.isSelected ? 'bold' : 'normal',
            cursor: 'pointer',
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: '#686D76',
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            color: '#686D76',
            cursor: 'pointer',
            '&:hover': {
              color: '#EDEDED',
            },
          }),
          clearIndicator: (provided) => ({
            ...provided,
            color: '#686D76',
            cursor: 'pointer',
            '&:hover': {
              color: '#EDEDED',
            },
          }),
        }}
      />
    </div>
  )
}

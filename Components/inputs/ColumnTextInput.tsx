import React from 'react'
import { capitalizeFirstLetter } from '../../Utils/capitalizeFirstLettersOfString';

interface ITextInputProps {
    label: string;
    name?: string;
    value: string | string[] | number;
    onInputChange: (e: any) => void;
    placeHolder?: string;
    type?: string;
}

const ColumnTextInput = ({label, name, value, onInputChange, placeHolder, type='text'}: ITextInputProps) => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={label} className='font-semibold mb-3 text-sm'>{capitalizeFirstLetter(label)}:</label>
      <input
        type={type}
        placeholder={placeHolder || ''}
        className="text-base text-gray-700 bg-gray-100 px-3 py-2"
        name={name || label.toLowerCase()}
        value={value || ''}
        onChange={onInputChange}
      />
    </div>
  )
}

export default ColumnTextInput
import React from 'react'
import { capitalizeFirstLetter } from '../../Utils/capitalizeFirstLettersOfString';

interface ITextInputProps {
    label: string;
    value: string;
    onInputChange: (e: any) => void;
    placeHolder?: string;
}

const TextInput = ({label, value, onInputChange, placeHolder}: ITextInputProps) => {
  return (
    <div className="flex flex-col mb-4 px-3 py-2">
      <label htmlFor={label} className='font-semibold mb-3 text-sm'>{capitalizeFirstLetter(label)}:</label>
      <input
        type="text"
        placeholder={placeHolder || ''}
        className="text-base text-gray-700 bg-gray-100 px-3 py-2"
        name={label}
        value={value || ''}
        onChange={(e) => onInputChange(e)}
      />
    </div>
  )
}

export default TextInput
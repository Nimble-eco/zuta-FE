import React from 'react'
import { capitalizeFirstLetter } from '../../Utils/capitalizeFirstLettersOfString';

interface IMyDropDownInputProps {
    label: string;
    name?: string;
    options: any[];
    onSelect: (e: any) => void;
    value?: string;
}

const MyDropDownInput = ({label, name, options, value, onSelect}: IMyDropDownInputProps) => {
  return (
    <div className='flex flex-col mb-4 py-2'>
        <label className='font-semibold mb-3 text-sm'>
            {capitalizeFirstLetter(label)}:
        </label>
        <select name={name ?? label} defaultValue={value}  className='text-gray-500 text-sm bg-gray-100 py-2 px-4' onChange={(e) => onSelect(e)}>
            {
                options?.map((item: any) => (
                    <option 
                        value={item.value || item.name} 
                        key={item.value || item.name}
                        className="mb-3 border-b border-gray-200"
                    >
                        {item.title || item.name}
                    </option>
                ))
            }
        </select>
    </div>
  )
}

export default MyDropDownInput
import React from 'react'
import { capitalizeFirstLetter } from '../../Utils/capitalizeFirstLettersOfString';

interface IMyDropDownInputProps {
    label: string;
    name?: string;
    options: any[];
    onSelect: () => void;
}

const MyDropDownInput = ({label, name, options, onSelect}: IMyDropDownInputProps) => {
  return (
    <div className='flex flex-col mb-4 px-3 py-2'>
        <label className='font-semibold mb-3 text-sm'>
            {capitalizeFirstLetter(label)}:
        </label>
        <select name={name || label} className='text-gray-500 text-sm bg-gray-100 py-2 px-4'>
            {
                options?.map((item: any) => (
                    <option 
                        value={item.value} 
                        key={item.value}
                        className="mb-3 border-b border-gray-200"
                    >
                        {item.title}
                    </option>
                ))
            }
        </select>
    </div>
  )
}

export default MyDropDownInput
import React from 'react'
import { capitalizeFirstLetter } from '../../Utils/capitalizeFirstLettersOfString';

interface IMyDropDownInputProps {
    label: string;
    name?: string;
    options: any[];
    onSelect: (e: any) => void;
    value?: string | number | boolean;
}

const MyDropDownInput = ({label, name, options, value, onSelect}: IMyDropDownInputProps) => {
    console.log({options})
  return (
    <div className='flex flex-col mb-4 w-full'>
        <label className='font-semibold mb-1 text-sm'>
            {capitalizeFirstLetter(label)}:
        </label>
        <select name={name ?? label} className='text-gray-500 text-sm bg-gray-100 py-2 px-4' value={value as string} onChange={(e) => onSelect(e)}>
            <option value={''}>Select an option</option>
            {
                options?.map((item: any, index: number) => (
                    <option 
                        value={item.value ?? item.name} 
                        key={`${item.value ?? item.name} ${index}`}
                        className="mb-3 border-b border-gray-200 py-2"
                    >
                        {capitalizeFirstLetter(item.title || item.name)}
                    </option>
                ))
            }
        </select>
    </div>
  )
}

export default MyDropDownInput
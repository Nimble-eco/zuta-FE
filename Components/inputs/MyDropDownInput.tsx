import { capitalizeFirstLetter } from '../../Utils/capitalizeFirstLettersOfString';

interface IMyDropDownInputProps {
    label: string;
    name?: string;
    options: any[];
    onSelect: (e: any) => void;
    value?: string | number | boolean;
    direction?: string;
}

const MyDropDownInput = ({label, name, options, value, onSelect, direction='col'}: IMyDropDownInputProps) => {
  return (
    <div className={`flex flex-${direction} gap-1 w-full`}>
        <label className='whitespace-nowrap !mb-0'>
            {capitalizeFirstLetter(label)}:
        </label>
        <select name={name ?? label} className='text-gray-500 text-sm bg-gray-100 py-3 px-4 w-full rounded-[20px]' value={value as string} onChange={(e) => onSelect(e)}>
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
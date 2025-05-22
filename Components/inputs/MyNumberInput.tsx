import { capitalizeFirstLetter } from '../../Utils/capitalizeFirstLettersOfString';

interface IMyNumberInputProps {
    label: string;
    name?: string;
    value: number;
    onInputChange: (e: any) => void;
}

const MyNumberInput = ({name, label, value, onInputChange}: IMyNumberInputProps) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={label} className='font-medium text-sm'>{capitalizeFirstLetter(label)}:</label>
      <input
        type="number"
        className="text-base text-gray-700 bg-gray-100 px-3 py-2"
        name={name || label}
        value={value || 0}
        onChange={(e) => onInputChange(e)}
      />
    </div>
  )
}

export default MyNumberInput
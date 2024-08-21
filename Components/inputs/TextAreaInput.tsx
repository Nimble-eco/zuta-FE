import { capitalizeFirstLetter } from "../../Utils/capitalizeFirstLettersOfString";

interface ITextAreaInputProps {
    label: string;
    name?: string;
    value: string | string[];
    onInputChange: (e: any) => void;
    placeHolder?: string;
}

const TextAreaInput = ({label, name, value, onInputChange, placeHolder}: ITextAreaInputProps) => {
  return (
    <div className="flex flex-col mb-4">
      <label htmlFor={label} className='font-semibold mb-3 text-sm'>{capitalizeFirstLetter(label)}:</label>
      <textarea
        placeholder={placeHolder || ''}
        className="text-base text-gray-700 bg-gray-100 px-3 py-2 h-40 outline-none rounded-md"
        name={name ?? label}
        value={value || ''}
        onChange={(e) => onInputChange(e)}
      />
    </div>
  )
}

export default TextAreaInput
import { useRef, useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';

interface ITextInputProps {
    label: string,
    name: string,
    value: string | number,
    type?: string,
    border?: number,
    color?: string,
    mobile_color?: string,
    placeholder?: string,
    handleChange: (e: any) => void
    handleFocus?: () => void;
}

const TextInput = ({label, name, value, type='text', placeholder="", border=1, color='#F3F3F3', mobile_color, handleChange, handleFocus}: ITextInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobileScreen = useMediaQuery({ maxWidth: 767 });

  const [bgColor, setBgColor] = useState<string>(color);

  useEffect(() => {
    if(placeholder && placeholder !== "") inputRef.current?.focus();

    if (mobile_color && isMobileScreen) {
      setBgColor(mobile_color);
    } else {
      setBgColor(color);
    }
    
  }, [color, mobile_color, isMobileScreen]);

  const divStyle = { backgroundColor: bgColor };

  const handleClick = () => {
    inputRef.current?.focus();
  };

    return (
      <div className='relative w-full'>
        <input
          name={name}
          value={value}
          type={type}
          placeholder={placeholder}
          ref={inputRef}
          onChange={(e: any) => handleChange(e)}
          onFocus={handleFocus}
          style={divStyle}
          className={`block px-2.5 pb-4 pt-6 w-full text-sm text-[#1E1E1E] rounded-[20px] border-${border} border-orange-500 appearance-none dark:text-[#1E1E1E] dark:border-orange-500 dark:focus:border-orange-500 ${border === 0 ? "focus:outline-none" : "focus:outline-1 focus:ring-0 focus:border-orange-500 focus:outline-orange-500"}  peer`}
        />
        <label htmlFor={name} onClick={handleClick} className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-orange-500 peer-focus:dark:text-orange-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-5 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
          {label}
        </label>
      </div>
    );
}

export default TextInput
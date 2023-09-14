import { useState, useRef } from 'react'

interface IPasswordProps {
    label: string,
    name: string,
    value: string,
    border?: number,
    page?: string,
    handleChange: (e: any) => void
    handleFocus?: () => void;
}

const Password = ({ label, name, value, border=1, page, handleChange, handleFocus }: IPasswordProps) => {
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
      inputRef.current?.focus();
    };

    return (
        <div className='relative w-full flex flex-row'>
            <input
                name={name}
                value={value}
                type={showPassword ? 'text' : 'password'}
                placeholder=" "
                ref={inputRef}
                onChange={(e: any) => handleChange(e)}
                onFocus={handleFocus}
                className={`block px-2.5 pb-4 pt-6 w-full text-sm text-[#1E1E1E] ${page === 'settings' ? 'bg-white' : 'bg-[#F3F3F3]' } rounded-[20px] border-${border} border-orange-500 appearance-none dark:text-[#1E1E1E] dark:border-orange-500 dark:focus:border-orange-500 focus:outline-1 focus:ring-0 focus:border-orange-500 focus:outline-orange-500 peer`}
            />
            <label htmlFor={name} onClick={handleClick} className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] px-2 peer-focus:px-2 peer-focus:text-orange-500 peer-focus:dark:text-orange-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-5 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">
                {label}
            </label>
            {
                showPassword ?
                <span 
                    className='w-10 absolute right-5 top-[30%] cursor-pointer text-[#1E1E1E] font-semibold'
                    onClick={() => setShowPassword(false)}
                >
                    Hide
                </span> : 
                <span
                    className='w-10 absolute right-5 top-[30%] cursor-pointer text-[#1E1E1E] font-semibold'
                    onClick={() => setShowPassword(true)}
                >
                    Show
                </span>
            }
        </div>
    );
}

export default Password
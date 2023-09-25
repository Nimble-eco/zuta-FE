import { useState } from "react";
import { HiSearch } from "react-icons/hi"

interface IMySearchInputProps {
  searchInputPlaceHolder: string;
  onSearch: (value: string) => void;
  name: string;
  value: string;
}

const MySearchInput = ({name, value, searchInputPlaceHolder, onSearch}: IMySearchInputProps) => {

  return (
    <div className="flex flex-row items-center px-4 py-3 border border-gray-200 rounded-[20px]">
        <input 
            type="text" 
            name={name}
            value={value || ""}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchInputPlaceHolder}
            className="flex-grow focus:outline-none bg-transparent w-[80%] text-sm pl-5 text-gray-600" 
        />
        
        <HiSearch className='text-xl text-gray-500'/>
       
    </div>
  )
}

export default MySearchInput
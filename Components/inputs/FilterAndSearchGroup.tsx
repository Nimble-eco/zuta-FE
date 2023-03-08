import { useState } from "react";
import { HiSearch } from "react-icons/hi";
import { MdOutlineFilterList } from "react-icons/md";

interface IFilterAndSearchGroupProps {
    searchInputPlaceHolder: string;
    onSearch: (input: string) => void;
    onFilterButtonClick: () => void;
}

const FilterAndSearchGroup = ({searchInputPlaceHolder, onSearch, onFilterButtonClick}: IFilterAndSearchGroupProps) => {
    const [searchInput, setSearchInput] = useState<string>('');

    return (
    <div className="flex flex-col md:flex-row border border-gray-200 text-gray-500 items-center">
        <div 
            className="flex flex-row px-4 py-3 border-r border-gray-200 cursor-pointer"
            onClick={onFilterButtonClick}
        >
            <MdOutlineFilterList className="text-xl mr-2" />
            <p className="text-slate-600 my-auto">Filter</p>
        </div>
        <div className="flex flex-row items-center px-4 py-3">
            <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={searchInputPlaceHolder}
                className="flex-grow focus:outline-none bg-transparent w-[80%] text-sm pl-5 text-gray-600" 
            />
            <button 
                type="submit" 
                onClick={() => onSearch(searchInput)}
                className='text-gray-600 text-sm px-4'
            >
                <HiSearch className='text-xl hover:!text-orange-500'/>
            </button>
        </div>
    </div>
  )
}

export default FilterAndSearchGroup
import { useState } from "react";
import { HiSearch } from "react-icons/hi";
import { MdOutlineFilterList } from "react-icons/md";

interface IFilterAndSearchGroupProps {
    searchInputPlaceHolder?: string;
    onSearch: (input: string) => void;
    onFilterButtonClick: () => void;
    isSearching?: boolean;
    search?: boolean;
}

const FilterAndSearchGroup = ({searchInputPlaceHolder, onSearch, onFilterButtonClick, isSearching, search=true}: IFilterAndSearchGroupProps) => {
    const [searchInput, setSearchInput] = useState<string>('');

    return (
    <div className={`flex flex-col md:flex-row border border-gray-200 text-gray-500 lg:items-center relative ${search ? 'w-full lg:min-w-[30rem]' : 'w-fit'}`}>
        <div 
            className="flex flex-row px-4 py-2 border-r border-gray-200 cursor-pointer"
            onClick={onFilterButtonClick}
        >
            <MdOutlineFilterList className="text-xl mr-2" />
            <p className="text-slate-600 my-auto">Filter</p>
        </div>
        {
            search && (
                <div className="flex flex-row py-1 w-full">
                    <input 
                        type="text" 
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder={searchInputPlaceHolder}
                        className="flex-grow focus:outline-none bg-transparent w-full text-sm pl-5 text-gray-600" 
                    />
                    <button 
                        type="submit" 
                        onClick={() => onSearch(searchInput)}
                        className='text-gray-600 text-sm absolute right-4'
                    >
                        {
                            isSearching ? 
                            <p className="text-sm text-orange-500">Searching...</p> : 
                            <HiSearch className='text-xl hover:!text-orange-500'/>
                        }
                    </button>
                </div>
            )
        }
    </div>
  )
}

export default FilterAndSearchGroup
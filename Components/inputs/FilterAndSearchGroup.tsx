import { Filter, Search } from "lucide-react";
import { useState } from "react";

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
    <div className="flex flex-col md:flex-row gap-3 w-full">
        <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search size={18} />
            </div>
            <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch(searchInput)}
                placeholder={searchInputPlaceHolder}
                className="w-full pl-11 pr-24 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" 
            />
            <div className="absolute inset-y-1 right-1 flex items-center">
                <button 
                    onClick={() => onSearch(searchInput)}
                    className="h-full px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors uppercase tracking-widest"
                >
                    {isSearching ? '...' : 'Search'}
                </button>
            </div>
        </div>

        <button 
            onClick={onFilterButtonClick}
            className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors bg-white"
        >
            <Filter size={18} />
            <span>Filter</span>
        </button>
    </div>
    )
}

export default FilterAndSearchGroup
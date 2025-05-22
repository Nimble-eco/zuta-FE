import { MdArrowForward } from "react-icons/md";
import { capitalizeFirstLetter } from "../../Utils/capitalizeFirstLettersOfString";
import { Loader2 } from "lucide-react";
import { FcEmptyTrash } from "react-icons/fc";

interface IMyTableProps {
    headings: string[];
    content: any[];
    onRowButtonClick: (item: any) => void;
    isLoading?: boolean;
}

const MyTable = ({headings, content, onRowButtonClick, isLoading}: IMyTableProps) => {
  return (
    <div className="p-4 min-w-[950px] overflow-scroll">
        {
            isLoading && <div className="flex justify-center items-center pt-10 h-72">
                <Loader2 className='w-20 h-20 text-orange-500 animate-spin' />
            </div>
        }

        {
            !isLoading && (!content || content?.length === 0) && <div className="flex flex-col gap-2 justify-center items-center pt-10 h-72 w-fit lg:w-full px-16 lg:px-0">
                <FcEmptyTrash className='w-28 h-28 ' />
                <p className="font-semibold text-slate-700">No content for this table</p>
            </div>
        }
        
        {
            !isLoading && content?.length ?
            <table className="w-full min-w-fit overflow-x-auto text-base">
                <thead>
                    <tr className="justify-evenly text-sm text-left whitespace-nowrap">
                        {
                            headings?.map((heading: string) => (
                                <th key={heading}>
                                    <p className="mb-3 mx-2">{heading.includes("_") ?
                                        heading.split("_").join(" ").toLocaleUpperCase() : 
                                        heading.toLocaleUpperCase()
                                    }
                                </p>
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody className="mt-10">
                    {
                        content?.map((item, index) => (
                            <tr 
                                key={item.id || index}
                                className="border-b border-gray-200 cursor-pointer justify-evenly whitespace-nowrap"
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    onRowButtonClick(item)
                                }}
                            >
                                {headings.map((heading) => (
                                    <td 
                                        key={`${heading}-${item.id}`}
                                    >
                                        { heading.toLocaleLowerCase().includes('image') ? (
                                            <img 
                                                src={item[heading] as string} 
                                                alt='product image' 
                                                className="w-14 h-14 rounded-full my-2 align-middle object-cover object-center"
                                            />
                                        ) : (
                                            <p className='align-middle my-auto mx-2 py-3'>{capitalizeFirstLetter(item[heading])}</p>
                                        )}
                                    </td>
                                ))}
                                <td>
                                    <MdArrowForward className="text-2xl text-gray-600 cursor-pointer hover:!text-orange-500" onClick={(e: any) => {
                                        e.preventDefault();
                                        onRowButtonClick(item)
                                    }}/>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table> : null
        }
    </div>
  )
}

export default MyTable
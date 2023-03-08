import { MdArrowForward } from "react-icons/md";

interface IMyTableProps {
    headings: string[];
    content: any[];
    onRowButtonClick: () => void;
}

const MyTable = ({headings, content, onRowButtonClick}: IMyTableProps) => {
  return (
    <div className="p-4">
        <table className="w-full text-base">
            <thead>
                <tr className="justify-evenly text-sm text-left">
                    {
                        headings?.map((heading: string) => (
                            <th key={heading}>
                                <p className="mb-3">{heading.toLocaleUpperCase()}</p>
                            </th>
                        ))
                    }
                </tr>
            </thead>
            <tbody className="mt-10">
                {
                    content.map((item, index) => (
                        <tr 
                            key={item.id || index}
                            className="border-b border-gray-200 cursor-pointer justify-evenly"
                            onClick={onRowButtonClick}
                        >
                            {headings.map((heading) => (
                                <td 
                                    key={`${heading}-${item.id}`}
                                >
                                    { heading.toLocaleLowerCase() === 'image' ? (
                                        <img 
                                            src={item[heading] as string} 
                                            alt='product image' 
                                            className="w-12 rounded-full my-2 align-middle"
                                        />
                                    ) : (
                                        <p className='align-middle'>{item[heading]}</p>
                                    )}
                                </td>
                            ))}
                            <td>
                                <MdArrowForward className="text-2xl text-gray-600 cursor-pointer hover:!text-orange-500" onClick={onRowButtonClick} />
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </div>
  )
}

export default MyTable
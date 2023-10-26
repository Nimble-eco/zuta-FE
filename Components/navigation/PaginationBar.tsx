interface IPaginationBarProps {
    paginator: any;
    paginateData: (paginator: any, direction: 'prev' | 'next') => void;
}

const PaginationBar = ({paginator, paginateData}: IPaginationBarProps) => {
  return (
    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
        <button onClick={() => paginateData(paginator, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
        <p className="text-base px-2 my-auto">{paginator?.current_page}</p>
        <button onClick={() => paginateData(paginator?.meta, 'next')} className='mr-3 cursor-pointer'>Next</button>
    </div>
  )
}

export default PaginationBar
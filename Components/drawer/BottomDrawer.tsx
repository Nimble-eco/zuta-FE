import { MdStar, MdOutlineStarOutline } from 'react-icons/md';

// Bottom drawer for results page on mobile screen size

interface IResultsPageMobileBottomDrawerProps {
  filterByRating: (rating: number) => void;
  filterByPrice: (start_price: number, end_price?: number) => void;
}

const BottomDrawer = ({filterByPrice, filterByRating}: IResultsPageMobileBottomDrawerProps) => {
  return (
    <div className="w-full fixed bottom-0 left-0 right-0 top-[30rem] bg-white rounded-t-3xl z-50 pb-8 pl-6 overflow-y-auto">
      <div
        className="flex flex-col w-full mt-8"
      >
        <h3 className="font-bold mb-3">Customer Ratings</h3>
        <div className="flex flex-row text-2xl mb-2 cursor-pointer md:text-sm w-fit" onClick={() => filterByRating(4)}>
          <MdStar className=' text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <span className='text-sm font-thin pl-2'> & above</span>
        </div>
        <div className="flex flex-row text-2xl mb-2 cursor-pointer md:text-sm w-fit" onClick={() => filterByRating(3)}>
          <MdStar className=' text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <span className='text-sm font-thin pl-2'> & above</span>
        </div>
        <div className="flex flex-row text-2xl mb-2 cursor-pointer md:text-sm w-fit" onClick={() => filterByRating(2)}>
          <MdStar className=' text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <span className='text-sm font-thin pl-2'> & above</span>
        </div>
        <div className="flex flex-row text-2xl mb-2 cursor-pointer md:text-sm w-fit" onClick={() => filterByRating(1)}>
          <MdStar className=' text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <span className='text-sm font-thin pl-2'> & above</span>
        </div>
      </div>
      <div className='flex flex-col text-sm mt-8'>
        <h3 className="font-bold text-base mb-3">Price</h3>
        <div className='cursor-pointer mb-3' onClick={() => filterByPrice(0, 5000)}>
          <p>Under N5,000</p>
        </div>
        <div className='cursor-pointer mb-3' onClick={() => filterByPrice(5000, 10000)}>
          <p>N5,000 to N10,000</p>
        </div>
        <div className='cursor-pointer mb-3' onClick={() => filterByPrice(10000, 20000)}>
          <p>N10,000 to N20,000</p>
        </div>
        <div className='cursor-pointer mb-3' onClick={() => filterByPrice(20000, 50000)}>
          <p>N20,000 to N50,000</p>
        </div>
        <div className='cursor-pointer mb-3' onClick={() => filterByPrice(50000, 100000)}>
          <p>N50,000 to N100,000</p>
        </div>
        <div className='cursor-pointer mb-3' onClick={() => filterByPrice(100000, 1000000000000)}>
          <p>N100,000 & above</p>
        </div>
      </div>
    </div>
  )
}

export default BottomDrawer
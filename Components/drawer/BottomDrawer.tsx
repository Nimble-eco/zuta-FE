import { useEffect, useRef } from 'react';
import { MdStar, MdOutlineStarOutline } from 'react-icons/md';

interface IResultsPageMobileBottomDrawerProps {
  filterByRating: (rating: number) => void;
  filterByPrice: (start_price: number, end_price?: number) => void;
  setShow: any;
}

const BottomDrawer = ({filterByPrice, filterByRating, setShow}: IResultsPageMobileBottomDrawerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true

    const handleClickOutside = (event: any) => {
      if (isMounted) {
        if (
          ref.current &&
          !ref.current!.contains(event.target)
        )
        setShow(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      isMounted = false
    }
  }, []);

  return (
    <div ref={ref} className="w-full fixed bottom-0 left-0 right-0 top-[25rem] shadow-2xl bg-gray-200 border-t border-orange-600 pt-4 rounded-t-3xl z-50 pb-8 pl-6 overflow-y-auto transition ease-in-out animate-in duration-500 duration-800 slide-in-from-bottom">
      <div
        className="flex flex-col w-full mt-8"
      >
        <h3 className="font-bold mb-3">Ratings</h3>
        <div className="flex flex-row text-3xl mb-2 cursor-pointer md:text-sm w-fit" onClick={() => filterByRating(4)}>
          <MdStar className=' text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <span className='pl-2 text-base'> & above</span>
        </div>
        <div className="flex flex-row text-3xl mb-2 cursor-pointer md:text-sm w-fit" onClick={() => filterByRating(3)}>
          <MdStar className=' text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <span className='pl-2 text-base'> & above</span>
        </div>
        <div className="flex flex-row text-3xl mb-2 cursor-pointer md:text-sm w-fit" onClick={() => filterByRating(2)}>
          <MdStar className=' text-orange-300' />
          <MdStar className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <span className='pl-2 text-base'> & above</span>
        </div>
        <div className="flex flex-row text-3xl mb-2 cursor-pointer md:text-sm w-fit" onClick={() => filterByRating(1)}>
          <MdStar className=' text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <MdOutlineStarOutline className='text-orange-300' />
          <span className='pl-2 text-base'> & above</span>
        </div>
      </div>
      <div className='flex flex-col text-base mt-8'>
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
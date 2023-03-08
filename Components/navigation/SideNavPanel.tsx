import { MdStar, MdOutlineStarOutline } from 'react-icons/md';

const ResultsPageSideNavPanel = () => {
  return (
      <div
        className="text-base py-10 justify-center w-full"
      >
        <div
            className="flex flex-col w-full mt-8"
        >
            <h3 className="font-bold mb-3">Customer Ratings</h3>
            <div className="flex flex-row text-2xl mb-2 cursor-pointer md:text-sm w-fit">
                <MdStar className=' text-orange-300' />
                <MdStar className='text-orange-300' />
                <MdStar className='text-orange-300' />
                <MdStar className='text-orange-300' />
                <MdOutlineStarOutline className='text-orange-300' />
                <span className='text-sm font-thin pl-2'> & above</span>
            </div>
            <div className="flex flex-row text-2xl mb-2 cursor-pointer md:text-sm w-fit">
                <MdStar className=' text-orange-300' />
                <MdStar className='text-orange-300' />
                <MdStar className='text-orange-300' />
                <MdOutlineStarOutline className='text-orange-300' />
                <MdOutlineStarOutline className='text-orange-300' />
                <span className='text-sm font-thin pl-2'> & above</span>
            </div>
            <div className="flex flex-row text-2xl mb-2 cursor-pointer md:text-sm w-fit">
                <MdStar className=' text-orange-300' />
                <MdStar className='text-orange-300' />
                <MdOutlineStarOutline className='text-orange-300' />
                <MdOutlineStarOutline className='text-orange-300' />
                <MdOutlineStarOutline className='text-orange-300' />
                <span className='text-sm font-thin pl-2'> & above</span>
            </div>
            <div className="flex flex-row text-2xl mb-2 cursor-pointer md:text-sm w-fit">
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
            <div className='cursor-pointer mb-3'>
                <p>Under N10,000</p>
            </div>
            <div className='cursor-pointer mb-3'>
                <p>N10,000 to N20,000</p>
            </div>
            <div className='cursor-pointer mb-3'>
                <p>N20,000 to N50,000</p>
            </div>
            <div className='cursor-pointer mb-3'>
                <p>N50,000 to N100,000</p>
            </div>
            <div className='cursor-pointer mb-3'>
                <p>N100,000 & above</p>
            </div>
        </div>
      </div>
    );
};

ResultsPageSideNavPanel.propTypes = {};

export default ResultsPageSideNavPanel;

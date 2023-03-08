
const VendorSideNavPanel = () => {
  return (
    <div className='flex flex-col bg-white px-10 py-4  w-[15%] mr-[5%] fixed top-0 bottom-0'>
        <div className="mb-12 mt-8 text-orange-500 text-xl font-serif">Zuta</div>
        <a 
            href="#0"
            className="text-black hover:!text-orange-500 cursor-pointer mb-6"
        >
            Products
        </a>
        <a 
            href="#0"
            className="text-black hover:!text-orange-500 cursor-pointer mb-6"
        >
            Transactions
        </a>
        <a 
            href="#0"
            className="text-black hover:!text-orange-500 cursor-pointer mb-6"
        >
            Settings
        </a>
        <a 
            href="#0"
            className="text-black hover:!text-orange-500 cursor-pointer mb-6"
        >
            Feedback
        </a>
    </div>
  )
}

export default VendorSideNavPanel
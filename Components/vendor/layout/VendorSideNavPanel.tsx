
const VendorSideNavPanel = () => {
  return (
    <div className='hidden md:flex flex-col bg-white px-10 py-4 w-[18%] mr-[2%] fixed left-0 top-0 bottom-0 overflow-auto'>
        <div className="mb-12 mt-8 text-orange-500 text-xl font-serif">Zuta</div>
        <a 
            href="/vendor/product"
            className="text-black hover:!text-orange-500 cursor-pointer mb-6"
        >
            Products
        </a>
        <a 
            href="/vendor/transactions"
            className="text-black hover:!text-orange-500 cursor-pointer mb-6"
        >
            Transactions
        </a>
        <a 
            href="/vendor/feature"
            className="text-black hover:!text-orange-500 cursor-pointer mb-6"
        >
            Feature
        </a>
        <a 
            href="/vendor/setting"
            className="text-black hover:!text-orange-500 cursor-pointer mb-6"
        >
            Settings
        </a>
        <a 
            href="/vendor/feedback"
            className="text-black hover:!text-orange-500 cursor-pointer mb-6"
        >
            Feedback
        </a>
    </div>
  )
}

export default VendorSideNavPanel
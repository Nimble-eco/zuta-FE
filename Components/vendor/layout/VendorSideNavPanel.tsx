import { useRouter } from "next/router";
import { useState } from "react"

const VendorSideNavPanel = () => {
    const router = useRouter();
    const activeStyle = "bg-[#1B6909] rounded-tl-[20px] rounded-bl-[20px] text-white py-3";
    const [showDropdown, setShowDropdown] = useState({
        transactions: false
    });

    const toggleDropdown = (sectionName: string) => {
        switch (sectionName) {
            case 'transactions':
                setShowDropdown({
                    transactions: !showDropdown.transactions
                })
                break;
        
            default:
                break;
        }
    }

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
            href="#0"
            onClick={() => toggleDropdown('transactions')}
            className={`text-black hover:!text-orange-500 cursor-pointer mb-6 ${router.pathname.includes('transactions') && activeStyle}`}
        >
            Transactions
        </a>
        {
            (showDropdown.transactions || router.pathname.includes('transactions')) && (
                <div className="flex flex-col gap-3 text-[#495046] pl-4 ml-10 border-l border-[#A4A7A2]">
                    <a href={"/vendor/transactions/orders"} className={` ${router.pathname === '/orders' ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                        <div className={`w-4 h-4 rounded-full my-auto bg-[#1B6909] absolute -left-6 top-1 ${router.pathname === '/orders' ? 'flex' : 'hidden' } `} />
                        Orders
                    </a>
                    <a href="/vendor/transactions/order-train" className={` ${router.pathname.includes('/order-train') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                        <div className={`w-4 h-4 rounded-full my-auto bg-[#1B6909] absolute -left-6 top-1 ${router.pathname === '/order-train' ? 'flex' : 'hidden' } `} />
                        List
                    </a>
                </div>
            )
        }
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
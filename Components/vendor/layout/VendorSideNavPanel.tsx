import { useRouter } from "next/router";
import { useState } from "react"

const VendorSideNavPanel = () => {
    const router = useRouter();
    const activeStyle = "bg-orange-600 rounded-tr-[20px] rounded-br-[20px] !text-white py-3 mr-2 hover:!text-white";
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
    <div className='hidden md:flex flex-col bg-white py-4 w-[18%] mr-[2%] fixed left-0 top-0 bottom-0 overflow-auto gap-6 text-center'>
        <a href="/" className="mb-12 mt-8 text-orange-500 text-xl font-serif">Zuta</a>
        <a 
            href="/vendor/product"
            className={`hover:!text-orange-500 cursor-pointer ${router.pathname.includes('product') && activeStyle}`}
        >
            Products
        </a>
        <a 
            href="#0"
            onClick={() => toggleDropdown('transactions')}
            className={`hover:!text-orange-500 cursor-pointer ${router.pathname.includes('transactions') && activeStyle}`}
        >
            Transactions
        </a>
        {
            (showDropdown.transactions || router.pathname.includes('transactions')) && (
                <div className="flex flex-col gap-2 text-[#495046] pl-4 mx-auto">
                    <a href={"/vendor/transactions/orders"} className={` ${router.pathname.includes('/orders') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                        <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/orders') ? 'flex' : 'hidden' } `} />
                        Orders
                    </a>
                    <a href="/vendor/transactions/order-train" className={` ${router.pathname.includes('/order-train') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                        <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/order-train') ? 'flex' : 'hidden' } `} />
                        Order Train
                    </a>
                </div>
            )
        }
        <a 
            href="/vendor/showcase"
            className={`hover:!text-orange-500 cursor-pointer ${router.pathname.includes('showcase') && activeStyle}`}
        >
            Showcase
        </a>
        <a 
            href="/vendor/setting"
            className={`hover:!text-orange-500 cursor-pointer ${router.pathname.includes('setting') && activeStyle}`}
        >
            Settings
        </a>
        <a 
            href="/vendor/feedback"
            className={`hover:!text-orange-500 cursor-pointer ${router.pathname.includes('feedback') && activeStyle}`}
        >
            Feedback
        </a>
    </div>
  )
}

export default VendorSideNavPanel
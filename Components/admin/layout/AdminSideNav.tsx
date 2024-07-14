import { useRouter } from "next/router";
import { useState } from "react"

const AdminSideNavPanel = () => {
    const router = useRouter();
    const activeStyle = "bg-orange-600 rounded-tr-[20px] rounded-br-[20px] !text-white py-3 mr-2 hover:!text-white";
    const [showDropdown, setShowDropdown] = useState<any>({
        users: false,
        stores: false,
        products: false,
        transactions: false,
    });

    const toggleDropdown = (sectionName: string) => {
        setShowDropdown({
            ...showDropdown,
            [sectionName]: !showDropdown[sectionName]
        })
    }

  return (
    <div className='hidden md:flex flex-col bg-white py-4 w-[19%] mr-[1%] fixed left-0 top-0 bottom-0 overflow-auto gap-6 text-center'>
        <div className="mb-12 mt-8 text-orange-500 text-xl font-serif">Zuta</div>
        <a 
            href="/admin/users"
            className={`cursor-pointer ${router.pathname.includes('users') ? activeStyle : 'hover:!text-orange-500'}`}
        >
            Users
        </a>
        <a 
            href="#0"
            onClick={() => toggleDropdown('stores')}
            className={`cursor-pointer ${router.pathname.includes('stores')  ? activeStyle : 'hover:!text-orange-500'}`}
        >
            Stores
        </a>
        {
            (showDropdown.stores || router.pathname.includes('stores')) && (
                <div className="flex flex-col gap-2 text-[#495046] pl-4 mx-auto">
                    <a href={"/admin/stores-stats"} className={` ${router.pathname.includes('/stores-stats') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                        <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/stores-stats') ? 'flex' : 'hidden' } `} />
                        Stats
                    </a>
                    <a href="/admin/stores" className={` ${router.pathname.includes('/stores') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                        <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/stores') ? 'flex' : 'hidden' } `} />
                        All Stores
                    </a>
                </div>
            )
        }
        <a 
            href="#0"
            onClick={() => toggleDropdown('products')}
            className={`cursor-pointer ${router.pathname.includes('product')  ? activeStyle : 'hover:!text-orange-500'}`}
        >
            Products
        </a>
        {
            (showDropdown.products || router.pathname.includes('products')) && (
                <div className="flex flex-col gap-2 text-[#495046] pl-4 mx-auto">
                    <a href={"/admin/products-stats"} className={` ${router.pathname.includes('/products-stats') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                        <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/products-stats') ? 'flex' : 'hidden' } `} />
                        Stats
                    </a>
                    <a href="/admin/products" className={` ${router.pathname.includes('/products') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                        <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/products') ? 'flex' : 'hidden' } `} />
                        All Products
                    </a>
                </div>
            )
        }
        <a 
            href="#0"
            onClick={() => toggleDropdown('transactions')}
            className={`cursor-pointer ${router.pathname.includes('transactions') ? activeStyle : 'hover:!text-orange-500'}`}
        >
            Transactions
        </a>
        {
            (showDropdown.transactions || router.pathname.includes('transactions')) && (
                <div className="flex flex-col gap-2 text-[#495046] pl-4 mx-auto">
                    <a href={"/admin/transactions/orders"} className={` ${router.pathname.includes('/orders') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                        <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/orders') ? 'flex' : 'hidden' } `} />
                        Orders
                    </a>
                    <a href="/admin/transactions/order-train" className={` ${router.pathname.includes('/order-train') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                        <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/order-train') ? 'flex' : 'hidden' } `} />
                        Order Train
                    </a>
                </div>
            )
        }
        <a 
            href="/admin/showcase"
            className={`cursor-pointer ${router.pathname.includes('showcase') ? activeStyle : 'hover:!text-orange-500'}`}
        >
            Showcase
        </a>
        <a 
            href="/admin/setting"
            className={`cursor-pointer ${router.pathname.includes('setting') ? activeStyle : 'hover:!text-orange-500'}`}
        >
            Settings
        </a>
        <a 
            href="/admin/feedback"
            className={`cursor-pointer ${router.pathname.includes('feedback') ? activeStyle : 'hover:!text-orange-500'}`}
        >
            Feedback
        </a>
    </div>
  )
}

export default AdminSideNavPanel
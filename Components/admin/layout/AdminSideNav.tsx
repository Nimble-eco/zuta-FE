import { MenuIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react"
import { IoIosArrowDown, IoIosArrowUp, IoMdCloseCircleOutline } from "react-icons/io";

const AdminSideNavPanel = () => {
    const router = useRouter();
    const activeStyle = "bg-orange-600 rounded-tr-[20px] rounded-br-[20px] !text-white py-3 mr-2 hover:!text-white";
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showDropdown, setShowDropdown] = useState<any>({
        users: false,
        stores: false,
        products: false,
        orders: false,
    });

    const toggleDropdown = (sectionName: string) => {
        setShowDropdown({
            ...showDropdown,
            [sectionName]: !showDropdown[sectionName]
        })
    }

  return (
    <>
        <div className="lg:hidden fixed top-2 left-4 bg-white p-4 rounded-full cursor-pointer shadow-xl z-20">
            <MenuIcon className="h-6 w-6 text-slate-700" onClick={()=>setShowMobileMenu(!showMobileMenu)}/>
        </div>
        <div className={`${showMobileMenu ? 'flex' : 'hidden'} lg:flex flex-col bg-white py-2 w-[60%] lg:w-[19%] mr-[1%] fixed left-0 top-0 bottom-0 z-20 overflow-scroll gap-6 text-center transition ease-in-out animate-in duration-500 duration-800 slide-in-from-left lg:!animate-none`}>
            <IoMdCloseCircleOutline className="h-8 w-8 text-gray-500 cursor-pointer absolute top-6 right-4 lg:hidden" onClick={()=>setShowMobileMenu(!showMobileMenu)}/>
            <a href="/" className="mb-2 !text-orange-500 text-xl font-serif mt-10 lg:mt-0">Zuta</a>
            <a 
                href="/admin/users"
                className={`cursor-pointer ${router.pathname.includes('users') ? activeStyle : 'hover:!text-orange-500'}`}
            >
                Users
            </a>
            <a 
                href="#0"
                onClick={() => toggleDropdown('stores')}
                className={`cursor-pointer flex justify-center ${router.pathname.includes('stores')  ? activeStyle : 'hover:!text-orange-500'}`}
            >
                <div className="flex flex-row gap-2 items-center">
                    Stores
                    {
                        (showDropdown.stores || router.pathname.includes('stores')) ? 
                        <IoIosArrowUp className="w-5 h-5" /> :
                        <IoIosArrowDown className="w-5 h-5"/>
                    }
                </div>
            </a>
            {
                (showDropdown.stores || router.pathname.includes('stores')) && (
                    <div className="flex flex-col gap-2 text-[#495046] pl-4 mx-auto">
                        <a href="/admin/stores" className={` ${router.pathname.includes('/stores') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                            <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/stores') ? 'flex' : 'hidden' } `} />
                            All Stores
                        </a>
                        <a href={"#0"} className={` ${router.pathname.includes('/stores-stats') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                            <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/stores-stats') ? 'flex' : 'hidden' } `} />
                            Stats
                        </a>
                    </div>
                )
            }
            <a 
                href="#0"
                onClick={() => toggleDropdown('products')}
                className={`cursor-pointer flex justify-center ${router.pathname.includes('product')  ? activeStyle : 'hover:!text-orange-500'}`}
            >
                <div className="flex flex-row gap-2 items-center">
                    Products
                    {
                        (showDropdown.products || router.pathname.includes('products')) ? 
                        <IoIosArrowUp className="w-5 h-5" /> :
                        <IoIosArrowDown className="w-5 h-5"/>
                    }
                </div>
            </a>
            {
                (showDropdown.products || router.pathname.includes('products')) && (
                    <div className="flex flex-col gap-2 text-[#495046] pl-4 mx-auto">
                        <a href="/admin/products" className={` ${router.pathname.includes('/products') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                            <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/products') ? 'flex' : 'hidden' } `} />
                            All Products
                        </a>
                        <a href={"#0"} className={` ${router.pathname.includes('/products-stats') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                            <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/products-stats') ? 'flex' : 'hidden' } `} />
                            Stats
                        </a>
                    </div>
                )
            }
            <a 
                href="#0"
                onClick={() => toggleDropdown('orders')}
                className={`cursor-pointer flex justify-center ${router.pathname.includes('orders') ? activeStyle : 'hover:!text-orange-500'}`}
            >
                <div className="flex flex-row gap-2 items-center">
                    Orders
                    {
                        (showDropdown.orders || router.pathname.includes('orders')) ? 
                        <IoIosArrowUp className="w-5 h-5" /> :
                        <IoIosArrowDown className="w-5 h-5"/>
                    }
                </div>
            </a>
            {
                (showDropdown.orders || router.pathname.includes('orders')) && (
                    <div className="flex flex-col gap-2 text-[#495046] pl-4 mx-auto">
                        <a href={"/admin/orders/standard"} className={` ${router.pathname.includes('/standard') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                            <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/standard') ? 'flex' : 'hidden' } `} />
                            Standard
                        </a>
                        <a href="/admin/orders/order-train" className={` ${router.pathname.includes('/order-train') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                            <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/order-train') ? 'flex' : 'hidden' } `} />
                            Order Train
                        </a>
                        <a href="#0" className={` ${router.pathname.includes('/order-stats') ? 'font-semibold' : 'opacity-50'} no-underline text-[#495046] cursor-pointer flex flex-row  relative`}>
                            <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/order-stats') ? 'flex' : 'hidden' } `} />
                            Stats
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
                href="/admin/transactions"
                className={`cursor-pointer ${router.pathname.includes('transactions') ? activeStyle : 'hover:!text-orange-500'}`}
            >
                Transactions
            </a>
            <a 
                href="/admin/banners"
                className={`cursor-pointer ${router.pathname.includes('banners') ? activeStyle : 'hover:!text-orange-500'}`}
            >
                Banners
            </a>
            <a 
                href="/admin/coupons"
                className={`cursor-pointer ${router.pathname.includes('coupons') ? activeStyle : 'hover:!text-orange-500'}`}
            >
                Coupons
            </a>
            <a 
                href="#0"
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
    </>
  )
}

export default AdminSideNavPanel
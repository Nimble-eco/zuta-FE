// import { MenuIcon } from "lucide-react";
// import { useRouter } from "next/router";
// import { useState } from "react"
// import { IoIosArrowDown, IoIosArrowUp, IoMdCloseCircleOutline } from "react-icons/io";

// const AdminSideNavPanel = () => {
//     const router = useRouter();
//     const activeStyle = "bg-slate-600 rounded-tr-[20px] rounded-br-[20px] !text-white py-3 mr-2 hover:!text-white";
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [showDropdown, setShowDropdown] = useState<any>({
//         users: false,
//         stores: false,
//         products: false,
//         orders: false,
//     });

//     const toggleDropdown = (sectionName: string) => {
//         setShowDropdown({
//             ...showDropdown,
//             [sectionName]: !showDropdown[sectionName]
//         })
//     }

//   return (
//     <>
//         <div className="lg:hidden absolute top-2 left-4 cursor-pointer z-20">
//             <MenuIcon className="h-6 w-6 text-slate-700" onClick={()=>setShowMobileMenu(!showMobileMenu)}/>
//         </div>
//         <div className={`${showMobileMenu ? 'flex' : 'hidden'} lg:flex flex-col bg-slate-800 text-white py-2 w-[60%] lg:w-[19%] mr-[1%] fixed left-0 top-0 bottom-0 z-20 overflow-scroll text-sm gap-6 transition ease-in-out animate-in duration-500 duration-800 slide-in-from-left lg:!animate-none`}>
//             <IoMdCloseCircleOutline className="h-8 w-8 text-gray-500 cursor-pointer absolute top-6 right-4 lg:hidden" onClick={()=>setShowMobileMenu(!showMobileMenu)}/>
//             <a href="/" className="mb-2 !text-orange-500 text-xl font-serif mt-10 lg:mt-0 px-4 lg:px-16">Zuta</a>
//             <a 
//                 href="/admin"
//                 className={`cursor-pointer px-4 lg:px-16 ${router.pathname === '/admin' ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 Dashboard
//             </a>
//             <a 
//                 href="/admin/users"
//                 className={`cursor-pointer px-4 lg:px-16 ${router.pathname.includes('users') ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 Users
//             </a>
//             <a 
//                 href="#0"
//                 onClick={() => toggleDropdown('stores')}
//                 className={`cursor-pointer px-4 lg:px-16 flex ${router.pathname.includes('stores')  ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 <div className="flex flex-row gap-2 justify-between w-full items-center">
//                     Stores
//                     {
//                         (showDropdown.stores || router.pathname.includes('stores')) ? 
//                         <IoIosArrowUp className="w-5 h-5" /> :
//                         <IoIosArrowDown className="w-5 h-5"/>
//                     }
//                 </div>
//             </a>
//             {
//                 (showDropdown.stores || router.pathname.includes('stores')) && (
//                     <div className="flex flex-col gap-2 text-slate-400 font-medium pl-4 lg:pl-16 w-full mx-auto">
//                         <a href="/admin/stores" className={`no-underline cursor-pointer flex flex-row  relative`}>
//                             <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/stores') ? 'flex' : 'hidden' } `} />
//                             All Stores
//                         </a>
//                         <a href={"#0"} className={`no-underline cursor-pointer flex flex-row  relative`}>
//                             <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/stores-stats') ? 'flex' : 'hidden' } `} />
//                             Stats
//                         </a>
//                     </div>
//                 )
//             }
//             <a 
//                 href="#0"
//                 onClick={() => toggleDropdown('products')}
//                 className={`cursor-pointer px-4 lg:px-16 flex ${router.pathname.includes('product')  ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 <div className="flex flex-row gap-2 w-full justify-between items-center">
//                     Products
//                     {
//                         (showDropdown.products || router.pathname.includes('products')) ? 
//                         <IoIosArrowUp className="w-5 h-5" /> :
//                         <IoIosArrowDown className="w-5 h-5"/>
//                     }
//                 </div>
//             </a>
//             {
//                 (showDropdown.products || router.pathname.includes('products')) && (
//                     <div className="flex flex-col gap-2 text-slate-400 font-medium pl-4 lg:pl-16 w-full mx-auto">
//                         <a href="/admin/products" className={`no-underline cursor-pointer flex flex-row  relative`}>
//                             <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/products') ? 'flex' : 'hidden' } `} />
//                             All Products
//                         </a>
//                         <a href={"#0"} className={`no-underline  cursor-pointer flex flex-row  relative`}>
//                             <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/products-stats') ? 'flex' : 'hidden' } `} />
//                             Stats
//                         </a>
//                     </div>
//                 )
//             }
//             <a 
//                 href="#0"
//                 onClick={() => toggleDropdown('orders')}
//                 className={`cursor-pointer px-4 lg:px-16 flex ${router.pathname.includes('orders') ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 <div className="flex flex-row gap-2 w-full justify-between items-center">
//                     Orders
//                     {
//                         (showDropdown.orders || router.pathname.includes('orders')) ? 
//                         <IoIosArrowUp className="w-5 h-5" /> :
//                         <IoIosArrowDown className="w-5 h-5"/>
//                     }
//                 </div>
//             </a>
//             {
//                 (showDropdown.orders || router.pathname.includes('orders')) && (
//                     <div className="flex flex-col gap-2 text-slate-400 font-medium pl-4 lg:pl-16 w-full mx-auto">
//                         <a href={"/admin/orders/standard"} className={`no-underline cursor-pointer flex flex-row  relative`}>
//                             <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/standard') ? 'flex' : 'hidden' } `} />
//                             Standard
//                         </a>
//                         <a href="/admin/orders/order-train" className={`no-underline cursor-pointer flex flex-row  relative`}>
//                             <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/order-train') ? 'flex' : 'hidden' } `} />
//                             Order Train
//                         </a>
//                         <a href="#0" className={`no-underline cursor-pointer flex flex-row relative`}>
//                             <div className={`w-3 h-3 rounded-full my-auto bg-orange-600 absolute -left-5 top-2 ${router.pathname.includes('/order-stats') ? 'flex' : 'hidden' } `} />
//                             Stats
//                         </a>
//                     </div>
//                 )
//             }
//             <a 
//                 href="/admin/showcase"
//                 className={`cursor-pointer px-4 lg:px-16 ${router.pathname.includes('showcase') ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 Showcase
//             </a>
//             <a 
//                 href="/admin/transactions"
//                 className={`cursor-pointer px-4 lg:px-16 ${router.pathname.includes('transactions') ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 Transactions
//             </a>
//             <a 
//                 href="/admin/banners"
//                 className={`cursor-pointer px-4 lg:px-16 ${router.pathname.includes('banners') ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 Banners
//             </a>
//             <a 
//                 href="/admin/coupons"
//                 className={`cursor-pointer px-4 lg:px-16 ${router.pathname.includes('coupons') ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 Coupons
//             </a>
//             <a 
//                 href="/admin/delivery"
//                 className={`cursor-pointer px-4 lg:px-16 ${router.pathname.includes('delivery') ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 Delivery
//             </a>
//             <a 
//                 href="#0"
//                 className={`cursor-pointer px-4 lg:px-16 ${router.pathname.includes('setting') ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 Settings
//             </a>
//             <a 
//                 href="/admin/feedback"
//                 className={`cursor-pointer px-4 lg:px-16 ${router.pathname.includes('feedback') ? activeStyle : 'hover:!text-orange-500'}`}
//             >
//                 Feedback
//             </a>
//         </div>
//     </>
//   )
// }

// export default AdminSideNavPanel

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { 
  LayoutDashboard, Users, Store, Package, 
  ShoppingCart, Tv, CreditCard, Image as ImageIcon, 
  Ticket, Truck, Settings, MessageSquare, 
  ChevronDown, ChevronUp, Menu, X 
} from "lucide-react";

// --- Types ---
interface SubItem {
  label: string;
  href: string;
  pattern: string;
}

interface NavItem {
  label: string;
  href?: string; // Optional if it has subItems
  icon: React.ElementType;
  pattern: string;
  subItems?: SubItem[];
}

const AdminSideNavPanel = () => {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Configuration for Navigation items
  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, pattern: "/admin" },
    { label: "Users", href: "/admin/users", icon: Users, pattern: "users" },
    {
      label: "Stores",
      icon: Store,
      pattern: "stores",
      subItems: [
        { label: "All Stores", href: "/admin/stores", pattern: "/stores" },
        { label: "Stats", href: "#0", pattern: "/stores-stats" },
      ],
    },
    {
      label: "Products",
      icon: Package,
      pattern: "products",
      subItems: [
        { label: "All Products", href: "/admin/products", pattern: "/products" },
        { label: "Stats", href: "#0", pattern: "/products-stats" },
      ],
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      pattern: "orders",
      subItems: [
        { label: "Standard", href: "/admin/orders/standard", pattern: "/standard" },
        { label: "Order Train", href: "/admin/orders/order-train", pattern: "/order-train" },
        { label: "Stats", href: "#0", pattern: "/order-stats" },
      ],
    },
    { label: "Showcase", href: "/admin/showcase", icon: Tv, pattern: "showcase" },
    { label: "Transactions", href: "/admin/transactions", icon: CreditCard, pattern: "transactions" },
    { label: "Banners", href: "/admin/banners", icon: ImageIcon, pattern: "banners" },
    { label: "Coupons", href: "/admin/coupons", icon: Ticket, pattern: "coupons" },
    { label: "Delivery", href: "/admin/delivery", icon: Truck, pattern: "delivery" },
    { label: "Settings", href: "#0", icon: Settings, pattern: "setting" },
    { label: "Feedback", href: "/admin/feedback", icon: MessageSquare, pattern: "feedback" },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const isActive = (pattern: string) => {
    return pattern === "/admin" 
      ? router.pathname === "/admin" 
      : router.pathname.includes(pattern);
  };

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside className={`
        fixed left-0 top-0 bottom-0 z-40
        w-[280px] bg-slate-900 text-slate-300
        transition-transform duration-300 ease-in-out
        ${showMobileMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        border-r border-slate-800 flex flex-col
      `}>
        
        {/* Brand Logo */}
        <div className="px-8 py-10">
            <Link href="/"> 
                <div className="text-2xl font-bold text-orange-500 font-serif flex flex-row items-center gap-1 cursor-pointer">
                    <img
                        src="/images/logo.jpeg" 
                        alt="logo"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    Admin
                </div>
            </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const active = isActive(item.pattern);
            const hasSubItems = !!item.subItems;
            const isOpen = openDropdown === item.label || (active && openDropdown === null);

            return (
              <div key={item.label}>
                {hasSubItems ? (
                  /* Dropdown Parent */
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group
                      ${active ? "bg-orange-600/10 text-orange-500" : "hover:bg-slate-800 hover:text-white"}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={active ? "text-orange-500" : "text-slate-400 group-hover:text-white"} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                ) : (
                  /* Standard Link */
                  <Link href={item.href || "#0"}>
                    <div className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group
                      ${active ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20" : "hover:bg-slate-800 hover:text-white"}
                    `}>
                      <item.icon size={20} className={active ? "text-white" : "text-slate-400 group-hover:text-white"} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </Link>
                )}

                {/* Sub Items */}
                {hasSubItems && isOpen && (
                  <div className="mt-1 ml-4 pl-6 border-l border-slate-800 space-y-1">
                    {item.subItems?.map((sub) => {
                      const subActive = router.pathname.includes(sub.pattern);
                      return (
                        <Link key={sub.label} href={sub.href}>
                          <div className={`
                            py-2 px-4 rounded-lg cursor-pointer text-sm transition-colors
                            ${subActive ? "text-orange-500 font-semibold" : "text-slate-500 hover:text-slate-300"}
                          `}>
                            {sub.label}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer info (Optional) */}
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              AD
            </div>
            <div className="text-xs">
              <p className="text-white font-medium">Zuta Systems</p>
              <p className="text-slate-500">v2.0.4-prod</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </>
  );
};

export default AdminSideNavPanel;
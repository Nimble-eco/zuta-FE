import { 
    MenuIcon, 
    LayoutDashboard, 
    ShoppingBag, 
    ListOrdered, 
    Image as ImageIcon, 
    Settings, 
    MessageSquare,
    ChevronDown,
    ChevronUp,
    XCircle 
  } from "lucide-react";
  import Link from "next/link";
  import { useRouter } from "next/router";
  import { useState } from "react";
  
  const VendorSideNavPanel = () => {
      const router = useRouter();
      const [showMobileMenu, setShowMobileMenu] = useState(false);
      const [showDropdown, setShowDropdown] = useState({ transactions: false });
  
      const toggleDropdown = () => {
          setShowDropdown(prev => ({ transactions: !prev.transactions }));
      };
  
      const isActive = (path: string) => router.pathname === path;
      const isParentActive = (path: string) => router.pathname.startsWith(path);
  
      const navItemStyle = (path: string) => `
          flex items-center gap-3 px-6 py-3 transition-all duration-200 group
          ${isActive(path) 
              ? "bg-orange-50 text-orange-600 border-r-4 border-orange-600 font-semibold" 
              : "text-slate-300 hover:bg-slate-700 hover:text-white"}
      `;
  
      return (
            <>
                {/* Mobile Toggle */}
                <div className="lg:hidden fixed top-4 left-4 z-30">
                    <button 
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                        className="p-2 bg-slate-800 rounded-lg text-white shadow-lg"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </button>
                </div>
  
                {/* Sidebar */}
                <div className={`
                    fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out
                    ${showMobileMenu ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                    flex flex-col border-r border-slate-700
                `}>
                    <div className="flex items-center justify-between px-6 py-8">
                        <Link href="/"> 
                            <div className="text-2xl font-bold text-orange-500 font-serif flex flex-row items-center gap-1 cursor-pointer">
                                <img
                                    src="/images/logo.jpeg" 
                                    alt="logo"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                Zuta
                            </div>
                        </Link>
                        <XCircle 
                            className="h-6 w-6 text-slate-400 cursor-pointer lg:hidden" 
                            onClick={() => setShowMobileMenu(false)} 
                        />
                    </div>
  
                    <nav className="flex-1 space-y-1 overflow-y-auto">
                        <Link href="/vendor"> 
                            <div className={navItemStyle("/vendor")}>
                                <LayoutDashboard size={20} /> Dashboard
                            </div>
                        </Link>
  
                        <Link href="/vendor/product"> 
                            <div className={navItemStyle("/vendor/product")}>
                                <ShoppingBag size={20} /> Products
                            </div>
                        </Link>
  
                      {/* Collapsible Orders Section */}
                      <div>
                          <button 
                              onClick={toggleDropdown}
                              className={`w-full ${navItemStyle("/vendor/transactions")} border-none`}
                          >
                              <ListOrdered size={20} />
                              <span className="flex-1 text-left">Orders</span>
                              {showDropdown.transactions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
  
                          {(showDropdown.transactions || isParentActive("/vendor/transactions")) && (
                              <div className="bg-slate-950/50 py-2 space-y-1">
                                    <Link href="/vendor/transactions/orders">
                                        <div className={`block pl-14 pr-4 py-2 text-sm ${isActive("/vendor/transactions/orders") ? "text-orange-500" : "text-slate-400 hover:text-white"}`}>
                                            All Orders
                                        </div>
                                    </Link>
                                    <Link href="/vendor/transactions/order-train">
                                        <div className={`block pl-14 pr-4 py-2 text-sm ${isActive("/vendor/transactions/order-train") ? "text-orange-500" : "text-slate-400 hover:text-white"}`}>
                                            Order Train
                                        </div>
                                    </Link>
                              </div>
                          )}
                      </div>
  
                        <Link href="/vendor/showcase"> 
                            <div className={navItemStyle("/vendor/showcase")}>
                                <ImageIcon size={20} /> Showcase
                            </div>
                        </Link>
  
                        <Link href="/vendor/setting"> 
                            <div className={navItemStyle("/vendor/setting")}>
                                <Settings size={20} /> Settings
                            </div>
                        </Link>
    
                        <Link href="/vendor/feedback">
                            <div className={navItemStyle("/vendor/feedback")}>
                                <MessageSquare size={20} /> Feedback
                            </div>
                        </Link>
                  </nav>
              </div>
  
                {/* Overlay for mobile */}
                {showMobileMenu && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setShowMobileMenu(false)}
                    />
                )}
            </>
      );
  }
  
  export default VendorSideNavPanel;
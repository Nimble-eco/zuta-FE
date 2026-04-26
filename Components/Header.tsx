import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { HiSearch, HiUser, HiUserAdd, HiMenu } from 'react-icons/hi';
import { BsShop } from 'react-icons/bs';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { AiFillCloseCircle } from 'react-icons/ai';
import Cookies from 'js-cookie';

interface INavBarProps {
  search?: boolean;
  onSearch?: (searchStr: string) => void;
}

const Header = ({ search = true, onSearch }: INavBarProps) => {
  const router = useRouter();
  const [mobileMenu, showMobileMenu] = useState(false);
  const [searchStr, setSearchStr] = useState('');
  const [user, setUser] = useState<any>({});
  const [cartCount, setCartCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const goToCartPage = () => router.push('/cart');
  const searchProducts = (s: string) => router.push(`/results?search=${s}`);

  useEffect(() => {
    const userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    setUser(userCookie);
    const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : [];
    setCartCount((cart?.products?.length + cart?.subscriptions?.length) || 0);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const handleClickOutside = (event: any) => {
      if (isMounted && ref.current && !ref.current.contains(event.target)) {
        showMobileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      isMounted = false;
    };
  }, []);

  return (
    <header className="w-full shadow-md z-50 sticky top-0">
      {/* Top bar */}
      <div className="flex flex-row items-center justify-between px-4 py-3 bg-slate-800 gap-3">
        {/* Left: hamburger + logo */}
        <div className="flex flex-row items-center gap-2 shrink-0">
          <button
            className="md:hidden text-white"
            onClick={() => showMobileMenu(true)}
            aria-label="Open menu"
          >
            <HiMenu className="text-3xl" />
          </button>
          <div
            onClick={() => router.push('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
                src="/images/logo.jpeg" 
                alt="logo"
                width={40}
                height={40}
                className="rounded-full mx-2 "
            />
            <span className="text-white font-semibold text-base hidden sm:block">Zuta</span>
          </div>
        </div>

        {/* Center: search */}
        {search && (
          <form className="hidden md:flex flex-row items-center flex-1 max-w-md bg-white/10 border border-white/20 rounded-lg overflow-hidden mx-4">
            <input
              type="text"
              placeholder="Search products, categories..."
              value={searchStr}
              onChange={(e) => setSearchStr(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/50 text-sm px-4 py-2 outline-none"
            />
            <button
              type="submit"
              onClick={(e) => { e.preventDefault(); searchProducts(searchStr); }}
              className="bg-orange-500 hover:bg-orange-600 transition-colors px-4 py-2 text-white"
            >
              <HiSearch className="text-lg" />
            </button>
          </form>
        )}

        {/* Right: icons */}
        <div className="flex flex-row items-center gap-4 shrink-0">
          <button
            className="relative text-white"
            onClick={goToCartPage}
            aria-label="Cart"
          >
            <MdOutlineShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          {user?.vendor && (
            <a href="/vendor" aria-label="Vendor dashboard">
              <BsShop className="text-xl text-white" />
            </a>
          )}
          {user?.access_token ? (
            <button onClick={() => router.push('/profile')} aria-label="Profile">
              <HiUser className="text-2xl text-white" />
            </button>
          ) : (
            <button onClick={() => router.push('/auth/signIn')} aria-label="Sign in">
              <HiUserAdd className="text-2xl text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary nav — desktop */}
      <nav className="hidden md:flex flex-row items-center gap-6 bg-slate-700 px-8 py-2.5 text-sm font-medium">
        <button onClick={() => router.push('/order-train')} className="text-white/80 hover:text-white transition-colors">
          Open Orders
        </button>
        <button onClick={() => router.push('/departments')} className="text-white/80 hover:text-white transition-colors">
          Categories
        </button>
        <button onClick={() => router.push('/customer-support')} className="text-white/80 hover:text-white transition-colors">
          Customer Service
        </button>
        <button onClick={() => router.push('/vendorVerification')} className="text-orange-400 hover:text-orange-300 transition-colors ml-auto">
          Sell on Zuta →
        </button>
      </nav>

      {/* Mobile search bar */}
      <div className="md:hidden bg-slate-700 px-4 py-2.5">
        <form className="flex flex-row items-center bg-white/10 border border-white/20 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            value={searchStr}
            onChange={(e) => setSearchStr(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-white/50 text-sm px-4 py-2 outline-none"
          />
          <button
            type="submit"
            onClick={(e) => { e.preventDefault(); onSearch?.(searchStr); }}
            className="bg-orange-500 px-4 py-2 text-white"
          >
            <HiSearch className="text-base" />
          </button>
        </form>
      </div>

      {/* Email verification banner */}
      {user && !user.user_verified && (
        <div className="bg-amber-50 border-b border-amber-200 py-2.5 px-4 flex justify-center">
          <button
            onClick={() => router.push('/auth/requestEmailVerification')}
            className="text-amber-800 font-medium text-sm text-center"
          >
            ⚠️ Your email is unverified — tap here to verify
          </button>
        </div>
      )}

      {/* Mobile slide-in menu */}
      {mobileMenu && (
        <div
          ref={ref}
          className="fixed left-0 top-0 bottom-0 w-[70%] max-w-xs bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-300"
        >
          <div className="bg-slate-800 py-10 px-5 text-white flex flex-col relative">
            <button
              className="absolute right-4 top-4 text-white/70 hover:text-white"
              onClick={() => showMobileMenu(false)}
            >
              <AiFillCloseCircle className="text-2xl" />
            </button>
            <img
                src="/images/logo.jpeg" 
                alt="logo"
                width={40}
                height={40}
                className="rounded-full mb-2 "
            />
            <h2 className="font-bold text-xl mb-1">Zuta</h2>
            <p className="text-white/60 text-sm">Connecting buyers & wholesalers</p>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-6 text-slate-700">
            {[
              { label: 'Sell on Zuta', href: '/vendorVerification', accent: true },
              { label: 'Open Orders', href: '/order-train' },
              ...(user?.access_token
                ? [
                    { label: 'My Profile', href: '/profile' },
                    { label: 'Customer Service', href: '/customer-support' },
                  ]
                : [{ label: 'Sign In', href: '/auth/signIn' }]),
            ].map((item) => (
              <button
                key={item.href}
                onClick={() => { router.push(item.href); showMobileMenu(false); }}
                className={`block w-full text-left py-3 text-base border-b border-slate-100 ${
                  item.accent ? 'text-orange-500 font-semibold' : 'text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}

            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-6 mb-3">
              Top Categories
            </p>
            {['Groceries', 'Electronics', 'Food stuffs'].map((cat) => (
              <button
                key={cat}
                onClick={() => { router.push(`/results?search=${cat.toLowerCase()}`); showMobileMenu(false); }}
                className="block w-full text-left py-3 text-base border-b border-slate-100 text-slate-700"
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => { router.push('/departments'); showMobileMenu(false); }}
              className="block w-full text-left py-3 text-orange-500 font-medium text-base"
            >
              See all categories →
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
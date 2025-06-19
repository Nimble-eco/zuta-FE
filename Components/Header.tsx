import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from "react";
import { HiSearch, HiUser, HiUserAdd, HiMenu, HiOutlineLogout } from "react-icons/hi";
import { BsShop } from "react-icons/bs";
import { MdOutlineShoppingCart } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
import Cookies from 'js-cookie';
import { GiWorld } from 'react-icons/gi';

interface INavBarProps {
    search?: boolean;
    onSearch?: (searchStr: string) => void;
};

export type HeaderRef = {
  updateCartCount: (count: number) => void;
};

const Header = ({search = true, onSearch}: INavBarProps) => {
    const router = useRouter();
    const [mobileMenu, showMobileMenu] = useState<boolean>(false);
    const [searchStr, setSearchStr] = useState<string>('');
    const [user, setUser] = useState<any>({});

    const goToCartPage = () => router.push(`/cart`);

    const searchProducts = (searchStr: string) => router.push(`/results?search=${searchStr}`);

    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        let userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
        setUser(userCookie);

        const cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')!) : [];
        setCartCount((cart?.products?.length + cart?.subscriptions?.length) || 0);
    }, []);

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let isMounted = true

        const handleClickOutside = (event: any) => {
            if (isMounted) {
                if (
                ref.current &&
                !ref.current!.contains(event.target)
                )
                showMobileMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            isMounted = false
        }
    }, []);

    return (
        <div
            className='flex flex-col w-full shadow-md z-50 h-fit'
        >
            <div className='flex flex-row w-full justify-between px-4 py-3 bg-slate-800'>
                <div className='flex flex-row my-auto'>
                    <a className='md:hidden' href='#0' onClick={() => showMobileMenu(true)}>
                        <HiMenu className='text-4xl mt-1 text-white' />
                    </a>
                    <a href='/' className=''>
                        <img
                            src="/images/logo.jpeg" 
                            alt="logo"
                            width={40}
                            height={40}
                            className="rounded-full mx-2 "
                        />
                    </a>
                </div>
                {
                    search && 
                    <form 
                        className={"w-[50%] max-w-[50%] mx-auto bg-gray-200 hidden md:flex flex-row rounded-md"}
                    >
                        <input 
                            type="text" 
                            placeholder="Search for products"
                            value={searchStr}
                            onChange={(e: any) => setSearchStr(e.target.value)}
                            className="flex-grow focus:outline-none bg-transparent w-[80%] text-sm pl-5 text-gray-600 rounded-l-md" 
                        />
                        <button 
                            type="submit" 
                            onClick={(e: any) => {
                                e.preventDefault();
                                searchProducts(searchStr)
                            }}
                            className='text-gray-600 text-sm hover:text-orange-500 bg-orange-500 rounded-r-md px-4'
                        >
                            <HiSearch className='text-white'/>
                        </button>
                    </form>
                }
            
                <div className="flex flex-row my-auto gap-4">
                    <div className='relative' onClick={() => goToCartPage()}>
                        <span className='text-base text-orange-500 z-10 absolute -top-4 p-1  -right-2'>{cartCount}</span>
                        <MdOutlineShoppingCart 
                            className='text-white cursor-pointer text-2xl'
                        />
                    </div>
                    {
                        user?.vendor && (
                            <a href="/vendor">
                                <BsShop className="text-2xl text-white"/>
                            </a>
                        )
                    }
                    {user?.access_token ? (
                        <a 
                            href="/profile"
                        >
                            <HiUser className="text-2xl text-white" />
                        </a>
                    ) : (
                        <a 
                            href="/auth/signIn"
                        >
                            <HiUserAdd className="text-2xl text-white" />
                        </a>
                    )}
                    {/* <a
                        href={'/community'}
                        className='flex flex-row gap-1 items-center text-orange-500'
                    >
                        <GiWorld className='text-xl text-orange-500'/>
                        <p className='text-orange-500 text-sm hidden lg:flex !mb-0'>Community</p>
                    </a> */}
                </div>
            </div>
            <div className='hidden md:flex flex-row bg-slate-600 py-3 !text-white pl-8 font-semibold'>
                <a href='/order-train' className='mr-6'>
                    Open Orders
                </a>
                <a href='/departments' className='mr-6'>
                    Categories
                </a>
                <a href='/customer-support' className='mr-6'>
                    Customer Service
                </a>
                <a href='/vendorVerification' className='!text-orange-500'>
                    Sell on Zuta
                </a>
            </div>
            <div className='md:hidden bg-slate-600 py-3'>
                <form 
                    className={"rounded-md w-[80%] max-w-[80%] mx-auto bg-gray-200 flex flex-row"}
                >
                    <input 
                        type="text" 
                        placeholder="Search for products"
                        value={searchStr}
                        onChange={(e: any) => setSearchStr(e.target.value)}
                        className="flex-grow focus:outline-none bg-transparent w-[80%] text-gray-600 text-sm pl-4 py-2" 
                    />
                    <button 
                        type="submit" 
                        onClick={(e: any) => {
                            e.preventDefault();
                            onSearch!(searchStr)
                        }}
                        className='text-gray-600 text-base bg-orange-500 px-4 py-2 rounded-r-md'
                    >
                        <HiSearch className='text-white'/>
                    </button>
                </form>
            </div>
            {
                user && !user.user_verified && (
                    <div className='bg-red-100 py-4 flex justify-center'>
                        <a href='/auth/requestEmailVerification' className='text-black font-semibold text-center text-sm'>Your email is unverified, Click here to verify your email</a>
                    </div>
                )
            }
           
            { mobileMenu &&
                <div ref={ref} className='fixed left-0 top-0 bottom-0 w-[60%] bg-white shadow-lg z-50 flex flex-col transition ease-in-out animate-in duration-500 duration-800 slide-in-from-left'>
                    <div className='bg-slate-800 py-10 px-4 text-white flex flex-col relative'>
                        <AiFillCloseCircle className='text-3xl w-fit text-white absolute right-3' onClick={() => showMobileMenu(false)}/>
                        <h2 className='font-bold text-xl mt-8 mb-4'>Zuta</h2>
                        <p className='text-sm'>Connecting Buyers and Wholesalers</p>
                    </div>
                    <div className='px-6 text-lg mt-10 text-black flex flex-col'>
                        <a href='/vendorVerification' className='mb-6'>
                            Sell
                        </a>
                        <a className='mb-6' href='/order-train'>
                            Open Orders
                        </a>

                        {
                            user?.access_token ? <>
                                <a className='mb-6' href='/profile'>
                                    Profile
                                </a> 
                                <a className='mb-6' href='/customer-support'>
                                    Customer Service
                                </a>    
                            </> :
                            <a className='mb-6' href='/auth/signIn'>
                                Sign In
                            </a>
                        }

                        <p className='text-lg font-bold text-slate-800 my-4'>Top Categories</p>

                        <a className='mb-6' href={`/results?search=groceries`}>Groceries</a>
                        <a className='mb-6' href={`/results?search=electronics`}>Electronics</a>
                        <a className='mb-6' href={`/results?search=food`}>Food stuffs</a>

                        <a className='mb-6 !text-orange-500' href='/departments'>
                            See all
                        </a>
                    </div>
                </div>
            }
        </div>
    )
}

export default Header;
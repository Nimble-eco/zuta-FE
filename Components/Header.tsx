import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { HiSearch, HiUser, HiUserAdd ,HiLogout, HiMenu } from "react-icons/hi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { AiFillCloseCircle } from "react-icons/ai";
import axios from 'axios';

interface INavBarProps {
    search?: boolean;
    onSearch?: (searchStr: string) => void;
};

export type HeaderRef = {
  updateCartCount: (count: number) => void;
};

const Header = ({search = true, onSearch}: INavBarProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    let token: string = '';
    const [mobileMenu, showMobileMenu] = useState<boolean>(false);
    const [searchStr, setSearchStr] = useState<string>('');

    const goToCartPage = () => {
        router.push(`/cart`);
    }

    const [cartCount, setCartCount] = useState(0);

    async function sendSessionData() {
        if (session) {
            try {
                await axios({
                    method: 'post',
                    url: 'http://localhost:3333/api/auth/signin',
                    data: {
                        name: session.user?.name,
                        email: session.user?.email,
                        image: session.user?.image
                    }
                })
                .then(res => {
                    if (typeof window !== "undefined") {
                        token = res.data.token;
                        localStorage.setItem('token', token);
                    }
                })
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    // SEND SESSION DATA TO BACKEND
    useEffect(() => {
        sendSessionData();
        const cart = JSON.parse(localStorage.getItem('cart')!) || [];
        setCartCount(cart?.length);
    }, [session]);


    return (
        <div
            className='flex flex-col w-full relative shadow-md'
        >
            <div className='flex flex-row w-full justify-between px-4 py-3 bg-slate-800'>
                <div className='flex flex-row my-auto'>
                    <a className='md:hidden' href='#0' onClick={() => showMobileMenu(true)}>
                        <HiMenu className='text-4xl mt-1 text-white' />
                    </a>
                    <a href='/' className=''>
                        <img
                            src="https://via.placeholder.com/100" 
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
                                onSearch!(searchStr)
                            }}
                            className='text-gray-600 text-sm hover:text-orange-500 bg-orange-500 rounded-r-md px-4'
                        >
                            <HiSearch className='text-white'/>
                        </button>
                    </form>
                }
            
                <ul className="flex flex-row my-auto justify-evenly">
                    <li className="pr-3">
                        {session ? (
                            <div className="flex flex-row">   
                                <a 
                                    href="/profile"
                                >
                                    <HiUser className="text-3xl text-white" />
                                </a>
                            
                                <a 
                                    href="#"
                                    onClick={() => signOut()}
                                >
                                    <HiLogout className="text-3xl text-white" />
                                </a>
                            </div>
                        ) : (
                            <a 
                                href="#"
                                onClick={() => signIn()}
                            >
                                <HiUserAdd className="text-3xl text-white" />
                            </a>
                        )}
                    </li>
                    <li className='flex flex-col relative' onClick={() => goToCartPage()}>
                        <span className='text-base text-orange-500 z-10 absolute -top-4 p-1  -right-2'>{cartCount}</span>
                        <MdOutlineShoppingCart 
                            className='text-3xl text-white cursor-pointer'
                        />
                    </li>
                </ul>
            </div>
            <div className='hidden md:flex flex-row bg-slate-600 py-3 !text-white pl-8 font-semibold'>
                <a href='#0' className='mr-6'>
                    Open Orders
                </a>
                <a href='#0' className='mr-6'>
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
            { mobileMenu &&
                <div className='fixed left-0 top-0 bottom-0 w-[60%] bg-white shadow-lg z-50 flex flex-col'>
                    <div className='bg-slate-800 py-10 px-4 text-white flex flex-col relative'>
                        <AiFillCloseCircle className='text-3xl w-fit text-white absolute right-3' onClick={() => showMobileMenu(false)}/>
                        <h2 className='font-bold text-xl mt-8 mb-4'>Zuta</h2>
                        <p className='text-sm'>Connecting Buyers and Wholesalers</p>
                    </div>
                    <div className='px-6 text-lg mt-10 text-black flex flex-col'>
                        <a className='mb-6'>
                            Sell
                        </a>
                        <a className='mb-6'>
                            Open Orders
                        </a>
                        <a className='mb-6'>
                            Categories
                        </a>
                        <a className='mb-6'>
                            Customer Service
                        </a>
                        <a className='mb-6'>
                            Sign In
                        </a>
                    </div>
                </div>
            }
        </div>
    )
}

export default Header;
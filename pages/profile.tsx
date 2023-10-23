import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { parse } from 'cookie';
import { ToastContainer, toast} from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import {GrTransaction} from 'react-icons/gr'
import ButtonFull from "../Components/buttons/ButtonFull";
import { BsArrowRightCircle } from 'react-icons/bs'
import Header from "../Components/Header"
import { sendAxiosRequest } from "../Utils/sendAxiosRequest";
import Image from "next/image";
import { userDummyData } from "../data/user";
import { RiHomeSmileLine } from "react-icons/ri";
import { MdOutlineRateReview, MdStore } from "react-icons/md";
import { CgMoreO } from "react-icons/cg";
import { GiPerson } from "react-icons/gi";
import TextInput from "../Components/inputs/ColumnTextInput";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { BsPersonSquare } from "react-icons/bs";
import { capitalizeFirstLetter } from "../Utils/capitalizeFirstLettersOfString";
import { GoLocation } from "react-icons/go";
import UpdateAddressModal, { IAddress } from "../Components/modals/address/UpdateAddressModal";
import NewAddressModal from "../Components/modals/address/NewAddressModal";
import { productsDummyData } from "../data/products";
import axiosInstance from "../Utils/axiosConfig";
import { formatAmount } from "../Utils/formatAmount";
import ShowOrderModal from "../Components/modals/orders/ShowOrderModal";
import { filterOrderAction } from "../requests/order/order.request";
import SimpleLoader from "../Components/loaders/SimpleLoader";
import ShowOrderTrainModal from "../Components/modals/order-train/ShowOrderTrainModal";
import { filterMyOrderTrainStatusAction, getMyOrderTrainAction } from "../requests/orderTrain/orderTrain.request";
import { statusType } from "../requests/orderTrain/orderTrain.types";
import Cookies from "js-cookie";
import { getMyVendorAction } from "../requests/vendor/vendor.request";

interface IProfilePageProps {
    profile: any;
    orders: any;
    orderTrains: any[];
    addresses: any[];
    reviews: any[];
}

function profile({profile, orders, orderTrains, addresses, reviews}: IProfilePageProps) {
    const router = useRouter();
    const {path} = router.query;
    
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(userDummyData);
    const [currentNav, setCurrentNav] = useState<string>(path?.toString() ?? 'profile');
    const [simpleOrdersData, setSimpleOrdersData] = useState(orders);
    const [orderTrainsData, setOrderTrainsData] = useState(orderTrains);
    const [orderType, setOrderType] = useState('simple');
    const [filterOrderStatus, setFilterOrderStatus] = useState('all');

    const [showNewAddressModal, setShowNewAddressModal] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>({});

    const [showAddressMore, setShowAddressMore] = useState<boolean[]>(addresses?.map(() => false));
    const [showViewOrderModal, setShowViewOrderModal] = useState(false);
    const [showViewOrderTrainModal, setShowViewOrderTrainModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>({});

    const toggleShowAddressMore = (index: number) => {
        const newArr = [...showAddressMore];
        
        newArr.map((item, i) => {
            if(i === index) newArr[i] = !newArr[i];
            else newArr[i] = false;
        });

        setShowAddressMore(newArr);
    }

    if (typeof window !== "undefined") {
        injectStyle();
    }

    let host: string = "";
    const env = process.env.ENV;
    if (env === 'production') {
        host = process.env.HOST!;
    } else {
        host = 'http://localhost'
    }

    const getPage = (page: string) => router.push(`/${page}`);

    const itemsPerPage = 8;
    const productsPages = [];

    for (let i = 0; i < productsDummyData?.length; i += itemsPerPage) {
        productsPages.push(productsDummyData.slice(i, i + itemsPerPage));
    }

    const filterSimpleOrders = async (status?: string) => {
        setIsLoading(true);
        filterOrderAction({
            user_id: profile.id,
            status
        })
        .then((response) => {
            if(response.status === 200) {
                setSimpleOrdersData(response.data?.data)
            }
            if(response.status === 204) {
                setSimpleOrdersData(response.data?.data);
                toast.error('No orders with this status');
            }
        })
        .catch(error => {
            console.log({error})
            toast.error(error.response?.message || 'Error try again later');
        })
        .finally(() => setIsLoading(false))
    }

    const filterOrderTrain = async (status?: string) => {
        setIsLoading(true);
        if(status === 'all') {
            getMyOrderTrainAction()
            .then((response) => {
                if(response.status === 200) {
                    setOrderTrainsData(response.data?.data)
                }
                if(response.status === 204) {
                    setOrderTrainsData(response.data?.data);
                    toast.error('No orders with this status');
                }
            })
            .catch(error => {
                console.log({error})
                toast.error(error.response?.message || 'Error try again later');
            })
            .finally(() => setIsLoading(false))

        } else {
         
            filterMyOrderTrainStatusAction({status: status as statusType})
            .then((response) => {
                if(response.status === 200) {
                    setOrderTrainsData(response.data?.data)
                }
                if(response.status === 204) {
                    setOrderTrainsData(response.data?.data);
                    toast.error('No orders with this status');
                }
            })
            .catch(error => {
                console.log({error})
                toast.error(error.response?.message || 'Error try again later');
            })
            .finally(() => setIsLoading(false));
        }
    }

    useEffect(() => {
        Cookies.get('currentNav') ? setCurrentNav(Cookies.get('currentNav')!) : null;
        Cookies.get('orderType') ? setOrderType(Cookies.get('orderType')!) : null;
    }, [])

    return (
        <div
            className="min-h-screen bg-gray-100"
        >
            <Header />
            <ToastContainer />
            {
                isLoading ? (
                    <SimpleLoader />
                ) : ( 
                <div>

                    {
                        showEditAddressModal && <UpdateAddressModal
                            setShow={() => setShowEditAddressModal(!showEditAddressModal)}
                            address={selectedAddress}
                        />
                    }

                    {
                        showNewAddressModal && <NewAddressModal 
                            setShow={() => setShowNewAddressModal(false)}
                        />
                    }

                    {
                        showViewOrderModal && <ShowOrderModal
                            setShow={() => setShowViewOrderModal(false)}
                            order={selectedOrder}
                        />
                    }

                    {
                        showViewOrderTrainModal && <ShowOrderTrainModal
                            setShow={() => setShowViewOrderTrainModal(false)}
                            orderTrain={selectedOrder}
                        />
                    }

                    <div className="flex flex-col text-gray-700 bg-white rounded-md py-6 mb-10 min-h-screen">
                        <div className="flex flex-row border-b border-gray-300 w-[90%] md:w-[80%] mx-auto whitespace-nowrap justify-evenly pb-3 mb-4">
                            <div 
                                className={`${currentNav === 'profile' && 'bg-orange-400 bg-opacity-25'} flex flex-row cursor-pointer px-4 pt-2 pb-1 rounded-[20px] font-medium`}
                                onClick={() => {
                                    setCurrentNav('profile');
                                    Cookies.set('currentNav', 'profile');
                                }}
                            >
                                <GiPerson className="text-xl mr-2" />
                                <p>Personal Info</p>
                            </div>
                            <div 
                                className={`${currentNav === 'vendor' && 'bg-orange-400 bg-opacity-25'} flex flex-row cursor-pointer px-4 pt-2 pb-1 rounded-[20px] font-medium`}
                                onClick={() => getPage('vendor/product/')}
                            >
                                <MdStore className="text-xl mr-2" />
                                <p>My Store</p>
                            </div>
                            <div 
                                className={`${currentNav === 'orders' && 'bg-orange-400 bg-opacity-25'} flex flex-row cursor-pointer px-4 pt-2 pb-1 rounded-[20px] font-medium`}
                                onClick={() => {
                                    setCurrentNav('orders');
                                    Cookies.set('currentNav', 'orders');
                                }}
                            >
                                <GrTransaction className="text-xl mr-2" />
                                <p>Orders</p>
                            </div>
                            <div 
                                className={`${currentNav === 'address' && 'bg-orange-400 bg-opacity-25'} flex flex-row cursor-pointer px-4 pt-2 pb-1 rounded-[20px] font-medium`}
                                onClick={() => {
                                    setCurrentNav('address');
                                    Cookies.set('currentNav', 'address');
                                }}
                            >
                                <RiHomeSmileLine className="text-xl mr-2" />
                                <p>Address</p>
                            </div>
                            <div 
                                className={`${currentNav === 'reviews' && 'bg-orange-400 bg-opacity-25'} flex flex-row cursor-pointer px-4 pt-2 pb-1 rounded-[20px] font-medium`}
                                onClick={() => {
                                    setCurrentNav('reviews');
                                    Cookies.set('currentNav', 'reviews');
                                }}
                            >
                                <MdOutlineRateReview className="text-xl mr-2" />
                                <p>Pending Reviews</p>
                            </div>
                        </div>

                        {
                            currentNav === 'profile' && (
                                <div
                                    className="flex flex-col md:flex-row justify-between w-[90%] md:w-[80%] mx-auto min-h-screen"
                                >
                                    <div 
                                        className="flex flex-col md:w-[40%] mx-auto mt-6"
                                    >
                                        <img 
                                            src={user.image || 'https://via.placeholder.com/100'}
                                            alt="profile" 
                                            className="rounded-full h-auto w-[30%] mx-auto" 
                                        />
                                        <div
                                            className="flex flex-col mt-6 w-fit mx-auto"
                                        >
                                            <div className="flex flex-row mb-3">
                                                <BsPersonSquare className='text-orange-500 text-2xl mr-2' />
                                                <h1 className="text-xl font-semibold text-gray-700">
                                                    {capitalizeFirstLetter(user.name)}
                                                </h1>
                                            </div>
                                            <div className="flex flex-row mb-3">
                                                <HiOutlineMail className="text-orange-500 text-2xl mr-2" />
                                                <h3 className="text-xl text-gray-700">
                                                    {capitalizeFirstLetter(user.email)}
                                                </h3>
                                            </div>
                                            <div className="flex flex-row mb-3">
                                                <HiOutlinePhone className="text-orange-500 text-2xl mr-2" />
                                                <h3 className="text-xl text-gray-700">
                                                    {user.phone}
                                                </h3>
                                            </div>
                                        </div>  
                                    </div>
                                    <div className="flex flex-col border border-gray-100 md:w-[60%] px-8 pb-4">
                                        <p className="text-center font-semibold border-b py-3">Personal Information</p>
                                        <form className="flex flex-col">
                                            <TextInput 
                                                label="name"
                                                value={user?.name}
                                                onInputChange={() => {}}
                                                placeHolder='Enter your name'
                                            />
                                            <TextInput 
                                                label="email"
                                                value={user?.email}
                                                onInputChange={() => {}}
                                                placeHolder='Enter your email'
                                            />
                                            <TextInput 
                                                label="phone"
                                                value={user?.phone}
                                                onInputChange={() => {}}
                                                placeHolder='Enter your Phone number'
                                            />
                                        </form>
                                        <ButtonFull 
                                            action="Save changes"
                                            onClick={() => {}}
                                        />
                                    </div>
                                </div>
                            )
                        }

                        {
                            currentNav === 'orders' && (
                            <div className="flex flex-col w-[90%] md:w-[80%] mx-auto relative">
                                <div className="flex flex-row absolute top-1 right-4 bg-gray-300 rounded-md text-sm">
                                    <div className={`${orderType === 'simple' && 'bg-gray-600 text-white text-base rounded-md'} px-4 py-2 cursor-pointer`} onClick={() => {
                                        setOrderType('simple');
                                        Cookies.set('orderType', 'simple');
                                    }}>
                                        Simple Order
                                    </div>
                                    <div className={`${orderType === 'train' && 'bg-gray-600 text-white text-base rounded-md'} px-4 py-2 cursor-pointer`} onClick={() => {
                                        setOrderType('train');
                                        Cookies.set('orderType', 'train');
                                    }}>
                                        Order Train
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row w-full mt-16">
                                    <div className="flex !flex-row md:!flex-col md:!min-h-fit mt-10 md:w-fit text-sm">
                                        <div 
                                            className={`px-4 py-1 bg-gray-200 cursor-pointer mb-2 ${filterOrderStatus === 'all' && 'bg-gray-600 text-white'}`}
                                            onClick={() => {
                                                setFilterOrderStatus('all');
                                                orderType === 'simple' ?
                                                    filterSimpleOrders() :
                                                    filterOrderTrain('all')
                                            }}
                                        >
                                            <span>All</span>
                                        </div>
                                        <div 
                                            className={`px-4 py-1 bg-gray-200 cursor-pointer mb-2 ${filterOrderStatus === 'completed' && 'bg-gray-600 text-white'}`} 
                                            onClick={() => {
                                                setFilterOrderStatus('completed');
                                                orderType === 'simple' ?
                                                    filterSimpleOrders('completed') :
                                                    filterOrderTrain('completed')
                                            }}
                                        >
                                            <span>Completed</span>
                                        </div>
                                        <div 
                                            className={`px-4 py-1 bg-gray-200 cursor-pointer mb-2 ${filterOrderStatus === 'delivered' && 'bg-gray-600 text-white'}`} 
                                            onClick={() => {
                                                setFilterOrderStatus('delivered');
                                                orderType === 'simple' ?
                                                    filterSimpleOrders('delivered') :
                                                    filterOrderTrain('delivered')
                                            }}
                                        >
                                            <span>Delivered</span>
                                        </div>
                                        <div className={`px-4 py-1 bg-gray-200 cursor-pointer mb-2 ${filterOrderStatus === 'unshipped' && 'bg-gray-600 text-white'}`} onClick={() => {
                                            setFilterOrderStatus('unshipped');
                                            orderType === 'simple' ?
                                                filterSimpleOrders('unshipped') :
                                                filterOrderTrain('unshipped')
                                        }}>
                                            <span>Unshipped</span>
                                        </div>
                                        <div className={`px-4 py-1 bg-gray-200 cursor-pointer mb-2 ${filterOrderStatus === 'shipped' && 'bg-gray-600 text-white'}`} onClick={() => {
                                            setFilterOrderStatus('shipped');
                                            orderType === 'simple' ?
                                                filterSimpleOrders('shipped') :
                                                filterOrderTrain('shipped')
                                        }}>
                                            <span>Shipped</span>
                                        </div>
                                        <div className={`px-4 py-1 bg-gray-200 cursor-pointer mb-2 ${filterOrderStatus === 'pending' && 'bg-gray-600 text-white'}`} onClick={() => {
                                            setFilterOrderStatus('pending');
                                            orderType === 'simple' ?
                                                filterSimpleOrders('pending') :
                                                filterOrderTrain('pending')
                                        }}>
                                            <span>Pending</span>
                                        </div>
                                        <div className={`px-4 py-1 bg-gray-200 cursor-pointer mb-2 ${filterOrderStatus === 'cancelled' && 'bg-gray-600 text-white'}`} onClick={() => {
                                            setFilterOrderStatus('cancelled');
                                            orderType === 'simple' ? 
                                                filterSimpleOrders('cancelled') :
                                                filterOrderTrain('cancelled')
                                        }}>
                                            <span>Cancelled</span>
                                        </div>
                                    </div>
                                    <table className="md:w-full ml-2 text-sm h-fit">
                                        <thead className="bg-gray-200 px-4">
                                            <tr className="!w-full px-4">
                                                <th className='w-[40%]'>
                                                    <p className="my-2 pl-4">
                                                        Product
                                                    </p>
                                                </th>
                                                <th className='w-[20%]'>
                                                    <p className="my-2">
                                                        Qty
                                                    </p>
                                                </th>
                                                <th className='w-[20%]'>
                                                    <p className="my-2">
                                                        Total
                                                    </p>
                                                </th>
                                                <th className='w-[20%]'>
                                                    <p className="my-2">
                                                        Status
                                                    </p>
                                                </th>
                                                <th className='w-[20%]'>
                                                    <p className="my-2 pr-4">
                                                        ...
                                                    </p>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className=''>
                                        {
                                            orderType === 'simple' ? 
                                                simpleOrdersData?.data?.length > 0 ? simpleOrdersData?.data?.map((order: any) => (
                                                    <tr className="border-b border-gray-200" key={order.id}>
                                                        <td className="">
                                                            <p className="mb-2 pl-4">{order?.product_name}</p>
                                                        </td>
                                                        <td className=""><p>{order?.quantity}</p>
                                                        </td>
                                                        <td className="">
                                                            <p className="mb-2">{formatAmount(order?.product_price_paid)}</p>
                                                        </td>
                                                        <td className="">
                                                            <p className="mb-2">{order?.status}</p>
                                                        </td>
                                                        <td className="">
                                                            <div className="my-2 pr-4">
                                                                <BsArrowRightCircle
                                                                    className="text-xl text-orange-500 cursor-pointer"
                                                                    onClick={() => {
                                                                        setSelectedOrder(order);
                                                                        setShowViewOrderModal(true);
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr
                                                        className="flex w-fit mx-auto"
                                                    >
                                                        <span
                                                            className="text-orange-600 text-xl my-8 mx-auto text-center animate-bounce"
                                                        >
                                                            No orders yet!!
                                                        </span>
                                                    </tr>
                                                ) :
                                            null
                                        }

                                        {
                                            orderType === 'train' ?
                                                orderTrainsData?.length > 0 ? orderTrainsData?.map((order: any) => (
                                                    <tr className="py-6 border-b border-gray-200" key={order.id}>
                                                        <td className="">
                                                            <p className="mb-2 pl-4">{order?.product_name}</p>
                                                        </td>
                                                        <td className=""><p>{order?.pivot_quantity ?? order?.quantity}</p>
                                                        </td>
                                                        <td className="">
                                                            <p className="mb-2">{formatAmount(order?.pivot_open_order_price_paid ?? order?.open_order_price_paid)}</p>
                                                        </td>
                                                        <td className="">
                                                            <p className="mb-2">{order?.pivot_status ?? order?.status}</p>
                                                        </td>
                                                        <td className="">
                                                            <div className="my-2 pr-4">
                                                                <BsArrowRightCircle
                                                                    className="text-xl text-orange-500 cursor-pointer"
                                                                    onClick={() => {
                                                                        setSelectedOrder(order);
                                                                        setShowViewOrderTrainModal(true);
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr
                                                        className="flex w-fit mx-auto"
                                                    >
                                                        <span
                                                            className="text-orange-600 text-xl my-10 mx-auto text-center animate-bounce"
                                                        >
                                                            No order train has been boarded!!
                                                        </span>
                                                    </tr>
                                                ) :
                                            null
                                        }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {
                            currentNav === 'address' && (
                            <div className="flex flex-col relative">
                                <div className="w-fit absolute top-0 right-4">
                                    <ButtonFull
                                        action="Add Address"
                                        onClick={() => setShowNewAddressModal(!showNewAddressModal)}
                                    />
                                </div>

                                <div className="w-[90%] md:w-[50%] mx-auto mt-10 flex flex-col">
                                    {
                                        addresses ? addresses.map((address: any, index: number) => (
                                            <div className='flex flex-col py-3 px-4 shadow-lg rounded-md mb-4' key={address.name}>
                                                <div className="flex flex-row relative">
                                                    <GoLocation className="text-xl text-gray-500 mr-2" />
                                                    <p className="text-base font-serif">{address.title}</p>
                                                    <div className="flex flex-col">
                                                        <CgMoreO 
                                                            className="text-orange-500 text-xl cursor-pointer absolute right-1 mb-2" 
                                                            onClick={() => {
                                                                setSelectedAddress(address)
                                                                toggleShowAddressMore(index)
                                                            }}
                                                        />
                                                        {
                                                            showAddressMore[index] && (
                                                                <div className="flex flex-col bg-gray-200 rounded-md py-2 px-3 text-black text-sm text-center absolute -right-4 top-6">
                                                                    <a 
                                                                        href="#0" 
                                                                        onClick={() => setShowEditAddressModal(!showEditAddressModal)}
                                                                        className='cursor-pointer hover:text-orange-500 mb-3'
                                                                    >
                                                                        Edit
                                                                    </a>
                                                                    <a 
                                                                        href="#0" 
                                                                        className='cursor-pointer hover:text-orange-500 mb-3'
                                                                    >
                                                                        Delete
                                                                    </a>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <p className="mb-0">{address?.name}</p>
                                                <p className="mb-0">{address?.address}</p>
                                            </div>
                                        )) : (
                                            <div
                                                className="flex flex-col justify-center items-center"
                                            >
                                                <Image
                                                    src='https://dl.dropbox.com/s/d2ilx96oi0612ha/undraw_a_moment_to_relax_bbpa.png?dl=0'
                                                    alt='no orders yet'
                                                    width={200}
                                                    height={200}
                                                    className='rounded-md mb-10'
                                                />
                                                <span
                                                    className="text-xl text-gray-600 font-serif"
                                                >
                                                    No Orders Yet
                                                </span>
                                            </div>
                                        )
                                    }
                                </div>
                                
                            </div>
                        )}

                        {/* PENDING PRODUCT REVIEWS SECTION */}
                        {
                            currentNav === 'reviews' && (
                            <div className="flex flex-col w-[90%] lg:w-[70%] mx-auto py-8">
                                <div className="border border-gray-100 rounded-sm px-4 py-3 flex flex-row mb-6">
                                    <div className="w-[19%] mr-[1%]">
                                        <img src="https://via.placeholder.com/100" alt="product image" />
                                    </div>
                                    <div className="flex flex-col w-full text-sm">
                                        <div className="flex flex-row justify-between mb-2 text-lg">
                                            <p className="line-clamp-1">12V Battery Charger Car Solar AGM GEL VRLA</p>
                                            <a
                                                href="#0"
                                                className="!text-orange-500 font-bold cursor-pointer text-sm ml-5"
                                            >
                                                RATE THIS PRODUCT
                                            </a>
                                        </div>
                                        <p className="font-semibold text-black">Order nº: 1877794622</p>
                                        <p className="font-thin">Delivered on 11-10-22</p>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                
                    {/* SHARE TO SOCIAL MEDIA SAMPLE */}
                    {/* <FacebookShareButton
                        url={`${host}:3333/open-orders/order/${transaction.open_order_uid}`}
                        quote={`Buy ${transaction.product_name} at wholesale discount on Zuta`}
                        hashtag={"make_we_run_am"}
                        className="mr-2"
                    >
                        <FacebookIcon size={32} round />
                    </FacebookShareButton> */}
                </div>
            )}
        </div>
    )
}

export default profile

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try{
        const getMyAddresses = await sendAxiosRequest(
          `/api/address/me`,
          "get",
          {},
          token,
          ''
        );

        const getMyProfile = await sendAxiosRequest(
            '/api/user/me',
            "get",
            {},
            token,
            ''
        );

        const getMyOrders = await sendAxiosRequest(
            '/api/order/me',
            "get",
            {},
            token,
            ''
        );

        const getMyOrderTrains = await axiosInstance.get('/api/open-order/me', {
            headers: {
                Authorization: token
            }
        });

        const getMyPendingReviews = await sendAxiosRequest(
            '/api/review/product/me',
            "get",
            {},
            token,
            ''
        );

        const getMyVendorAccount = await axiosInstance.get('/api/vendor/me', {
            headers: {
                Authorization: token
            }
        });

        const [myAddress, myProfile, myOrders, myOrderTrains, myReviews, myVendorAccount] = await Promise.allSettled([
            getMyAddresses,
            getMyProfile,
            getMyOrders,
            getMyOrderTrains,
            getMyPendingReviews,
            getMyVendorAccount
        ]);

        const addresses = myAddress.status === 'fulfilled' ? myAddress.value.data : [];
        const profile = myProfile.status === 'fulfilled' ? myProfile.value.data : [];
        const orders = myOrders.status === 'fulfilled' ? myOrders.value.data : [];
        const orderTrains = myOrderTrains.status === 'fulfilled' ? myOrderTrains.value.data.data : [];
        const reviews = myReviews.status === 'fulfilled' ? myReviews.value.data : [];
        const myVendor = myVendorAccount.status === 'fulfilled' ? myVendorAccount.value.data : [];

        return {
            props: {
                addresses,
                profile,
                orders,
                orderTrains: orderTrains,
                reviews,
                vendor: myVendor
            }
        }

    } catch(error: any) {
        console.log({error})
        if(error?.response?.status === 401) {
            return {
                redirect: {
                  destination: '/auth/signIn',
                  permanent: false
                }
            }
        }
        return {
            props: {
                addresses: [],
                profile: {},
                orders: [],
                orderTrains: [],
                reviews: [],
                vendor: {}
            }
        }
    }
}
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { parse } from 'cookie';
import { ToastContainer, toast} from "react-toastify";
import {GrTransaction} from 'react-icons/gr'
import ButtonFull from "../Components/buttons/ButtonFull";
import { BsArrowRightCircle } from 'react-icons/bs'
import Header from "../Components/Header"
import { sendAxiosRequest } from "../Utils/sendAxiosRequest";
import Image from "next/image";
import { RiHomeSmileLine } from "react-icons/ri";
import { MdOutlineRateReview, MdReviews, MdStore } from "react-icons/md";
import { CgMoreO } from "react-icons/cg";
import { GiPerson, GiShoppingCart } from "react-icons/gi";
import TextInput from "../Components/inputs/ColumnTextInput";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { BsPersonSquare } from "react-icons/bs";
import { capitalizeFirstLetter } from "../Utils/capitalizeFirstLettersOfString";
import { GoLocation } from "react-icons/go";
import UpdateAddressModal from "../Components/modals/address/UpdateAddressModal";
import NewAddressModal from "../Components/modals/address/NewAddressModal";
import axiosInstance from "../Utils/axiosConfig";
import { formatAmount } from "../Utils/formatAmount";
import ShowOrderModal from "../Components/modals/orders/ShowOrderModal";
import { filterOrderAction } from "../requests/order/order.request";
import SimpleLoader from "../Components/loaders/SimpleLoader";
import ShowOrderTrainModal from "../Components/modals/order-train/ShowOrderTrainModal";
import { filterMyOrderTrainStatusAction, getMyOrderTrainAction } from "../requests/orderTrain/orderTrain.request";
import { statusType } from "../requests/orderTrain/orderTrain.types";
import Cookies from "js-cookie";
import { updateUserAction } from "../requests/user/user.request";
import { AiFillEdit } from "react-icons/ai";
import { convertToBase64 } from "../Utils/convertImageToBase64";
import MyDropDownInput from "../Components/inputs/MyDropDownInput";
import DeleteAddressModal from "../Components/modals/address/DeleteAddressModal";
import RateProductModal from "../Components/modals/pending-reviews/RateProductModal";

interface IProfilePageProps {
    profile: any;
    orders: any;
    orderTrains: any[];
    addresses: any[];
    reviews: any;
}

function profile({profile, orders, orderTrains, addresses, reviews}: IProfilePageProps) {
    const router = useRouter();
    const {path} = router.query;
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(profile);
    const [currentNav, setCurrentNav] = useState<string>(path?.toString() ?? 'profile');
    const [simpleOrdersData, setSimpleOrdersData] = useState(orders);
    const [orderTrainsData, setOrderTrainsData] = useState(orderTrains);
    const [orderType, setOrderType] = useState('simple');
    const [filterOrderStatus, setFilterOrderStatus] = useState('all');

    const [showNewAddressModal, setShowNewAddressModal] = useState(false);
    const [showEditAddressModal, setShowEditAddressModal] = useState(false);
    const [showDeleteAddressModal, setShowDeleteAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<any>({});

    const [showAddressMore, setShowAddressMore] = useState<boolean[]>(addresses?.map(() => false));
    const [showViewOrderModal, setShowViewOrderModal] = useState(false);
    const [showViewOrderTrainModal, setShowViewOrderTrainModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>({});
    const [isVendor, setIsVendor] = useState(false);

    const [showRateProductModal, setShowRateProductModal] = useState(false);
    const [selectedPendingReview, setSelectedPendingReview] = useState<any>({});

    const handleProfileChange = (e: any) => setUser({...user, [e.target.name]: e.target.value});

    const toggleShowAddressMore = (index: number) => {
        const newArr = [...showAddressMore];
        
        newArr.forEach((item, i) => {
            if(i === index) newArr[i] = !newArr[i];
            else newArr[i] = false;
        });

        setShowAddressMore(newArr);
    }

    const getPage = (page: string) => router.push(`/${page}`);

    const selectImage = async (e: any) => {
        let base64_image = await convertToBase64(e.target.files[0]);
        setUser({...user, picture: base64_image, base64_image: base64_image});
    }

    const updateUserProfile = async () => {
        setIsLoading(true);

        updateUserAction({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            description: user.description,
            base64_image: user.base64_image
        })
        .then((response) => {
            if(response.status === 202) {
                toast.success('Profile updated')
            }
        })
        .catch(error => {
            console.log({error})
            toast.error(error.response?.message || 'Error try again later');
        })
        .finally(() => setIsLoading(false))
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
        let isMounted = true;

        if(isMounted) {
            Cookies.get('currentNav') ? setCurrentNav(Cookies.get('currentNav')!) : null;
            Cookies.get('orderType') ? setOrderType(Cookies.get('orderType')!) : null;

            const userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!): null;
            if(!userCookie) router.push('/');
            if(userCookie?.vendor) setIsVendor(true);
        }

        return () => { isMounted = false }
    }, []);

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
                        showDeleteAddressModal && <DeleteAddressModal
                            setShow={() => setShowDeleteAddressModal(!showDeleteAddressModal)}
                            id={selectedAddress.id}
                            redirect={() => router.push('/profile')}
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

                    {
                        showRateProductModal && <RateProductModal
                            order={selectedPendingReview.order}
                            orderTrain={selectedPendingReview.openOrder}
                            setShow={()=>setShowRateProductModal(false)}
                        />
                    }

                    <div className="flex flex-col text-gray-700 bg-white rounded-md py-6 mb-10 min-h-screen">
                        <div className="hidden lg:flex flex-row border-b border-gray-300 w-[90%] md:w-[80%] mx-auto whitespace-nowrap justify-evenly pb-3 mb-4">
                            <div 
                                className={`${currentNav === 'profile' && 'bg-orange-400 bg-opacity-25'} flex flex-row items-center cursor-pointer px-4 pt-2 pb-1 rounded-[20px] font-medium`}
                                onClick={() => {
                                    setCurrentNav('profile');
                                    Cookies.set('currentNav', 'profile');
                                }}
                            >
                                <GiPerson className="text-xl mr-2" />
                                <p className="mb-0">Personal Info</p>
                            </div>
                            <div 
                                className={`${currentNav === 'orders' && 'bg-orange-400 bg-opacity-25'} flex flex-row items-center cursor-pointer px-4 pt-2 pb-1 rounded-[20px] font-medium`}
                                onClick={() => {
                                    setCurrentNav('orders');
                                    Cookies.set('currentNav', 'orders');
                                }}
                            >
                                <GrTransaction className="text-xl mr-2" />
                                <p className="mb-0">Orders</p>
                            </div>
                            <div 
                                className={`${currentNav === 'address' && 'bg-orange-400 bg-opacity-25'} flex flex-row items-center cursor-pointer px-4 pt-2 pb-1 rounded-[20px] font-medium`}
                                onClick={() => {
                                    setCurrentNav('address');
                                    Cookies.set('currentNav', 'address');
                                }}
                            >
                                <RiHomeSmileLine className="text-xl mr-2" />
                                <p className="mb-0">Address</p>
                            </div>
                            <div 
                                className={`${currentNav === 'reviews' && 'bg-orange-400 bg-opacity-25'} flex flex-row items-center cursor-pointer px-4 pt-2 pb-1 rounded-[20px] font-medium`}
                                onClick={() => {
                                    setCurrentNav('reviews');
                                    Cookies.set('currentNav', 'reviews');
                                }}
                            >
                                <MdOutlineRateReview className="text-xl mr-2" />
                                <p className="mb-0">Pending Reviews</p>
                            </div>
                        </div>

                        <div className="flex lg:hidden w-[60%] mx-auto whitespace-nowrap">
                            <MyDropDownInput
                                label="Tab"
                                value={currentNav}
                                onSelect={(currentTab: any) => {
                                    setCurrentNav(currentTab.target?.value);
                                    Cookies.set('currentNav', currentTab.target?.value);
                                }}
                                options={[
                                    {name: 'profile'},
                                    {name: 'orders'},
                                    {name: 'address'},
                                    {name: 'reviews'}
                                ]}
                            />
                        </div>

                        {
                            currentNav === 'profile' && (
                                <div
                                    className="flex flex-col md:flex-row md:justify-between w-[90%] md:w-[80%] mx-auto min-h-screen"
                                >
                                    <div 
                                        className="flex flex-col gap-3 md:w-[40%] mx-auto md:my-6"
                                    >
                                        <div className="rounded-full h-24 w-24 mx-auto relative group">
                                            <img 
                                                src={user?.picture ?? 'https://via.placeholder.com/100'}
                                                alt="profile" 
                                                className="h-full w-full rounded-full object-cover object-center" 
                                            />
                                            <div className="bg-gray-500 absolute bottom-0 top-0 left-0 right-0 rounded-full bg-opacity-50 z-20 group" />
                                            <label className="cursor-pointer absolute bottom-[40%] right-[40%] z-30 hidden group group-hover:flex">
                                                <AiFillEdit className="text-2xl text-orange-500" />
                                                <input
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    className="hidden"
                                                    onChange={selectImage}
                                                />
                                            </label>
                                        </div>
                                        <div
                                            className="flex flex-col justify-center items-center md:mt-6 "
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
                                            {
                                                isVendor && <div 
                                                    className={`flex flex-row items-center cursor-pointer px-4 py-2 pb-1 rounded-[20px] font-medium bg-orange-500 bg-opacity-20 justify-center align-middle`}
                                                    onClick={() => getPage('vendor/product/')}
                                                >
                                                    <MdStore className="text-2xl mr-2" />
                                                    <p>My Store</p>
                                                </div>
                                            }
                                          
                                        </div>  
                                    </div>
                                    <div className="flex flex-col border border-gray-100 md:w-[60%] px-8 pb-4">
                                        <p className="text-center font-semibold border-b py-3">Personal Information</p>
                                        <form className="flex flex-col">
                                            <TextInput 
                                                label="name"
                                                value={user?.name}
                                                onInputChange={handleProfileChange}
                                                placeHolder='Enter your name'
                                            />
                                            <TextInput 
                                                label="email"
                                                name="email"
                                                value={user?.email}
                                                onInputChange={handleProfileChange}
                                                placeHolder='Enter your email'
                                            />
                                            <TextInput 
                                                label="phone"
                                                name='phone'
                                                value={user?.phone}
                                                onInputChange={handleProfileChange}
                                                placeHolder='Enter your Phone number'
                                            />
                                        </form>
                                        <div className="h-14 w-[60%] mx-auto">
                                            <ButtonFull 
                                                action="Save changes"
                                                loading={isLoading}
                                                onClick={updateUserProfile}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {
                            currentNav === 'orders' && (
                            <div className="flex flex-col w-[90%] md:w-[80%] mx-auto relative overflow-auto">
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
                                <div className="flex flex-row w-full mt-16">
                                    <div className="flex !flex-col md:!min-h-fit mt-10 md:w-fit text-sm">
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
                                    
                                    <table className="md:w-full ml-2 text-sm h-fit min-w-[600px] overflow-auto">
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
                                                        Price
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
                                        <tbody className='relative'>
                                        {
                                            orderType === 'simple' ? 
                                                simpleOrdersData?.data?.length > 0 ? simpleOrdersData?.data?.map((order: any) => (
                                                    <tr className="border-b border-gray-200" key={order.id}  onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowViewOrderModal(true);
                                                    }}>
                                                        <td className="">
                                                            <p className="mb-2 pl-4 capitalize">{order?.product_name}</p>
                                                        </td>
                                                        <td className=""><p>{order?.quantity}</p>
                                                        </td>
                                                        <td className="">
                                                            <p className="mb-2">{formatAmount(order?.product_price_paid)}</p>
                                                        </td>
                                                        <td className="">
                                                            <p className="mb-2">{formatAmount(order?.order_amount)}</p>
                                                        </td>
                                                        <td className="">
                                                            <p className="mb-2 capitalize">{order?.status}</p>
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
                                                    <div
                                                        className="flex flex-col justify-center items-center w-fit mx-auto absolute top-1/2 left-6 md:!center-absolute-el"
                                                    >
                                                        <GiShoppingCart className="text-6xl mt-8"/>
                                                        <span
                                                            className="text-xl text-center font-medium"
                                                        >
                                                            No orders yet!
                                                        </span>
                                                    </div>
                                                ) :
                                            null
                                        }

                                        {
                                            orderType === 'train' ?
                                                orderTrainsData?.length > 0 ? orderTrainsData?.map((order: any) => (
                                                    <tr className="py-6 border-b border-gray-200" key={order.id}  onClick={() => {
                                                        setSelectedOrder(order);
                                                        setShowViewOrderTrainModal(true);
                                                    }}>
                                                        <td className="">
                                                            <p className="mb-2 pl-4 capitalize">{order?.product_name}</p>
                                                        </td>
                                                        <td className=""><p>{order?.pivot_quantity ?? order?.quantity}</p>
                                                        </td>
                                                        <td className="">
                                                            <p className="mb-2">{formatAmount(order?.pivot_open_order_price_paid ?? order?.open_order_price_paid)}</p>
                                                        </td>
                                                        <td className="">
                                                            <p className="mb-2">{formatAmount(order?.pivot_order_amount ?? order?.order_amount)}</p>
                                                        </td>
                                                        <td className="">
                                                            <p className="mb-2 capitalize">{order?.pivot_status ?? order?.status}</p>
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
                                                    <div
                                                        className="flex flex-col justify-center items-center w-fit mx-auto absolute top-1/2 left-6 md:!center-absolute-el"
                                                    >
                                                        <GiShoppingCart className="text-6xl mt-8"/>
                                                        <span
                                                            className="text-xl text-center font-medium"
                                                        >
                                                            No order train yet!
                                                        </span>
                                                    </div>
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
                                <div className="flex w-fit absolute top-0 center-absolute-el h-10">
                                    <ButtonFull
                                        action="Add Address"
                                        onClick={() => setShowNewAddressModal(!showNewAddressModal)}
                                    />
                                </div>

                                <div className="w-[90%] md:w-[50%] mx-auto mt-16 flex flex-col">
                                    {
                                        addresses && addresses?.length > 0 ? addresses?.map((address: any, index: number) => (
                                            <div className='flex flex-col py-3 px-4 shadow-lg rounded-md mb-4' key={address.name}>
                                                <div className="flex flex-row relative items-center">
                                                    <GoLocation className="text-xl text-orange-500 mr-2" />
                                                    <p className="text-base mb-0 capitalize font-semibold">{address.title}</p>
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
                                                                        onClick={() => setShowDeleteAddressModal(!showDeleteAddressModal)}
                                                                        className='cursor-pointer hover:text-orange-500 mb-3'
                                                                    >
                                                                        Delete
                                                                    </a>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <p className="mb-0 capitalize">{address?.name}</p>
                                                <p className="mb-0">{address?.address}</p>
                                            </div>
                                        )) : (
                                            <div
                                                className="flex flex-col gap-1 justify-center items-center"
                                            >
                                                <Image
                                                    src='https://dl.dropbox.com/s/d2ilx96oi0612ha/undraw_a_moment_to_relax_bbpa.png?dl=0'
                                                    alt='no orders yet'
                                                    width={200}
                                                    height={200}
                                                    className='rounded-md mb-10'
                                                />
                                                <span
                                                    className="text-base lg:text-xl text-gray-600 font-serif"
                                                >
                                                    No Address has been saved Yet
                                                </span>
                                                <div className="flex lg:hidden w-[70%] mx-auto">
                                                    <ButtonFull
                                                        action="Add Address"
                                                        onClick={() => setShowNewAddressModal(!showNewAddressModal)}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }
                                </div>
                                
                            </div>
                        )}

                        {/* PENDING PRODUCT REVIEWS SECTION */}
                        {
                            currentNav === 'reviews' && (
                            <div className="flex flex-col w-[90%] lg:w-[70%] mx-auto">
                                {
                                    reviews?.data?.length ?
                                    reviews?.data?.map((review: any) => (
                                        <div className="border border-gray-100 rounded-md px-4 py-3 flex flex-row mb-6" key={review.id}>
                                            <div className="w-[19%] mr-[1%]">
                                                <img src={review?.product?.product_images[0] ?? "https://via.placeholder.com/100"} alt="product image" className="object-center object-cover rounded-md" />
                                            </div>
                                            <div className="flex flex-col w-full text-sm">
                                                <div className="flex flex-row justify-between mb-2 lg:text-lg">
                                                    <p className="line-clamp-1 capitalize mb-0">{review?.product?.product_name}</p>
                                                    <a
                                                        href="#0"
                                                        className="!text-orange-500 font-bold cursor-pointer whitespace-nowrap !text-xs lg:!text-sm ml-5"
                                                        onClick={()=>{
                                                            setSelectedPendingReview(review);
                                                            setShowRateProductModal(true);
                                                        }}
                                                    >
                                                        RATE THIS PRODUCT
                                                    </a>
                                                </div>
                                                <p className="font-semibold text-black mb-0">Order nº: {review?.order?.id ?? review?.openOrder?.id}</p>
                                                <p className="font-thin">Delivered on {new Date(review?.order?.delivered_on).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="flex flex-col gap-4 py-4 justify-center items-center">
                                            <MdReviews className="h-24 w-24" />
                                            <p className="font-semibold text-lg">No pending reviews</p>
                                        </div>
                                    )
                                }
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
            '/api/pending/reviews/me',
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
        console.log({reviews})
        return {
            props: {
                addresses,
                profile,
                orders,
                orderTrains: orderTrains,
                reviews: reviews ?? {},
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
                reviews: {},
                vendor: {}
            }
        }
    }
}
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ToastContainer,} from "react-toastify";
import {GrTransaction, GrCatalog} from 'react-icons/gr'
import ButtonFull from "../Components/buttons/ButtonFull";
import ButtonGhost from "../Components/buttons/ButtonGhost";
import H2 from "../Components/H2";
import Header from "../Components/Header"
import Loader from "../Components/Loader";
import { notify } from "../Utils/displayToastMessage";
import { sendAxiosRequest } from "../Utils/sendAxiosRequest";
import Image from "next/image";
import { getGoogleAddressPredictions } from "../Utils/getPredictedAddress";
import { getAddressDetailsFromGoogleAPI } from "../Utils/getAddressDetailsFromGoogle";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
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
import UpdateAddressModal from "../Components/modals/address/UpdateAddressModal";
import NewAddressModal from "../Components/modals/address/NewAddressModal";
import { ordersDummyData } from "../data/orders";
import MyTable from "../Components/tables/MyTable";
import { productsDummyData } from "../data/products";
import { transactionsDummyData } from "../data/transactions";
import FilterAndSearchGroup from "../Components/inputs/FilterAndSearchGroup";


function profile() {
    const router = useRouter();
    let token: string;
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<any>(userDummyData);

    const [showAddressMore, setShowAddressMore] = useState<boolean[]>(user?.address?.map(() => false));

    const toggleShowAddressMore = (index: number) => {
        const newArr = [...showAddressMore];
        
        newArr.map((item, i) => {
            if(i === index) newArr[i] = !newArr[i];
            else newArr[i] = false;
        });

        setShowAddressMore(newArr);
    }

    const [vendor, setVendor] = useState<any>({});
    const [transactions, setTransactions] = useState<any[]>();
    if (typeof window !== "undefined") {
        token = localStorage.getItem('token')!;
    }

    let host: string = "";
    const env = process.env.ENV;
    if (env === 'production') {
        host = process.env.HOST!;
    } else {
        host = 'http://localhost'
    }

    const getPage = (page: string) => {
        router.push(`/${page}`);
    }

    const [userAddress, setUserAddress] = useState<any[]>([{
        type: ' ',
        address: {}
    }]);

    const [vendorAddress, setVendorAddress] = useState<any>({ });

    const getUser = async () => {
        const res = await sendAxiosRequest(
            '/api/auth/profile/me',
            "post",
            {},
            token,
            ''
        );
        if(res.message != "User loggedin") router.push('/signIn');
        else {
            setUser(res.user[0]);
            if(res.user[0].address && res.user[0].address.length > 0) setUserAddress(res.user[0].address);
            setIsLoading(false);
        }        
    }

    const getVendorProfile = async () => {
        const res = await sendAxiosRequest(
            '/api/vendors/profile/me',
            "post",
            {},
            token,
            ''
        );
        setVendor(res.vendor);
        setVendorAddress(res.vendor?.vendor_address);
    }
    

    const updateVendorAddress = async (placeId: string) => {
        let res = await getAddressDetailsFromGoogleAPI(placeId);
        setVendorAddress(res);
    }
    
    const handleAddressChange = ( index: number, type: string, address: object) => {
        let addresses = [...userAddress];
        addresses[index] = {type, address};
        setUserAddress(addresses)
    }

    const saveUserAddress = async () => {
        setIsLoading(true);
        const res = await sendAxiosRequest(
            '/api/profile/address/save',
            'post',
            {address: userAddress},
            token,
            ''
        );
        setIsLoading(false);
        if(res.status === 201 ){
            notify('Address saved');
        }
    }

    const saveVendorAddress = async () => {
        setIsLoading(true);
        const res = await sendAxiosRequest(
            '/api/vendor/profile/address/save',
            'post',
            vendorAddress,
            token,
            ''
        );
        setIsLoading(false);
        if(res.status === 201 ){
            notify('Address saved');
        }
    }

    const getUserTransactions = async () => {
        const res = await sendAxiosRequest(
            '/api/customer/orders/all',
            'get',
            {},
            token,
            ''
        );
        if(res.status === 200) setTransactions(res.transactions.splice(1,5));
    }

    const [currentProductPage, setCurrentProductPage] = useState(0);

    const itemsPerPage = 8;
    const productsPages = [];

    for (let i = 0; i < productsDummyData?.length; i += itemsPerPage) {
        productsPages.push(productsDummyData.slice(i, i + itemsPerPage));
    }

    
    const [currentTransactionsPage, setCurrentTransactionsPage] = useState(0);

    const transactionsPages = [];

    for (let i = 0; i < transactionsDummyData?.length; i += itemsPerPage) {
        transactionsPages.push(transactionsDummyData.slice(i, i + itemsPerPage));
    }

    // PRODUCT FUNCTIONS
    const searchProducts = (value: string) => {}

    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);

    // useEffect(() => {
    //     getUser();
    //     getVendorProfile();
    //     getUserTransactions();
    // }, []);

    return (
        <div
            className="min-h-screen bg-gray-100"
        >
            <Header />
            <ToastContainer />
            {
                isLoading ? (
                    <Loader />
                ) : ( <div>

                    <UpdateAddressModal
                        show={false}
                        setShow={() => false}
                        address={user.address[0]}
                        index={1}
                        getAddressDetails={() => {}}
                        handleChange={() => {}}
                        updateAddress={saveUserAddress}
                    />

                    <NewAddressModal 
                        show={false}
                        setShow={() => false}
                    />
                <div className="flex flex-col text-gray-700 bg-white rounded-md py-6 mb-10">
                    <div className="flex flex-row border-b border-gray-300 w-[90%] md:w-[80%] mx-auto justify-evenly pb-3 mb-4">
                        <div 
                            className="flex flex-row cursor-pointer"
                        >
                            <GiPerson className="text-xl mr-2" />
                            <p>Personal Info</p>
                        </div>
                        <div 
                            className="flex flex-row cursor-pointer"
                            onClick={() => getPage('vendor/product/')}
                        >
                            <MdStore className="text-xl mr-2" />
                            <p>My Store</p>
                        </div>
                        <div 
                            className="flex flex-row cursor-pointer"
                        >
                            <GrTransaction className="text-xl mr-2" />
                            <p>Orders</p>
                        </div>
                        <div 
                            className="flex flex-row cursor-pointer"
                        >
                            <RiHomeSmileLine className="text-xl mr-2" />
                            <p>Address</p>
                        </div>
                        <div 
                            className="flex flex-row cursor-pointer"
                        >
                            <MdOutlineRateReview className="text-xl mr-2" />
                            <p>Pending Reviews</p>
                        </div>
                    </div>

                    <div
                        className="flex flex-col md:flex-row justify-between w-[90%] md:w-[80%] mx-auto"
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

                    <div className="flex flex-col md:flex-row w-[90%] md:w-[80%] mx-auto mt-8">
                        <div className="flex !flex-row md:!flex-col md:!min-h-fit md:w-fit">
                            <div className="px-4 py-3 bg-gray-200 cursor-pointer mb-2">
                                <span>Unshipped</span>
                            </div>
                            <div className="px-4 py-3 bg-gray-200 cursor-pointer mb-2">
                                <span>Shipped</span>
                            </div>
                            <div className="px-4 py-3 bg-gray-200 cursor-pointer mb-2">
                                <span>Pending</span>
                            </div>
                            <div className="px-4 py-3 bg-gray-200 cursor-pointer mb-2">
                                <span>Cancelled</span>
                            </div>
                        </div>
                        <table className="md:w-full ml-2 text-sm">
                            <thead className="">
                                <tr className="!w-full">
                                    <th className='w-[40%]'>Product</th>
                                    <th className='w-[20%]'>Qty</th>
                                    <th className='w-[20%]'>Total</th>
                                    <th className='w-[20%]'>Status</th>
                                </tr>
                            </thead>
                            <tbody className='pt-6 gap-y-10'>
                            {
                                ordersDummyData.map((order: any) => (
                                    <tr className="py-6 border-b border-gray-200" key={order.order_id}>
                                        
                                            <td className="">{order?.product_name}</td>
                                            <td className="">{order?.quantity}</td>
                                            <td className="text-orange-500 ">{order?.total_amount}</td>
                                            <td className="">{order?.status}</td>
                                            <td className="">
                                                <ButtonFull 
                                                    action="Track"
                                                    onClick={() => {}}
                                                />
                                            </td>
                                        
                                    </tr>
                                ))
                            }
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col w-[90%] md:w-[50%] mx-auto mt-8">
                        {
                            user?.address?.map((address: any, index: number) => (
                                <div className='flex flex-col py-3 px-4 shadow-lg rounded-md mb-4' key={address.name}>
                                    <div className="flex flex-row relative mb-2">
                                        <GoLocation className="text-xl text-gray-500 mr-2" />
                                        <p className="text-base font-serif">{address.title}</p>
                                        <div className="flex flex-col">
                                            <CgMoreO 
                                                className="text-orange-500 text-xl cursor-pointer absolute right-1 mb-2" 
                                                onClick={() => toggleShowAddressMore(index)}
                                            />
                                            {
                                                showAddressMore[index] && (
                                                    <div className="flex flex-col bg-gray-200 rounded-md py-2 px-3 text-black text-sm text-center absolute right-0 top-6">
                                                        <a 
                                                            href="#0" 
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
                                    <p className="">{address?.name}</p>
                                </div>
                            ))
                        }
                        
                    </div>

                    {/* PENDING PRODUCT REVIEWS SECTION */}
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

                </div>

                {
                    vendor?.vendor_uid && (
                        <div className="flex flex-col text-gray-700 bg-white rounded-md py-6 my-10">
                            <div
                                className="flex flex-col"
                            >
                                    <H2 heading="Business Profile" />
                                <div
                                    className="flex flex-row justify-between w-[80%] mx-auto"
                                >
                                    <div 
                                        className="flex flex-row justify-start ml-[5%] mb-10"
                                    >
                                        <img 
                                            src={vendor.image}
                                            alt="profile" 
                                            className="rounded-full h-auto w-24" 
                                        />
                                        <div
                                            className="flex flex-col justify-start pl-5"
                                        >
                                            <h1 
                                                className="text-xl font-semibold text-gray-700"
                                            >
                                                {vendor.vendor_name}
                                            </h1>
                                            <h3 
                                                className="text-xl text-gray-700"
                                            >
                                                {vendor.vendor_email}
                                            </h3>
                                            <h3 
                                                className="text-xl text-gray-700"
                                            >
                                                {vendor.vendor_phone}
                                            </h3>
                                        </div>  
                                    </div>
                                    <div
                                        className="flex flex-col justify-start"
                                    >
                                        <div
                                            onClick={() => getPage(`vendorOrdersPage?token=${token}&vendorId=${vendor.vendor_uid}`)}
                                            className="flex flex-col pb-4 cursor-pointer md:flex-row group"
                                        >
                                            <GrTransaction className="text-2xl text-gray-500 mb-2 mx-2 group-hover:text-orange-500" />
                                            <span
                                                className="text-lg text-gray-500 group-hover:text-orange-500"
                                            >
                                                Orders
                                            </span>
                                        </div>
                                        <div
                                            onClick={() => getPage(`vendorCatalogue?token=${token}&vendorId=${vendor.vendor_uid}`)}
                                            className="flex flex-col group cursor-pointer md:flex-row hover:text-orange-500"
                                        >
                                            <GrCatalog className="text-2xl text-gray-500 mb-2 mx-2 group-hover:text-orange-500" />
                                            <span
                                                className="text-lg text-gray-500 group-hover:text-orange-500"
                                            >
                                                Catalogue
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                      )
                    }    

                <div
                    className="flex flex-col justify-center bg-white py-5 mb-5"
                >
                    <H2 heading="Transactions" />
                    {
                        transactions?.map((transaction: any) => (
                            <div
                                className="flex flex-row justify-between py-2 px-7 pt-2 rounded-md shadow-md w-[80%] mx-auto border-b-2 border-gray-500 mb-5"
                            >
                                <div
                                    className="flex flex-col cursor-pointer"
                                >
                                    <span
                                        className="text-gray-700 text-lg hover:border-b-2 border-gray-600"
                                    >
                                        {transaction.product_name}
                                    </span>
                                    <span
                                        className="text-gray-500 text-base"
                                    >
                                        {transaction.date_of_order}
                                    </span>
                                </div>
                                <div
                                    className="flex flex-row pt-2 text-center"
                                >
                                    <span
                                        className="text-gray-700 text-base"
                                    >
                                        {transaction.total_price}
                                    </span>
                                    <span className="mx-1">
                                        &#124;
                                    </span>
                                    <span
                                        className="text-gray-500 text-base"
                                    >
                                        {transaction.order_count}
                                    </span>
                                </div>
                                <div
                                    className="flex flex-row"
                                >
                                    <FacebookShareButton
                                        url={`${host}:3333/open-orders/order/${transaction.open_order_uid}`}
                                        quote={`Buy ${transaction.product_name} at wholesale discount on Zuta`}
                                        hashtag={"make_we_run_am"}
                                        className="mr-2"
                                    >
                                        <FacebookIcon size={32} round />
                                    </FacebookShareButton>

                                    <TwitterShareButton
                                        title={`Buy ${transaction.product_name} at wholesale discout on webuy`}
                                        url={`${host}:3333/open-orders/order/${transaction.open_order_uid}`}
                                        hashtags={["make_we_run_am", "webuy"]}
                                        className="mr-2"
                                    >
                                        <TwitterIcon size={32} round />
                                    </TwitterShareButton>
                                    <WhatsappShareButton 
                                        title={`Buy ${transaction.product_name} at wholesale discout on webuy`}
                                        url={`${host}:3333/open-orders/order/${transaction.open_order_uid}`}
                                        className="rounded-full"
                                    >
                                        <WhatsappIcon size={32} />
                                    </WhatsappShareButton>
                                </div> 
                            </div>
                        ))
                    } 
                    {
                        transactions?.length! > 0 && (
                            <ButtonFull 
                                action="more"
                                onClick={() => getPage('transactions')}
                            />
                        )
                    }
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
                </div>
            </div>
                )
            }
        </div>
    )
}

export default profile

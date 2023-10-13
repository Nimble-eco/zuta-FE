import { useEffect, useState } from "react"
import { injectStyle } from "react-toastify/dist/inject-style";
import { ToastContainer,} from "react-toastify";
import { sendAxiosRequest } from "../Utils/sendAxiosRequest";
import { useRouter } from "next/router";
import Loader from "../Components/Loader";
import Header from "../Components/Header";
import { notify } from "../Utils/displayToastMessage";
import { getGoogleAddressPredictions } from "../Utils/getPredictedAddress";
import { getAddressDetailsFromGoogleAPI } from "../Utils/getAddressDetailsFromGoogle";

const vendorVerification = () => {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    let token: string;
    if (typeof window !== "undefined") {
        injectStyle();
        token = localStorage.getItem('token')!;
    }

    const [user, setUser] = useState<any>({});

    const getUser = async () => {
        try {
            setIsLoading(true);
            const res = await sendAxiosRequest(
                '/api/auth/profile/me',
                "post",
                {},
                token,
                ''
            );
            setIsLoading(false);
            if(res.message != "User loggedin") router.push('/signIn');
            else {
                setUser(res.user[0]);
                setAuthenticated(true);
            }
        } catch (error) {
            router.push('/signIn');
        }
    }

    useEffect(() => {
    //    getUser();
    }, []);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [ownerAddress, setOwnerAddress] = useState({});
    const [vendorAddress, setVendorAddress] = useState({})

    // AUTOCOMPLETE USER ADDRESS WITH GOOGLE API
    const [predictedAddress, setPredictedAddress] = useState<string[]>([]);
    const getAddressPredictions =async (input :string) => {
        const predictedAddresses = await getGoogleAddressPredictions(input);
        setPredictedAddress(predictedAddresses);
    }

    // SET ADDRESS DETAILS
    const getAddressDetails = async (placeId :string, type: string) => {
        let res = await getAddressDetailsFromGoogleAPI(placeId);
        if(type === "vendor") setVendorAddress(res);
        else setOwnerAddress(res);
    }


    const [vendorVerificationDataState, setVendorVerificationDataState] = useState<any>({
        owner_name: '',
        owner_address: ownerAddress,
        owner_email: '',
        owner_bvn: "",
        business_name: "",
        vendor_address: vendorAddress,
        business_email: "",
        business_tin: "",
        cac_reg_id: "",

    });


    const handleChange = (e: any) => {
        const value = e.target.value;
        setVendorVerificationDataState({
            ...vendorVerificationDataState,
            [e.target.name] : value
        });
    }

    const [nextFormGroup, setNextFormGroup] = useState(false);
    const showNextForm = (e: any) => {
        e.preventDefault();
        // if(vendorVerificationDataState.owner_name == '')return notify("Name is required");
        // else if(vendorVerificationDataState.owner_address.length == 0) notify("Your address is important");
        // else if(vendorVerificationDataState.owner_bvn.length < 11) notify("Input proper BVN");
        // else {
            setNextFormGroup(true);
        // }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if(vendorVerificationDataState.business_name === "") notify("Business name is required");
        if(vendorVerificationDataState.vendor_address.length === 0) notify("Business address is important");
        else if (vendorVerificationDataState.cac_reg_id === "") notify("CAC ID is required");
        else {
            setIsLoading(true);
            const data = {
                ...vendorVerificationDataState,
                owner_email: user.email,
            }
            const res = await sendAxiosRequest(
                "/api/vendor/shop/open",
                "post",
                data,
                token,
                ''
            );
            setIsLoading(false);
            if (res.status === 200) {
                notify("Information has been saved");
                router.push('/profile');   
            }
        }
    }

   
  return (
    <div
        className='bg-gray-100 min-h-screen'
    >
        <Header />

        {isLoading && <Loader />}
        <div className="flex flex-row w-full">
            <div className="hidden lg:flex flex-col lg:w-[50%]">
                <div className="w-[70%] h-[60%] mx-auto my-auto">
                    <img 
                        src='/images/undraw_certification.svg'
                        alt="sell on zuta"
                        className="w-full h-[80%]"
                    />
                    <p className="text-sm mt-4">We use your BVN to verify your identity, your BVN is not stored anywhere on our service</p>
                </div>
            </div>

            <div
                className="w-full lg:w-[50%] px-5 bg-white py-5"
            >
                <h2
                    className="text-center text-2xl font-bold font-serif text-orange-500 mt-5 mb-6"
                >
                    Start Your verification Process
                </h2>

                <form
                    className="flex flex-col lg:w-[80%] lg:mx-auto"
                >
                    {
                        !nextFormGroup && 

                        <div
                            className="flex flex-col"
                        >
                            <div
                                className='flex justify-start py-3 border border-orange-300 mb-6 pl-3'
                            >
                                <h2
                                    className='font-mono text-orange-300 text-xl'
                                >
                                    Personal Information
                                </h2>
                            </div>
                            <div
                                className="w-full flex flex-col mb-5"
                            >
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="owner_name"
                                >
                                    Business Owner Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="owner_name"
                                    type="text"
                                    name="owner_name"
                                    onChange={(e) => handleChange(e)}
                                    placeholder='Enter your name'
                                    value={vendorVerificationDataState.owner_name || ''}
                                />
                            </div>
                            <div
                                className="w-full flex flex-col mb-5"
                            >
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="owner_address"
                                >
                                    Address
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="Address"
                                    type="text"
                                    name="owner_address"
                                    onChange={(e) =>  getAddressPredictions(e.target.value)}
                                    placeholder="Enter your address"
                                />
                            </div>
                            {
                                predictedAddress.length > 0 && predictedAddress.map((address: any, index: any) => (
                                    <div
                                        className="flex flex-row items-center border-b border-gray-200 py-3"
                                        key={index}
                                        onClick={() => getAddressDetails(address.place_id, 'owner')}
                                    >
                                        <span
                                            className="text-gray-800 m-0"
                                        >
                                            {address.description}
                                        </span>
                                        <button
                                            className="bg-orange-500 text-white px-2 py-1 rounded-md"
                                        >
                                            Select
                                        </button>
                                    </div>
                                ))
                            }
                            <div
                                className="w-full flex flex-col mb-5"
                            >
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="owner_email"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="owner_email"
                                    placeholder="Enter your email"
                                    value={user?.email!}
                                    onChange={(e) => handleChange(e)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div
                                className="w-full flex flex-col mb-5"
                            >
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="owner_bvn"
                                >
                                    Bank verification number
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="BVN"
                                    type="text"
                                    placeholder="Enter your BVN"
                                    name='owner_bvn'
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                            <button
                                onClick={(e) => showNextForm(e)}
                                className="hover:bg-orange-700 hover:text-white text-orange-300 font-bold py-2 px-4 w-[30%] ml-[65%] rounded-full mb-10 xs:border-0 sm:!border border-orange-700 focus:outline-none focus:shadow-outline"
                            >
                                Continue
                            </button>
                        </div>
                    }
                    
                    { nextFormGroup && (
                        <div className="flex flex-col">
                            <div className='flex justify-start py-3 border border-orange-700 mb-6 pl-3'>
                                <h2 className='font-mono text-orange-300 text-xl'>
                                    Business Information
                                </h2>
                            </div>
                        
                            <div className="flex flex-col">
                                <div
                                    className="w-full flex flex-col mb-5"
                                >
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="business_name"
                                    >
                                        Business Name
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="business_name"
                                        type="text"
                                        placeholder="Enter your business name"
                                        name="business_name"
                                        onChange={(e) => handleChange(e)}
                                    />
                                </div>
                                <div
                                    className="w-full flex flex-col mb-5"
                                >
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="vendor_address"
                                    >
                                        Business Address
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="business_address"
                                        type="text"
                                        placeholder="Enter your business address"
                                        name="vendor_address"
                                        onChange={(e) =>  getAddressPredictions(e.target.value)}
                                    />
                                </div>
                                {
                                    predictedAddress.length > 0 && predictedAddress.map((address: any, index: any) => (
                                        <div
                                            className="flex flex-row items-center border-b border-gray-200 py-3"
                                            key={index}
                                            onClick={() => getAddressDetails(address.place_id, 'vendor')}
                                        >
                                            <span
                                                className="text-gray-800 m-0"
                                            >
                                                {address.description}
                                            </span>
                                            <button
                                                className="bg-orange-500 text-white px-2 py-1 rounded-md"
                                            >
                                                Select
                                            </button>
                                        </div>
                                    ))
                                }
                                <div
                                    className="w-full flex flex-col mb-5"
                                >
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="business_email"
                                    >
                                        Business Email
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="business_email"
                                        type="email"
                                        placeholder="Enter your business email"
                                        name="business_email"
                                        onChange={(e) => handleChange(e)}
                                    />
                                </div>
                                <div className="w-full flex flex-col mb-5">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="business_tin"
                                    >
                                        Business Tax ID
                                        <span
                                            className='text-gray-500 pl-2 font-normal italic'
                                        >
                                            optional
                                        </span>
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="business_tin"
                                        type="text"
                                        placeholder="Enter your business tax id"
                                        name="business_tin"
                                        onChange={(e) => handleChange(e)}
                                    />
                                </div>
                                <div className="w-full flex flex-col mb-5">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="cac-id"
                                    >
                                        CAC Registration Number
                                    
                                    </label>
                                    <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="cac_reg_id"
                                        type="text"
                                        placeholder="Enter your CAC reg number"
                                        name="cac_reg_id"
                                        onChange={(e) => handleChange(e)}
                                    />
                                </div>
                                <button
                                    onClick={(e) => handleSubmit(e)}
                                    className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 w-[40%] mx-auto rounded-full mb-10 focus:outline-none focus:shadow-outline"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    )}
                </form>
                <ToastContainer />
            </div>
        </div>
        
    </div>
  )
}


export default vendorVerification
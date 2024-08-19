import { useState } from "react"
import { ToastContainer, toast} from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import { useRouter } from "next/router";
import Header from "../Components/Header";
import { notify } from "../Utils/displayToastMessage";
import { storeVendorVerificationAction } from "../requests/vendorVerification/vendorVerification.request";
import ButtonFull from "../Components/buttons/ButtonFull";
import VerificationSuccessModal from "../Components/modals/vendorVerification/VerificationSuccessModal";
import Cookies from "js-cookie";
const NaijaStates = require('naija-state-local-government');

const vendorVerification = () => {
    const states = NaijaStates.states();
    const [showApplicationSuccessModal, setShowApplicationSuccessModal] = useState(false);
    
    if (typeof window !== "undefined") {
        injectStyle();
    }

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [vendorVerificationDataState, setVendorVerificationDataState] = useState<any>({
        full_name: '',
        email: '',
        phone: '',
        type: '',
        bvn: "",
        business_name: "",
        business_email: "",
        cac_reg_number: "",
        tax_id: "",
        country: 'nigeria',
        state: '',
        pictures: []
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
        if(vendorVerificationDataState.full_name == '')return notify("Name is required");
        else if(!vendorVerificationDataState.email) notify("Your email is required");
        else if(!vendorVerificationDataState.phone) notify("Your phone number is required");
        else if(!vendorVerificationDataState.type) notify("Select a business type");
        else {
            setNextFormGroup(true);
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if(vendorVerificationDataState.business_name === "") notify("Business name is required");
        if(vendorVerificationDataState.business_email === "") notify("Business email is required");
        if(vendorVerificationDataState.country === "") notify("Country is required");
        if(vendorVerificationDataState.state === "") notify("State is required");

        else {
            setIsLoading(true);
            const data = {...vendorVerificationDataState}

            await storeVendorVerificationAction(data)
            .then((res) => {
                if (res.status === 201) {
                    toast.success("Information has been saved");
                    Cookies.set('user', JSON.stringify(res.data.data))
                    setShowApplicationSuccessModal(true);   
                }
            })
            .catch(error => {
                console.log({error})
                toast.error(error.response?.data?.message || 'Error try again later');
            })
            .finally(() => setIsLoading(false));
        }
    }

   
  return (
    <div
        className='bg-gray-100 min-h-screen'
    >
        <Header />
        <ToastContainer />

        {
            showApplicationSuccessModal && <VerificationSuccessModal 
                setShow={() => setShowApplicationSuccessModal(false)}
            />
        }

        <div className="flex flex-col lg:flex-row w-full">
            <div className="flex flex-col lg:w-[50%]">
                <div className="flex flex-col justify-center pt-8 gap-4 w-[80%] lg:w-[70%] mx-auto">
                    <div className="hidden lg:flex h-44 flex-row items-center gap-4 w-full bg-orange-500 rounded-md">
                        <div className="text-white w-1/2 flex items-center justify-center">
                            <h2 className="font-semibold text-3xl">Sell on <br /> Zuta</h2>
                        </div>
                        <div className=" w-1/2">
                            <img 
                                src='/images/undraw_web_shopping.svg'
                                className="w-[90%]"
                            />
                        </div>
                    </div>
                    <p className="text-center font-semibold text-black mb-0">Why sell on Zuta?</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex h-14 justify-center items-center rounded-md bg-red-600 text-white font-medium text-center text-xs lg:text-base">
                            Connect with more buyers
                        </div>
                        <div className="flex h-14 justify-center items-center rounded-md bg-red-600 text-white font-medium text-center text-xs lg:text-base">
                            Sell more product
                        </div>
                        <div className="flex h-14 justify-center items-center rounded-md bg-red-600 text-white font-medium text-center text-xs lg:text-base">
                            Product delivery on us
                        </div>
                        <div className="flex h-14 justify-center items-center rounded-md bg-red-600 text-white font-medium text-center text-xs lg:text-base">
                            Make more money
                        </div>
                        <div className="flex h-14 justify-center items-center rounded-md bg-red-600 text-white font-medium text-center text-xs lg:text-base">
                            Benefit from our marketting
                        </div>
                        <div className="flex h-14 justify-center items-center rounded-md bg-red-600 text-white font-medium text-center text-xs lg:text-base">
                            Seller support
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="w-full lg:w-[50%] px-5 bg-white py-5"
            >
                <form
                    className="flex flex-col lg:w-[80%] lg:mx-auto"
                >
                    {
                        !nextFormGroup && 

                        <div
                            className="flex flex-col !gap-4"
                        >
                            <div
                                className='flex justify-start py-1 border border-orange-300 mb-6 pl-3'
                            >
                                <h2
                                    className='text-orange-300 text-xl'
                                >
                                    Personal Information
                                </h2>
                            </div>
                            <div
                                className="w-full flex flex-col"
                            >
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="full_name"
                                >
                                    Business Owner Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="full_name"
                                    type="text"
                                    name="full_name"
                                    onChange={(e) => handleChange(e)}
                                    placeholder='Enter your name'
                                    value={vendorVerificationDataState.full_name || ''}
                                />
                            </div>
                          
                            
                            <div
                                className="w-full flex flex-col"
                            >
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="email"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={vendorVerificationDataState.email}
                                    onChange={(e) => handleChange(e)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            <div
                                className="w-full flex flex-col"
                            >
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="phone"
                                >
                                    Phone
                                </label>
                                <input
                                    type="phone"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={vendorVerificationDataState.phone}
                                    onChange={(e) => handleChange(e)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>

                            <div
                                className="w-full flex flex-col"
                            >
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="type"
                                >
                                    Account Type
                                </label>
                                <div className="flex flex-col gap-3 lg:w-[60%]">
                                    <div className="flex flex-row justify-between items-center gap-4 px-3 py-2 border border-gray-300 rounded-md">
                                        <label htmlFor="type" className="">Individual</label>
                                        <input 
                                            type="radio"
                                            name="type"
                                            value={'individual'}
                                            className="w-4 h-4"
                                            onChange={(e)=>setVendorVerificationDataState({...vendorVerificationDataState, type: e.target.value})}
                                        />
                                    </div>
                                    <div className="flex flex-row justify-between items-center gap-4 px-3 py-2 border border-gray-300 rounded-md">
                                        <label htmlFor="type" className="">Business</label>
                                        <input 
                                            type="radio"
                                            name="type"
                                            value={'business'}
                                            className="w-4 h-4"
                                            onChange={(e)=>setVendorVerificationDataState({...vendorVerificationDataState, type: e.target.value})}
                                        />
                                    </div>
                                </div>
                               
                            </div>
                            <button
                                onClick={(e) => showNextForm(e)}
                                className="hover:bg-orange-700 hover:text-white text-orange-700 font-bold py-2 px-4 w-[30%] ml-[65%] rounded-full mb-10 xs:border-0 sm:!border border-orange-700 focus:outline-none focus:shadow-outline"
                            >
                                Continue
                            </button>
                        </div>
                    }
                    
                    { nextFormGroup && (
                        <div className="flex flex-col">
                            <div className='flex justify-start py-1 border border-orange-700 mb-6 pl-3'>
                                <h2 className='font-mono text-orange-300 text-xl'>
                                    Business Information
                                </h2>
                            </div>
                        
                            <div className="flex flex-col !gap-5">
                                <div
                                    className="w-full flex flex-col"
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
                                        value={vendorVerificationDataState.business_name}
                                    />
                                </div>
                                
                                <div
                                    className="w-full flex flex-col"
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
                                        value={vendorVerificationDataState.business_email}
                                    />
                                </div>
                                {
                                    vendorVerificationDataState?.type === 'business' && (
                                        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
                                            <div className="w-full flex flex-col">
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
                                                    id="tax_id"
                                                    type="text"
                                                    placeholder="Enter your business tax id"
                                                    name="tax_id"
                                                    onChange={(e) => handleChange(e)}
                                                    value={vendorVerificationDataState.tax_id}
                                                />
                                            </div>
                                            <div className="w-full flex flex-col">
                                                <label
                                                    className="block text-gray-700 text-sm font-bold mb-2"
                                                    htmlFor="cac-id"
                                                >
                                                    CAC Registration Number
                                                
                                                </label>
                                                <input
                                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                    id="cac_reg_number"
                                                    type="text"
                                                    placeholder="Enter your CAC reg number"
                                                    name="cac_reg_number"
                                                    value={vendorVerificationDataState.cac_reg_number}
                                                    onChange={(e) => handleChange(e)}
                                                />
                                            </div>
                                        </div>
                                    )   
                                }
                               

                                <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
                                    <div className="w-full flex flex-col">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="business_tin"
                                        >
                                            Country
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            type="text"
                                            name="country"
                                            defaultValue={'nigeria'}
                                        />
                                    </div>
                                    <div className="w-full flex flex-col">
                                        <label
                                            className="block text-gray-700 text-sm font-bold mb-2"
                                            htmlFor="cac-id"
                                        >
                                            State
                                        
                                        </label>
                                        <select 
                                            className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
                                            value={vendorVerificationDataState.state} 
                                            name="state"
                                            onChange={(e) => handleChange(e)}
                                        >
                                            <option value={''}>Select a state</option>
                                            {
                                                states?.map((state: string) => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-3 md:justify-center lg:justify-end">
                                    <div className="h-[2.5em] w-[80%] !mx-auto md:w-[35%] md:!mx-0 rounded-full xs:border-0 sm:!border border-orange-700 focus:outline-none focus:shadow-outline text-orange-300 hover:bg-orange-700 hover:!text-white">
                                        <button
                                            onClick={() => setNextFormGroup(false)}
                                            className="font-bold py-1 px-4 w-full h-full"
                                        >
                                            Prev
                                        </button>
                                    </div>
                                    
                                    <div className="w-[80%] !mx-auto md:w-[40%] md:!mx-0 h-12">
                                        <ButtonFull
                                            onClick={(e: any) => handleSubmit(e)}
                                            action="Submit"
                                            loading={isLoading}
                                        />
                                    </div>
                                </div>

                               
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
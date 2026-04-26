// import { useState } from "react"
// import { ToastContainer, toast} from "react-toastify";
// import { injectStyle } from "react-toastify/dist/inject-style";
// import { useRouter } from "next/router";
// import Header from "../Components/Header";
// import { notify } from "../Utils/displayToastMessage";
// import { storeVendorVerificationAction } from "../requests/vendorVerification/vendorVerification.request";
// import ButtonFull from "../Components/buttons/ButtonFull";
// import VerificationSuccessModal from "../Components/modals/vendorVerification/VerificationSuccessModal";
// import Cookies from "js-cookie";
// const NaijaStates = require('naija-state-local-government');

// const vendorVerification = () => {
//     const states = NaijaStates.states();
//     const [showApplicationSuccessModal, setShowApplicationSuccessModal] = useState(false);
    
//     if (typeof window !== "undefined") {
//         injectStyle();
//     }

//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const [vendorVerificationDataState, setVendorVerificationDataState] = useState<any>({
//         full_name: '',
//         email: '',
//         phone: '',
//         type: '',
//         bvn: "",
//         business_name: "",
//         business_email: "",
//         cac_reg_number: "",
//         tax_id: "",
//         country: 'nigeria',
//         state: '',
//         pictures: []
//     });

//     const handleChange = (e: any) => {
//         const value = e.target.value;
//         setVendorVerificationDataState({
//             ...vendorVerificationDataState,
//             [e.target.name] : value
//         });
//     }

//     const [nextFormGroup, setNextFormGroup] = useState(false);
//     const showNextForm = (e: any) => {
//         e.preventDefault();
//         if(vendorVerificationDataState.full_name == '')return notify("Name is required");
//         else if(!vendorVerificationDataState.email) notify("Your email is required");
//         else if(!vendorVerificationDataState.phone) notify("Your phone number is required");
//         else if(!vendorVerificationDataState.type) notify("Select a business type");
//         else {
//             setNextFormGroup(true);
//         }
//     }

//     const handleSubmit = async (e: any) => {
//         e.preventDefault();
//         if(vendorVerificationDataState.business_name === "") notify("Business name is required");
//         if(vendorVerificationDataState.business_email === "") notify("Business email is required");
//         if(vendorVerificationDataState.country === "") notify("Country is required");
//         if(vendorVerificationDataState.state === "") notify("State is required");

//         else {
//             setIsLoading(true);
//             const data = {...vendorVerificationDataState}

//             await storeVendorVerificationAction(data)
//             .then((res) => {
//                 if (res.status === 201) {
//                     toast.success("Information has been saved");
//                     Cookies.set('user', JSON.stringify(res.data.data))
//                     setShowApplicationSuccessModal(true);   
//                 }
//             })
//             .catch(error => {
//                 console.log({error})
//                 toast.error(error.response?.data?.message || 'Error try again later');
//             })
//             .finally(() => setIsLoading(false));
//         }
//     }

   
//   return (
//     <div
//         className='bg-gray-100 min-h-screen'
//     >
//         <Header />
//         <ToastContainer />

//         {
//             showApplicationSuccessModal && <VerificationSuccessModal 
//                 setShow={() => setShowApplicationSuccessModal(false)}
//             />
//         }

//         <div className="flex flex-col lg:flex-row w-full">
//             <div className="flex flex-col lg:w-[50%]">
//                 <div className="flex flex-col justify-center pt-8 gap-4 w-[80%] lg:w-[70%] mx-auto">
//                     <div className="hidden lg:flex h-44 flex-row items-center gap-4 w-full bg-slate-600 rounded-md">
//                         <div className="text-white w-1/2 flex items-center justify-center">
//                             <h2 className="font-semibold text-3xl">Sell on <br /> Zuta</h2>
//                         </div>
//                         <div className=" w-1/2">
//                             <img 
//                                 src='/images/undraw_web_shopping.svg'
//                                 className="w-[90%]"
//                             />
//                         </div>
//                     </div>
//                     <p className="text-center font-semibold text-black mb-0">Why sell on Zuta?</p>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="flex h-14 justify-center items-center rounded-md bg-slate-800 text-white font-medium text-center text-xs lg:text-base">
//                             Connect with more buyers
//                         </div>
//                         <div className="flex h-14 justify-center items-center rounded-md bg-slate-800 text-white font-medium text-center text-xs lg:text-base">
//                             Sell more product
//                         </div>
//                         <div className="flex h-14 justify-center items-center rounded-md bg-slate-800 text-white font-medium text-center text-xs lg:text-base">
//                             Product delivery on us
//                         </div>
//                         <div className="flex h-14 justify-center items-center rounded-md bg-slate-800 text-white font-medium text-center text-xs lg:text-base">
//                             Make more money
//                         </div>
//                         <div className="flex h-14 justify-center items-center rounded-md bg-slate-800 text-white font-medium text-center text-xs lg:text-base">
//                             Benefit from our marketting
//                         </div>
//                         <div className="flex h-14 justify-center items-center rounded-md bg-slate-800 text-white font-medium text-center text-xs lg:text-base">
//                             Seller support
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div
//                 className="w-full lg:w-[50%] px-5 bg-white py-5"
//             >
//                 <form
//                     className="flex flex-col lg:w-[80%] lg:mx-auto"
//                 >
//                     {
//                         !nextFormGroup && 

//                         <div
//                             className="flex flex-col !gap-4"
//                         >
//                             <div
//                                 className='flex justify-start py-1 border border-orange-300 mb-6 pl-3'
//                             >
//                                 <h2
//                                     className='text-orange-300 text-xl'
//                                 >
//                                     Personal Information
//                                 </h2>
//                             </div>
//                             <div
//                                 className="w-full flex flex-col"
//                             >
//                                 <label
//                                     className="block text-gray-700 text-sm font-bold mb-2"
//                                     htmlFor="full_name"
//                                 >
//                                     Business Owner Name
//                                 </label>
//                                 <input
//                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                     id="full_name"
//                                     type="text"
//                                     name="full_name"
//                                     onChange={(e) => handleChange(e)}
//                                     placeholder='Enter your name'
//                                     value={vendorVerificationDataState.full_name || ''}
//                                 />
//                             </div>
                          
                            
//                             <div
//                                 className="w-full flex flex-col"
//                             >
//                                 <label
//                                     className="block text-gray-700 text-sm font-bold mb-2"
//                                     htmlFor="email"
//                                 >
//                                     Email
//                                 </label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     placeholder="Enter your email"
//                                     value={vendorVerificationDataState.email}
//                                     onChange={(e) => handleChange(e)}
//                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 />
//                             </div>

//                             <div
//                                 className="w-full flex flex-col"
//                             >
//                                 <label
//                                     className="block text-gray-700 text-sm font-bold mb-2"
//                                     htmlFor="phone"
//                                 >
//                                     Phone
//                                 </label>
//                                 <input
//                                     type="phone"
//                                     name="phone"
//                                     placeholder="Enter your phone number"
//                                     value={vendorVerificationDataState.phone}
//                                     onChange={(e) => handleChange(e)}
//                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                 />
//                             </div>

//                             <div
//                                 className="w-full flex flex-col"
//                             >
//                                 <label
//                                     className="block text-gray-700 text-sm font-bold mb-2"
//                                     htmlFor="type"
//                                 >
//                                     Account Type
//                                 </label>
//                                 <div className="flex flex-col gap-3 lg:w-[60%]">
//                                     <div className="flex flex-row justify-between items-center gap-4 px-3 py-2 border border-gray-300 rounded-md">
//                                         <label htmlFor="type" className="">Individual</label>
//                                         <input 
//                                             type="radio"
//                                             name="type"
//                                             value={'individual'}
//                                             className="w-4 h-4"
//                                             onChange={(e)=>setVendorVerificationDataState({...vendorVerificationDataState, type: e.target.value})}
//                                         />
//                                     </div>
//                                     <div className="flex flex-row justify-between items-center gap-4 px-3 py-2 border border-gray-300 rounded-md">
//                                         <label htmlFor="type" className="">Business</label>
//                                         <input 
//                                             type="radio"
//                                             name="type"
//                                             value={'business'}
//                                             className="w-4 h-4"
//                                             onChange={(e)=>setVendorVerificationDataState({...vendorVerificationDataState, type: e.target.value})}
//                                         />
//                                     </div>
//                                 </div>
                               
//                             </div>
//                             <button
//                                 onClick={(e) => showNextForm(e)}
//                                 className="hover:bg-orange-700 hover:text-white text-orange-700 font-bold py-2 px-4 w-[30%] ml-[65%] rounded-full mb-10 xs:border-0 sm:!border border-orange-700 focus:outline-none focus:shadow-outline"
//                             >
//                                 Continue
//                             </button>
//                         </div>
//                     }
                    
//                     { nextFormGroup && (
//                         <div className="flex flex-col">
//                             <div className='flex justify-start py-1 border border-orange-700 mb-6 pl-3'>
//                                 <h2 className='font-mono text-orange-300 text-xl'>
//                                     Business Information
//                                 </h2>
//                             </div>
                        
//                             <div className="flex flex-col !gap-5">
//                                 <div
//                                     className="w-full flex flex-col"
//                                 >
//                                     <label
//                                         className="block text-gray-700 text-sm font-bold mb-2"
//                                         htmlFor="business_name"
//                                     >
//                                         Business Name
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="business_name"
//                                         type="text"
//                                         placeholder="Enter your business name"
//                                         name="business_name"
//                                         onChange={(e) => handleChange(e)}
//                                         value={vendorVerificationDataState.business_name}
//                                     />
//                                 </div>
                                
//                                 <div
//                                     className="w-full flex flex-col"
//                                 >
//                                     <label
//                                         className="block text-gray-700 text-sm font-bold mb-2"
//                                         htmlFor="business_email"
//                                     >
//                                         Business Email
//                                     </label>
//                                     <input
//                                         className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                         id="business_email"
//                                         type="email"
//                                         placeholder="Enter your business email"
//                                         name="business_email"
//                                         onChange={(e) => handleChange(e)}
//                                         value={vendorVerificationDataState.business_email}
//                                     />
//                                 </div>
//                                 {
//                                     vendorVerificationDataState?.type === 'business' && (
//                                         <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
//                                             <div className="w-full flex flex-col">
//                                                 <label
//                                                     className="block text-gray-700 text-sm font-bold mb-2"
//                                                     htmlFor="business_tin"
//                                                 >
//                                                     Business Tax ID
//                                                     <span
//                                                         className='text-gray-500 pl-2 font-normal italic'
//                                                     >
//                                                         optional
//                                                     </span>
//                                                 </label>
//                                                 <input
//                                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                                     id="tax_id"
//                                                     type="text"
//                                                     placeholder="Enter your business tax id"
//                                                     name="tax_id"
//                                                     onChange={(e) => handleChange(e)}
//                                                     value={vendorVerificationDataState.tax_id}
//                                                 />
//                                             </div>
//                                             <div className="w-full flex flex-col">
//                                                 <label
//                                                     className="block text-gray-700 text-sm font-bold mb-2"
//                                                     htmlFor="cac-id"
//                                                 >
//                                                     CAC Registration Number
                                                
//                                                 </label>
//                                                 <input
//                                                     className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                                     id="cac_reg_number"
//                                                     type="text"
//                                                     placeholder="Enter your CAC reg number"
//                                                     name="cac_reg_number"
//                                                     value={vendorVerificationDataState.cac_reg_number}
//                                                     onChange={(e) => handleChange(e)}
//                                                 />
//                                             </div>
//                                         </div>
//                                     )   
//                                 }
                               

//                                 <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4">
//                                     <div className="w-full flex flex-col">
//                                         <label
//                                             className="block text-gray-700 text-sm font-bold mb-2"
//                                             htmlFor="business_tin"
//                                         >
//                                             Country
//                                         </label>
//                                         <input
//                                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                                             type="text"
//                                             name="country"
//                                             defaultValue={'nigeria'}
//                                         />
//                                     </div>
//                                     <div className="w-full flex flex-col">
//                                         <label
//                                             className="block text-gray-700 text-sm font-bold mb-2"
//                                             htmlFor="cac-id"
//                                         >
//                                             State
                                        
//                                         </label>
//                                         <select 
//                                             className="text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-md px-3 py-2 outline-none"
//                                             value={vendorVerificationDataState.state} 
//                                             name="state"
//                                             onChange={(e) => handleChange(e)}
//                                         >
//                                             <option value={''}>Select a state</option>
//                                             {
//                                                 states?.map((state: string) => (
//                                                     <option key={state} value={state}>{state}</option>
//                                                 ))
//                                             }
//                                         </select>
//                                     </div>
//                                 </div>

//                                 <div className="flex flex-col md:flex-row gap-3 md:justify-center lg:justify-end">
//                                     <div className="h-[2.5em] w-[80%] !mx-auto md:w-[35%] md:!mx-0 rounded-full xs:border-0 sm:!border border-orange-700 focus:outline-none focus:shadow-outline text-orange-300 hover:bg-orange-700 hover:!text-white">
//                                         <button
//                                             onClick={() => setNextFormGroup(false)}
//                                             className="font-bold py-1 px-4 w-full h-full"
//                                         >
//                                             Prev
//                                         </button>
//                                     </div>
                                    
//                                     <div className="w-[80%] !mx-auto md:w-[40%] md:!mx-0 h-12">
//                                         <ButtonFull
//                                             onClick={(e: any) => handleSubmit(e)}
//                                             action="Submit"
//                                             loading={isLoading}
//                                         />
//                                     </div>
//                                 </div>

                               
//                             </div>
//                         </div>
//                     )}
//                 </form>
//                 <ToastContainer />
//             </div>
//         </div>
        
//     </div>
//   )
// }


// export default vendorVerification

import { useState } from "react";
import { toast } from "react-toastify";
import Header from "../Components/Header";
import { notify } from "../Utils/displayToastMessage";
import { storeVendorVerificationAction } from "../requests/vendorVerification/vendorVerification.request";
import VerificationSuccessModal from "../Components/modals/vendorVerification/VerificationSuccessModal";
import Cookies from "js-cookie";
import { CheckCircle, Truck, TrendingUp, Users, Megaphone, Headphones } from "lucide-react";
import { Button } from "../Components/buttons/button";

const NaijaStates = require('naija-state-local-government');

const VendorVerification = () => {
    const states = NaijaStates.states();
    const [showApplicationSuccessModal, setShowApplicationSuccessModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        type: 'individual',
        bvn: "",
        business_name: "",
        business_email: "",
        cac_reg_number: "",
        tax_id: "",
        country: 'Nigeria',
        state: '',
        pictures: []
    });
    console.log({formData})

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = (e: any) => {
        e.preventDefault();
        if (!formData.full_name || !formData.email || !formData.phone) {
            return notify("Please complete all personal fields");
        }
        setStep(2);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!formData.business_name || !formData.state) {
            return notify("Business name and state are required");
        }

        setIsLoading(true);
        try {
            const res = await storeVendorVerificationAction(formData);
            if (res.status === 201) {
                toast.success("Welcome to the Zuta family!");
                Cookies.set('user', JSON.stringify(res.data.data));
                setShowApplicationSuccessModal(true);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const valueProps = [
        { icon: <Users size={20} />, title: "Massive Reach", desc: "Connect with thousands of active shoppers daily." },
        { icon: <TrendingUp size={20} />, title: "Growth Tools", desc: "Advanced analytics to track and scale your sales." },
        { icon: <Truck size={20} />, title: "Free Logistics", desc: "We handle the delivery, you focus on the product." },
        { icon: <Megaphone size={20} />, title: "Pro Marketing", desc: "Get featured in our social commerce campaigns." },
        { icon: <CheckCircle size={20} />, title: "Secure Escrow", desc: "Guaranteed payments for every successful sale." },
        { icon: <Headphones size={20} />, title: "24/7 Support", desc: "A dedicated manager for your business needs." },
    ];

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <Header />

            {showApplicationSuccessModal && (
                <VerificationSuccessModal setShow={() => setShowApplicationSuccessModal(false)} />
            )}

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
                
                {/* LEFT SIDE: VALUE PROPOSITION */}
                <div className="lg:w-5/12 bg-slate-900 p-8 lg:p-16 text-white flex flex-col justify-center">
                    <div className="mb-12">
                        <span className="text-orange-400 font-bold tracking-widest uppercase text-sm">Partner with Zuta</span>
                        <h1 className="text-4xl lg:text-5xl font-extrabold mt-4 leading-tight">
                            Start selling where the <span className="text-orange-500">world shops.</span>
                        </h1>
                        <p className="text-slate-400 mt-6 text-lg">
                            Join over 5,000+ Nigerian vendors growing their brands with Zuta's social-first commerce.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {valueProps.map((prop, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="text-orange-500 bg-orange-500/10 w-10 h-10 flex items-center justify-center rounded-lg">
                                    {prop.icon}
                                </div>
                                <h3 className="font-bold text-white">{prop.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{prop.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDE: THE FORM */}
                <div className="lg:w-7/12 bg-white p-6 lg:p-20 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        
                        {/* Progress Stepper */}
                        <div className="flex items-center justify-between mb-10">
                            <div className={`flex items-center gap-2 ${step === 1 ? 'text-orange-600' : 'text-green-600'}`}>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step === 1 ? 'border-orange-600 bg-orange-50' : 'border-green-600 bg-green-50'}`}>
                                    {step > 1 ? '✓' : '1'}
                                </span>
                                <span className="font-semibold">Personal</span>
                            </div>
                            <div className="flex-1 h-[2px] bg-gray-200 mx-4"></div>
                            <div className={`flex items-center gap-2 ${step === 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step === 2 ? 'border-orange-600 bg-orange-50' : 'border-gray-200'}`}>
                                    2
                                </span>
                                <span className="font-semibold">Business</span>
                            </div>
                        </div>

                        <form className="space-y-6">
                            {step === 1 ? (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
                                    <p className="text-gray-500 mb-8">This helps us verify the person behind the brand.</p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                            <input 
                                                name="full_name"
                                                type="text" 
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                                placeholder="e.g. Chinedu Okoro"
                                                value={formData.full_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                                <input 
                                                    name="email"
                                                    type="email" 
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                                    placeholder="name@example.com"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                                <input 
                                                    name="phone"
                                                    type="tel" 
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                                    placeholder="08012345678"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-4">I am registering as an:</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                {['individual', 'business'].map((t) => (
                                                    <div 
                                                        key={t}
                                                        onClick={() => setFormData({...formData, type: t})}
                                                        className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.type === t ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                                                    >
                                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.type === t ? 'border-orange-500' : 'border-gray-300'}`}>
                                                            {formData.type === t && <div className="w-2 h-2 bg-orange-500 rounded-full"></div>}
                                                        </div>
                                                        <span className="capitalize font-medium">{t}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={nextStep}
                                        disabled={
                                            !formData?.full_name ||
                                            !formData?.email ||
                                            !formData?.phone ||
                                            !formData?.type
                                        }
                                        className="w-full mt-8 bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-1"
                                    >
                                        Continue to Business Info
                                    </button>
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Details</h2>
                                    <p className="text-gray-500 mb-8">Let's set up your storefront presence.</p>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                                            <input 
                                                name="business_name"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="The Name of your shop"
                                                value={formData.business_name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Business Email</label>
                                            <input 
                                                name="business_email"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                                placeholder="Enter professional email here"
                                                value={formData.business_email}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {formData.type === 'business' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tax ID (TIN)</label>
                                                    <input 
                                                        name="tax_id"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                                        placeholder="Optional"
                                                        value={formData.tax_id}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-1">CAC Number</label>
                                                    <input 
                                                        name="cac_reg_number"
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                                        placeholder="RC123456"
                                                        value={formData.cac_reg_number}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                                                <input disabled value="Nigeria" className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                                                <select 
                                                    name="state"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                                                    value={formData.state}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Select State</option>
                                                    {states?.map((s: string) => <option key={s} value={s}>{s}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 mt-10">
                                        <button 
                                            onClick={() => setStep(1)}
                                            className="w-fit border-2 border-gray-100 hover:border-gray-200 text-gray-600 font-bold h-16 px-8 rounded-xl transition-all"
                                        >
                                            Back
                                        </button>
                                        <Button
                                            onClick={handleSubmit}
                                            isLoading={isLoading}
                                            disabled={
                                                isLoading ||
                                                !formData?.full_name ||
                                                !formData?.email ||
                                                !formData?.phone ||
                                                !formData?.type ||
                                                !formData?.business_email ||
                                                !formData?.business_name ||
                                                !formData?.state ||
                                                !formData?.country
                                            }
                                            className="bg-orange-600 h-16 rounded-md flex-1"
                                        >
                                            Complete Registration
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorVerification;
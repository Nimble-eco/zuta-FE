import { useRouter } from "next/router"
import { Fade, Slide } from 'react-awesome-reveal';
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter, FaYoutube } from "react-icons/fa"
import Header from "../../Components/Header";
import { useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { appFaqs } from "../../Utils/data";

const LandingPage = () => {
    const router = useRouter();
    const [selectedFAQ, setSelectedFAQ] = useState<any>(appFaqs[0]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <header className="flex relative">
            <div className="w-full h-60 lg:h-[90vh] flex justify-center items-center relative bg-[url('/images/hero-2.jpeg')] bg-center bg-cover bg-no-repeat">
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-70" />
                <div className="flex flex-col gap-4 mt-10 lg:mt-0 px-4 lg:px-10 rounded-md py-6 relative z-10">
                    <Slide cascade direction="left" triggerOnce={true}>
                        <h2 className="text-2xl lg:text-6xl font-semibold text-white">
                            Enjoy 
                            <span className="text-orange-600 mx-2">Wholesale</span> 
                            Discounts
                        </h2>
                        <p className="font-medium text-lg text-gray-300 text-center">
                            Tired of high prices <br /> 
                            <span className="font-semibold">Buy with a community and Enjoy cheaper prices</span>
                        </p>
                    </Slide>
                </div>
            </div>
        </header>

        <main className="flex flex-col justify-center items-center">
            <div className="flex flex-col gap-4 w-full px-8 lg:px-20 relative py-10">
                <Slide cascade direction="up" triggerOnce={true}>
                    <h2 className="text-center text-[#403D58] mt-8 text-2xl lg:text-3xl font-bold">Why <span className="text-orange-600">Zuta?</span></h2>
                </Slide>
                <div className="flex flex-col justify-center items-center md:grid md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8 z-20">
                    <Slide cascade direction="up" triggerOnce={true}>
                        <div className="flex flex-col md:flex-row gap-4 py-8 items-center min-w-full px-0 transition animate-in ease-in-out duration-800 slide-in-from-left">
                            <div className="rounded-full bg-orange-200 h-24 lg:h-36 w-24 lg:w-36 flex justify-center items-center">
                                <img src="/images/group-buy.svg" alt="buy with others" className="w-[70%] h-[70%]" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-base font-semibold text-[#403D58] text-center md:text-left">
                                    <span className='text-[#403D58] text-2xl mt-2 font-bold'>Join order train</span><br />
                                    Buy tranding items with other customers and get cheaper rates
                                </h3>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 py-8 items-center min-w-full transition ease-in-out duration-800 slide-in-from-left">
                            <div className="rounded-full bg-orange-200 h-24 lg:h-36 w-24 lg:w-36 flex justify-center items-center">
                                <img src="/images/community.svg" alt="buy with others" className="w-[70%] h-[70%]" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-base font-semibold text-[#403D58] text-center md:text-left">
                                    <span className='text-[#403D58] text-2xl mt-2 font-bold'>Buy with a community</span><br />
                                    Buy items in bulk for your business and personal needs
                                </h3>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 py-8 items-center min-w-full">
                            <div className="rounded-full bg-orange-200 h-24 lg:h-36 w-24 lg:w-36 flex justify-center items-center">
                                <img src="/images/chatting.svg" alt="buy with others" className="w-[70%] h-[70%]" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-base font-semibold text-[#403D58] text-center md:text-left">
                                    <span className='text-[#403D58] text-2xl mt-2 font-bold'>Online customer service</span><br />
                                    Reach out to us through mail or on our socials
                                </h3>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4 py-8 items-center min-w-full">
                            <div className="rounded-full bg-orange-200 h-24 lg:h-36 w-24 lg:min-w-[9rem] lg:w-36 flex justify-center items-center">
                                <img src="/images/word-of-mouth.svg" alt="buy with others" className="w-[70%] h-[70%]" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <h3 className="text-base font-semibold text-[#403D58] text-center md:text-left">
                                    <span className='text-[#403D58] text-2xl mt-2 font-bold'>Reach larger Audience</span><br/>
                                    Grow your customers through our marketting campaigns or Ad placements
                                </h3>
                            </div>
                        </div>
                    </Slide>
                </div>
            </div>

            <div className="w-full h-60 lg:h-[85vh] flex flex-col gap-4 justify-center items-center relative bg-[url('/images/hero-1.jpeg')] bg-center bg-cover bg-no-repeat bg-fixed">
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-30" />
                <Slide cascade direction="left" triggerOnce={true}>
                    <h2 className="text-4xl font-semibold text-white z-20">
                        Lets Buy It Together
                    </h2>
                    <button 
                        type="button" 
                        className="bg-orange-600 z-20 px-20 py-4 rounded-xl text-white w-fit font-semibold"
                        onClick={()=>router.push('/')}    
                    >
                        Start Shopping
                    </button>
                </Slide>
            </div>

            <div className="flex flex-col gap-4 mt-8 w-full bg-gray-100 px-4 lg:px-20 py-10">
                <p className="text-3xl font-semibold text-orange-600 mb-10 text-center">
                    Frequently Asked Questions
                </p>
                <div className="flex flex-col gap-6">
                    <Fade cascade triggerOnce>
                    {
                        appFaqs?.slice(0,7).map((faq: any, index: number) => (
                            <div 
                                key={faq?.question} 
                                className="flex flex-col gap-1 border-b w-full"
                                onClick={()=>setSelectedFAQ(faq)}    
                            >
                                <div className="flex flex-row gap-4 justify-between items-center text-slate-800">
                                    <div className="flex flex-row gap-4 items-center cursor-pointer">
                                        <p className="font-semibold text-lg">{index + 1}</p>
                                        <p className="font-semibold text-lg capitalize">{faq?.question}</p>
                                    </div>
                                    {
                                        selectedFAQ?.answer === faq?.answer ?
                                        <MdKeyboardArrowUp className="text-3xl" /> :
                                        <MdKeyboardArrowDown className="text-3xl" /> 
                                    }
                                </div>
                                {
                                    selectedFAQ?.answer === faq?.answer && (
                                        <p className="p-4 font-medium">{selectedFAQ?.answer}</p>
                                    )
                                }
                            </div>
                        ))
                    }
                    </Fade>
                </div>
            </div>

            <div className="grid grid-cols-1 h-[50vh] w-full bg-[url('/images/shopping-cart.jpg')] bg-cover bg-center">
                <div className="flex flex-col gap-4 justify-center items-center relative group">
                    <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-80 group-hover:bg-opacity-70" />
                    <Slide cascade direction="right" triggerOnce={true}>
                        <h2 className="text-3xl font-semibold text-white z-20 text-center">
                            Are you a 
                            <span className="text-orange-600 mx-2">Wholesale</span> distributor? <br />
                            <span className="text-lg">Start Selling Now</span>
                        </h2>
                        <button 
                            type="button" 
                            className="bg-orange-600 z-20 px-20 py-4 rounded-xl text-white w-fit font-semibold"
                            onClick={()=>router.push('/vendorVerification')}
                        >
                            Get Started Here
                        </button>
                    </Slide>
                </div>
            </div>
        </main>

        <footer className=" grid grid-cols-2 lg:grid-cols-3 gap-6 text-[#DBD56E] py-16 px-8 lg:px-20 bg-[#403D58]">
            <div className="flex flex-col gap-4 text-sm">
                <p className="text-white font-semibold mb-2">NEED HELP?</p>
                <a href="#0">Contact Us</a>

                <p className="text-white font-semibold my-2">USEFUL LINKS</p>
                <a href="#0">Order Trains</a> 
                <a href="#0">Delivery options</a> 
                <a href="#0">About community</a> 
                <a href="#0">Buy with a community</a> 
                <a href="#0">How to return a product</a> 
                <a href="#0">Return policy</a> 
                <a href="#0">Report a product</a> 
            </div>
            <div className="flex flex-col gap-4 text-sm">
                <p className="text-white font-semibold mb-2">ABOUT US</p>
                <a href="#0">Terms and Conditions</a>
                <a href="#0">Privacy policy</a>
                <a href="#0">Zuta express</a>

                <p className="text-white font-semibold mt-8 mb-2">JOIN US</p>
                <div className="flex flex-row gap-4 items-center">
                    <FaTwitter className="text-lg cursor-pointer hover:text-orange-600" />
                    <FaInstagram className="text-lg cursor-pointer hover:text-orange-600" />
                    <FaTelegram className="text-lg cursor-pointer hover:text-orange-600" />
                    <FaYoutube className="text-lg cursor-pointer hover:text-orange-600" />
                    <FaFacebook className="text-lg cursor-pointer hover:text-orange-600" />
                </div>

                <p className="text-white font-semibold mt-8 mb-2">PAYMENT METHODS AND DELIVERY PARTNERS</p>
                <div className="flex flex-row gap-4 items-center">
                    <a href="#0" className="text-[#DBD56E]">Paystack</a>
                    <a href="#0" className="text-[#DBD56E]">Nimble</a>
                </div>
            </div>
            <div className="flex flex-col gap-4 text-sm">
                <p className="text-white font-semibold mb-2">MAKE MONEY WITH ZUTA</p>
                <a href="/vendorVerification">Sell on Zuta</a>
                <a href="#0">Vendor Hub</a>
                <a href="#0">Start a Buying Community</a>
                <a href="#0">Become a logistics partner</a>
                <a href="#0">Become a storage partner</a>
            </div>
        </footer>
    </div>
  )
}

export default LandingPage
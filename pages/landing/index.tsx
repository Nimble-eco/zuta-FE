import { useRouter } from "next/router";
import { Fade, Slide } from 'react-awesome-reveal';
import { FaFacebook, FaInstagram, FaTelegram, FaTwitter, FaYoutube, FaArrowRight } from "react-icons/fa";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdGroups, MdLocalShipping, MdStorefront, MdSupportAgent } from "react-icons/md";
import Header from "../../Components/Header";
import { useState } from "react";
import { appFaqs } from "../../Utils/data";

const LandingPage = () => {
    const router = useRouter();
    const [selectedFAQ, setSelectedFAQ] = useState<number | null>(0);

    return (
        <div className="flex flex-col min-h-screen bg-[#FAFAFB] text-slate-900 font-sans">
            <Header />

            {/* --- HERO SECTION --- */}
            <section className="relative h-[85vh] flex items-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/images/hero-2.jpeg" 
                        className="w-full h-full object-cover opacity-50" 
                        alt="Zuta Community Buying"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/60 to-transparent" />
                </div>

                <div className="container mx-auto px-6 lg:px-20 relative z-10">
                    <div className="max-w-3xl">
                        <Fade direction="up" triggerOnce>
                            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-orange-500 uppercase bg-orange-500/10 rounded-full">
                                Social E-Commerce Redefined
                            </span>
                            <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                                Buy Together, <br />
                                <span className="text-orange-500">Pay Wholesale.</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-10 max-w-lg leading-relaxed">
                                Join "Order Trains" with thousands of shoppers. Unlock bulk discounts without needing a warehouse.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => router.push('/')}
                                    className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 group"
                                >
                                    Start Shopping <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </Fade>
                    </div>
                </div>
            </section>

            {/* --- UTILITY SECTION (The Bento Grid) --- */}
            <main className="container mx-auto px-6 lg:px-20 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold text-slate-800 mb-4">Why shop on <span className="text-orange-600">Zuta?</span></h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">We combine the power of community with wholesale logistics to save you money on every click.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Feature 1 */}
                    <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                            <MdGroups size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Join the Order Train</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Think of it as a moving discount. As more people join the "Train" for a specific product, the price drops for everyone. Scale your savings with the crowd.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#403D58] p-8 rounded-3xl text-white">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-orange-400 mb-6">
                            <MdLocalShipping size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Bulk Delivery</h3>
                        <p className="text-slate-300 leading-relaxed">
                            Shared logistics means lower shipping fees. We ship community orders to central hubs or your doorstep.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                            <MdStorefront size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Verified Vendors</h3>
                        <p className="text-slate-500">Only the most reliable wholesale distributors make it onto Zuta.</p>
                    </div>

                    {/* Feature 4 */}
                    <div className="md:col-span-2 bg-orange-50 p-8 rounded-3xl border border-orange-100">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold mb-3 text-orange-900">Reach a Larger Audience</h3>
                                <p className="text-orange-800/80">
                                    Are you a vendor? Leverage our marketing campaigns to move inventory faster than ever through community-driven demand.
                                </p>
                                <button onClick={() => router.push('/vendorVerification')} className="mt-6 text-orange-600 font-bold flex items-center gap-2">
                                    Become a Partner <FaArrowRight size={12} />
                                </button>
                            </div>
                            <img src="/images/word-of-mouth.svg" className="w-40 opacity-80" alt="Growth" />
                        </div>
                    </div>
                </div>
            </main>

            {/* --- CTA SECTION --- */}
            <section className="bg-orange-600 py-20">
                <div className="container mx-auto px-6 text-center text-white">
                    <Fade direction="up" triggerOnce>
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-8">Ready to start the train?</h2>
                        <button 
                            onClick={() => router.push('/')}
                            className="px-12 py-5 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold text-lg shadow-xl transition-all hover:scale-105"
                        >
                            Explore Trending Deals
                        </button>
                    </Fade>
                </div>
            </section>

            {/* --- FAQ SECTION --- */}
            <section className="bg-white py-24">
                <div className="container mx-auto px-6 lg:px-40">
                    <h2 className="text-3xl font-bold mb-12 text-center">Common Questions</h2>
                    <div className="space-y-4">
                        {appFaqs?.slice(0, 7).map((faq: any, index: number) => (
                            <div 
                                key={index} 
                                className={`border rounded-2xl transition-all ${selectedFAQ === index ? 'border-orange-500 bg-orange-50/30' : 'border-slate-100'}`}
                            >
                                <button 
                                    className="flex w-full items-center justify-between p-6 text-left"
                                    onClick={() => setSelectedFAQ(selectedFAQ === index ? null : index)}
                                >
                                    <span className="font-bold text-slate-700">{faq?.question}</span>
                                    {selectedFAQ === index ? <MdKeyboardArrowUp size={24} /> : <MdKeyboardArrowDown size={24} />}
                                </button>
                                {selectedFAQ === index && (
                                    <div className="px-6 pb-6 text-slate-600 animate-in fade-in slide-in-from-top-1">
                                        {faq?.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-[#1A1926] text-slate-400 py-20 px-6 lg:px-20 border-t border-white/5">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-white text-2xl font-bold mb-6">Zuta<span className="text-orange-500">.</span></h3>
                        <p className="text-sm leading-relaxed">Making wholesale accessible to everyone through social collaboration.</p>
                        <div className="flex gap-4 mt-8">
                            <FaTwitter className="hover:text-orange-500 cursor-pointer" />
                            <FaInstagram className="hover:text-orange-500 cursor-pointer" />
                            <FaFacebook className="hover:text-orange-500 cursor-pointer" />
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Platform</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="/order-train" className="hover:text-white transition">Order Trains</a></li>
                            <li><a href="#" className="hover:text-white transition">Buying Communities</a></li>
                            <li><a href="#" className="hover:text-white transition">Zuta Express</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Support</h4>
                        <ul className="space-y-4 text-sm">
                            <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                            <li><a href="/legal" className="hover:text-white transition">Terms and conditions</a></li>
                            <li><a href="/legal" className="hover:text-white transition">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                        <h4 className="text-white font-bold mb-4 text-sm">Earn with Zuta</h4>
                        <p className="text-xs mb-6">Join our network of logistics and storage partners.</p>
                        <button 
                            onClick={() => router.push('/vendorVerification')}
                            className="w-full py-3 bg-orange-600 text-white rounded-lg font-bold text-sm"
                        >
                            Register as Vendor
                        </button>
                    </div>
                </div>
                <div className="mt-20 pt-8 border-t border-white/5 text-center text-xs">
                    © {new Date().getFullYear()} Zuta Social Commerce. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;
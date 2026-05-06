import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { 
    HiOutlineCheckCircle, 
    HiOutlineShare, 
    HiOutlineLink, 
    HiOutlineArrowRight,
    HiOutlineTicket
} from 'react-icons/hi';
import { 
    FaWhatsapp, 
    FaFacebook, 
    FaTwitter, 
    FaInstagram 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import confetti from 'canvas-confetti';
import ButtonFull from '../../Components/buttons/ButtonFull';
import { SiTiktok } from 'react-icons/si';

const OrderTrainSuccess = () => {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [newTrainDetails, setNewTrainDetails] = useState<any>({});
    const shareUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/order-train/${newTrainDetails?.id}`;

    useEffect(() => {
        const data = sessionStorage.getItem('new_order_train');
        if (data) {
            setNewTrainDetails(JSON.parse(data));
            sessionStorage.removeItem('new_order_train');
        }
    }, []);

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
        }, 250);
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const nextDiscount = (Number(newTrainDetails?.open_order_discount)/3).toFixed(2);
    const penUltDiscount = (Number(newTrainDetails?.open_order_discount)/2).toFixed(2);
    const targetDiscount = Number(newTrainDetails?.open_order_discount).toFixed(2);

    const handleInstagramShare = async () => {
        const shareData = {
            title: 'Join my Zuta Order Train!',
            text: `Help us clear the stock and get ${targetDiscount}% off ${newTrainDetails?.product_name}!`,
            url: shareUrl,
        };
      
        if (navigator?.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            copyToClipboard();
            window.open('https://www.instagram.com/', '_blank');
        }
    };

    const handleTikTokShare = () => {
        copyToClipboard();
      
        setTimeout(() => {
          window.open('https://www.tiktok.com/upload', '_blank');
        }, 1000);
    };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center md:p-4">
        {/* Main Success Card */}
        <div className="w-full max-w-xl bg-white md:rounded-[2.5rem] shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
        
            {/* Top Celebration Section */}
            <div className="bg-slate-800 p-10 text-center relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-20 h-20 border-4 border-orange-500 rounded-full animate-bounce" />
                    <div className="absolute bottom-10 right-10 w-12 h-12 bg-orange-500 rounded-lg rotate-12" />
                </div>

                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6 shadow-lg shadow-green-500/30">
                    <HiOutlineCheckCircle className="text-white text-5xl" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Train Started!</h1>
                <p className="text-slate-300">You've successfully launched this Order Train.</p>
            </div>

            {/* Discount Progress Card */}
            <div className="px-8 mt-8">
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 flex flex-col items-center text-center">
                    <div className="flex items-center gap-2 text-orange-600 font-bold text-sm uppercase tracking-widest mb-4">
                        <HiOutlineTicket className="text-xl" />
                        Potential Discount
                    </div>
                    <div className="text-5xl font-black text-slate-800 mb-2">
                        {targetDiscount}% <span className="text-2xl text-slate-400">OFF</span>
                    </div>
                    <p className="text-slate-500 text-sm max-w-[250px] mb-6">
                        <strong>Clearance Event!</strong> Only 
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 animate-pulse">
                            {newTrainDetails?.stock} left
                        </span>. 
                        Buy them out with your squad to unlock the maximum discount for everyone!
                    </p>
                    
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                        <div className="w-1/5 bg-orange-500 h-full rounded-full" />
                    </div>
                    <div className="flex justify-between w-full mt-2 text-[10px] font-bold text-slate-400 uppercase">
                        <span>You (Leader)</span>
                        <span>{nextDiscount}% Off</span>
                        <span>{penUltDiscount}% Off</span>
                        <span>{targetDiscount}% Off (Goal)</span>
                    </div>
                </div>
            </div>

            {/* Share Section */}
            <div className="p-4 md:p-8">
                <h3 className="text-center font-bold text-slate-800 mb-6 flex items-center justify-center gap-2">
                    <HiOutlineShare className="text-orange-500" />
                    Share to Fill the Train
                </h3>

                <div className="grid grid-cols-5 gap-4 mb-8">
                {[
                    { 
                        icon: <FaWhatsapp />, 
                        color: 'bg-[#25D366]', 
                        label: 'WhatsApp', 
                        onClick: () => window.open(`https://wa.me/?text=Join%20my%20Order%20Train%20on%20Zuta%20to%20get%2025%25%20off%20${newTrainDetails?.product_name}!%20${encodeURIComponent(shareUrl)}`, '_blank')
                    },
                    { 
                        icon: <FaFacebook />, 
                        color: 'bg-[#1877F2]', 
                        label: 'Facebook', 
                        onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank') 
                    },
                    { 
                        icon: <FaTwitter />, 
                        color: 'bg-[#1DA1F2]', 
                        label: 'X', 
                        onClick: () => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}`, '_blank') 
                    },
                    { 
                        icon: <FaInstagram />, 
                        color: 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]', 
                        label: 'Insta', 
                        onClick: handleInstagramShare
                    },
                    { 
                        icon: <SiTiktok />, 
                        color: 'bg-[#000000]', 
                        label: 'TikTok', 
                        onClick: handleTikTokShare 
                    }
                ].map((social, i) => (
                    <button 
                        key={i} 
                        onClick={social.onClick}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className={`${social.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md transition-transform group-hover:-translate-y-1`}>
                            {social.icon}
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                            {social.label}
                        </span>
                    </button>
                ))}
                </div>

                {/* Copy Link Input */}
                <div className="relative mb-8">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-2 pl-4">
                        <HiOutlineLink className="text-slate-400 shrink-0" />
                        <input 
                            readOnly 
                            value={shareUrl}
                            className="bg-transparent border-none outline-none text-xs text-slate-500 w-full px-3 font-medium"
                        />
                        <button 
                            onClick={copyToClipboard}
                            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${copied ? 'bg-green-500 text-white' : 'bg-slate-800 text-white'}`}
                        >
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col gap-3">
                    <ButtonFull 
                        action="Go to My Orders" 
                        onClick={() => router.push('/profile?path=orders')} 
                    />
                    <button 
                        onClick={() => router.push('/')}
                        className="flex items-center justify-center gap-2 py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                    >
                        Continue Shopping <HiOutlineArrowRight />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default OrderTrainSuccess;
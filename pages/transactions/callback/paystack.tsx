import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "../../../Components/Header";
import { toast } from 'react-toastify';
import axiosInstance from "../../../Utils/axiosConfig";
import { useRouter } from "next/router";
import { CheckCircle, Loader2, Package, ShoppingBag, MessageSquareHeart } from "lucide-react";
import RatingsCard from "../../../Components/cards/RatingsCard";
import { storeFeedbackAction } from "../../../requests/feedback/feedback.request";
import { feedbackTypes } from "../../../Utils/data";
import { capitalizeFirstLetter, processImgUrl } from "../../../Utils/helper";
import ProductComponent from "../../../Components/ProductComponent";

const PaystackCallback = () => {
    const router = useRouter();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'success' | 'error' | 'idle'>('idle');
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
    const [feedback, setFeedback] = useState({ type: '', comment: '' });

    // Payment Verification Logic
    useEffect(() => {
        if (!router.isReady) return;

        const { trxref, reference } = router.query;
        const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;

        if (!reference) return;

        axiosInstance.post('/api/payment/verify/paystack', 
            { reference, trxref }, 
            { headers: { Authorization: user?.access_token } }
        )
        .then(async (response) => {
            if (response.data?.message?.toLowerCase() === 'payment successful') {
                setPaymentStatus('success');
                
                localStorage.removeItem('cart');
            } else {
                setPaymentStatus('error');
            }
        })
        .catch(() => setPaymentStatus('error'))
        .finally(() => setIsVerifying(false));
    }, [router.isReady, router.query]);

    // Load Featured Products
    useEffect(() => {
        axiosInstance.get('/api/featured/product/index?properties=1')
            .then(res => {
                if(res?.data)setFeaturedProducts(res?.data?.data?.data?.slice(0, 5))
            });
    }, []);

    const submitFeedback = async () => {
        if (!feedback.comment) return toast.error('Please add a comment');
        setIsSubmittingFeedback(true);
        try {
            await storeFeedbackAction({ ...feedback, category: 'order_success' });
            toast.success('Thank you! Your feedback helps us grow.');
            setFeedback({ type: '', comment: '' });
        } catch (error) {
            toast.error('Feedback submission failed.');
        } finally {
            setIsSubmittingFeedback(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-12">
            <Header />

            <main className="max-w-7xl mx-auto px-4 mt-8 lg:mt-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Column: Success State & Feedback */}
                    <div className="flex-1 space-y-6">
                        
                        {/* Status Card */}
                        <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
                            {isVerifying ? (
                                <div className="flex flex-col items-center py-10">
                                    <Loader2 className="h-12 w-12 text-orange-500 animate-spin mb-4" />
                                    <h1 className="text-xl font-bold text-slate-800">Verifying your payment...</h1>
                                    <p className="text-slate-500">Please do not refresh this page.</p>
                                </div>
                            ) : paymentStatus === 'success' ? (
                                <div className="animate-in fade-in zoom-in duration-500">
                                    <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="text-green-600 h-10 w-10" />
                                    </div>
                                    <h1 className="text-3xl font-black text-slate-900 mb-2">Order Confirmed!</h1>
                                    <p className="text-slate-500 mb-8 max-w-md mx-auto">
                                        Your payment was successful and your order is being processed. 
                                        A confirmation email has been sent to you.
                                    </p>
                                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                                        <button 
                                            onClick={() => router.push('/profile?path=orders')}
                                            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                                        >
                                            <Package size={18} /> View My Orders
                                        </button>
                                        <button 
                                            onClick={() => router.push('/')}
                                            className="flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
                                        >
                                            <ShoppingBag size={18} /> Continue Shopping
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-10">
                                    <h1 className="text-xl font-bold text-red-500">Payment Verification Failed</h1>
                                    <p className="text-slate-500 mb-6">We couldn't verify your transaction. If you were debited, please contact support.</p>
                                    <button onClick={() => router.reload()} className="text-orange-500 font-bold underline">Try Again</button>
                                </div>
                            )}
                        </div>

                        {/* Feedback Section */}
                        {paymentStatus === 'success' && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <MessageSquareHeart className="text-orange-500" /> 
                                    How was your shopping experience?
                                </h3>
                                <div className="space-y-4">
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors"
                                        value={feedback.type}
                                        onChange={(e) => setFeedback({ ...feedback, type: e.target.value })}
                                    >
                                        <option value="">What can we improve?</option>
                                        {feedbackTypes?.map((item: any, i: number) => (
                                            <option key={i} value={item.value || item.name}>
                                                {capitalizeFirstLetter(item.title || item.name)}
                                            </option>
                                        ))}
                                    </select>
                                    <textarea 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors h-32 resize-none"
                                        placeholder="Tell us more about your experience..."
                                        value={feedback.comment}
                                        onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                                    />
                                    <button 
                                        onClick={submitFeedback}
                                        disabled={isSubmittingFeedback || !feedback.comment}
                                        className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:bg-orange-600 transition-all"
                                    >
                                        {isSubmittingFeedback ? 'Sending...' : 'Send Feedback'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Featured Products */}
                    <aside className="lg:w-[380px] space-y-4">
                        <h3 className="font-bold text-slate-800 px-2">You might also like</h3>
                        <div className="space-y-4">
                            {featuredProducts?.map((product) => (
                                <ProductComponent
                                    key={product?.id}
                                    product={product?.product}
                                />
                            ))}
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default PaystackCallback;
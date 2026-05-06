import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from 'react-toastify';
import axiosInstance from "../../../../Utils/axiosConfig";
import ButtonFull from "../../../../Components/buttons/ButtonFull";
import { PulseLoader } from "react-spinners";
import Header from "../../../../Components/Header";
import { CheckCircle2, XCircle } from "lucide-react";

const PaystackCallback = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

    useEffect(() => {
        if (!router.isReady) return;

        const verifyPayment = async () => {
            const { reference, trxref } = router.query;
            const userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;

            if (!reference || !userCookie) {
                setPaymentStatus('error');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axiosInstance.post('/api/payment/verify/paystack', 
                    { reference, trxref }, 
                    { headers: { Authorization: `Bearer ${userCookie.access_token}` } }
                );

                if (response.data?.message?.toLowerCase().includes('successful')) {
                    setPaymentStatus('success');
                    toast.success('Payment verified successfully!');
                } else {
                    setPaymentStatus('error');
                }
            } catch (err) {
                setPaymentStatus('error');
                toast.error('Verification failed');
            } finally {
                setIsLoading(false);
            }
        };

        verifyPayment();
    }, [router.isReady, router.query]);

    return (
        <div className="bg-[#F8F9FB] min-h-screen flex flex-col">
            <Header />

            <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row gap-8">
                
                {/* Left Column: Status & Feedback */}
                <div className="lg:w-2/3 flex flex-col gap-6">
                    
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 text-center flex flex-col items-center">
                            {isLoading ? (
                                <>
                                    <PulseLoader size={15} color="#FFA500" margin={4} />
                                    <h2 className="mt-6 text-2xl font-bold text-gray-800">Verifying Transaction</h2>
                                    <p className="text-gray-500 mt-2">Please hold on while we confirm your payment with Paystack...</p>
                                </>
                            ) : paymentStatus === 'success' ? (
                                <>
                                    <div className="bg-green-50 p-4 rounded-full mb-4">
                                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                                    </div>
                                    <h2 className="text-3xl font-extrabold text-gray-900">Payment Confirmed!</h2>
                                    <p className="text-gray-600 mt-2 text-lg">Your product is now being featured on the Zuta Showcase.</p>
                                    
                                    <div className="mt-8 flex gap-4 w-full max-w-md">
                                        <ButtonFull
                                            action="Go to Showcase"
                                            onClick={() => router.push('/vendor/showcase')}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-20 h-20 text-red-500 mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-800">Verification Failed</h2>
                                    <p className="text-gray-500 mt-2">We couldn't verify this payment. If you were debited, please contact Zuta support.</p>
                                    <button 
                                        onClick={() => router.push('/vendor')}
                                        className="mt-6 text-orange-500 font-semibold hover:underline"
                                    >
                                        Return to Dashboard
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PaystackCallback;
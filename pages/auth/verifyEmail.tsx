import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Mail, ArrowLeft, RefreshCcw, ShieldCheck } from "lucide-react";
import ButtonFull from "../../Components/buttons/ButtonFull";
import Header from "../../Components/Header";
import axiosInstance from "../../Utils/axiosConfig";

const VerifyEmail = () => {
    const router = useRouter();
    const email = router.query.email as string;
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    // Handle Countdown Timer
    useEffect(() => {
        let timer: any;
        if (resendTimer > 0 && !canResend) {
            timer = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setCanResend(true);
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [resendTimer, canResend]);

    const maskEmail = (emailStr: string) => {
        if (!emailStr) return "your email";
        const [name, domain] = emailStr.split("@");
        return `${name[0]}***@${domain}`;
    };

    const submit = async () => {
        if (!otp || otp.length < 4) return toast.error('Please enter a valid OTP code');

        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/auth/verify-email', { email, otp });
            if (response.status === 202) {
                toast.success('Email verified! Welcome to Zuta.');
                setTimeout(()=>router.push('/auth/signIn'), 1000);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        setCanResend(false);
        setResendTimer(60);
        
        try {
            const response = await axiosInstance.post('/api/auth/request/verify-email', { email });
            if (response.status === 202) {
                toast.info('A new code has been sent to your inbox');
            }
        } catch (error) {
            toast.error('Failed to resend code');
            setCanResend(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header search={false} />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 lg:p-12 relative overflow-hidden">
                    
                    {/* Decorative Background Element */}
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ShieldCheck size={120} />
                    </div>

                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-colors mb-8 text-sm font-semibold"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>

                    <div className="text-center space-y-3 mb-10">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Mail size={32} />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">
                            Verify your email
                        </h1>
                        <p className="text-slate-500 text-sm px-4 leading-relaxed">
                            We've sent a unique code to <span className="font-bold text-slate-700">{maskEmail(email)}</span>. Enter it below to secure your account.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Secure OTP Code
                            </label>
                            <input 
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full h-16 text-center text-3xl font-black text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all placeholder:text-slate-200"
                                autoFocus
                            />
                        </div>

                        <ButtonFull
                            action="Verify Account"
                            loading={isLoading}
                            onClick={submit}
                        />

                        <div className="text-center pt-4">
                            {canResend ? (
                                <button 
                                    onClick={handleResend}
                                    className="flex items-center gap-2 mx-auto text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                                >
                                    <RefreshCcw size={16} />
                                    Resend Code
                                </button>
                            ) : (
                                <p className="text-sm text-slate-400 font-medium">
                                    Resend code in <span className="text-slate-800 font-bold">{resendTimer}s</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Support footer */}
                    <p className="text-center mt-12 text-xs text-slate-400">
                        Can't find the email? Check your spam folder or 
                        <a href="#" className="underline hover:text-slate-600">contact support</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
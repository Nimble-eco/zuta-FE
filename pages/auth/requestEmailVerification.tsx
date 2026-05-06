import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { MailPlus, ArrowLeft, ShieldCheck, Info } from "lucide-react";
import Header from "../../Components/Header";
import TextInput from "../../Components/inputs/MyTextInput";
import ButtonFull from "../../Components/buttons/ButtonFull";
import axiosInstance from "../../Utils/axiosConfig";

const RequestEmailVerification = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const submit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return toast.error('Please enter a valid email address');
        }

        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/auth/request/verify-email', { email });
            if (response.status === 202) {
                toast.success('Security code sent successfully');
                router.push(`/auth/verifyEmail?email=${email}`);
            }
        } catch (error: any) {
            console.error({ error });
            toast.error(error.response?.data?.message || 'We couldn’t send the code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Header search={false} />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 lg:p-12 relative overflow-hidden">
                    
                    {/* Visual Brand Accents */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-600" />

                    <button 
                        onClick={() => router.push('/auth/signIn')}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-10 text-sm font-semibold"
                    >
                        <ArrowLeft size={16} />
                        Back to Login
                    </button>

                    <div className="text-center space-y-3 mb-10">
                        <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <MailPlus size={32} />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">
                            Verify your identity
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed px-2">
                            To keep your Zuta account secure, we need to verify your email address. We'll send a security code to your inbox.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="group transition-all">
                            <TextInput
                                label="Email Address"
                                name="email"
                                type="email"
                                value={email}
                                handleChange={(e: any) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Hint box */}
                        <div className="flex gap-3 p-4 bg-blue-50 rounded-2xl text-blue-700">
                            <Info size={20} className="shrink-0" />
                            <p className="text-xs leading-relaxed font-medium">
                                Make sure you have access to this email. If you don't see the code, check your <b>Spam</b> or <b>Promotions</b> folder.
                            </p>
                        </div>

                        <div className="pt-2">
                            <ButtonFull
                                action={isLoading ? "Sending Code..." : "Send Verification Code"}
                                loading={isLoading}
                                onClick={submit}
                            />
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-400">
                            <ShieldCheck size={14} />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Secure Verification</span>
                        </div>
                        <p className="text-xs text-slate-400 text-center">
                            Don't have an account? <a href="/auth/signUp" className="text-orange-600 font-bold hover:underline">Sign up for Zuta</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestEmailVerification;
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { KeyRound, ArrowLeft, ShieldCheck, CheckCircle2, Send } from 'lucide-react';
import Header from '../../Components/Header';
import TextInput from '../../Components/inputs/MyTextInput';
import ButtonFull from '../../Components/buttons/ButtonFull';
import axiosInstance from '../../Utils/axiosConfig';

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false); 

    const submit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return toast.error('Please enter a valid email address');
        }

        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/auth/password/request/reset', { email });
            if (response.status === 200) {
                setIsSuccess(true); 
                toast.success('Reset link sent!');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header search={false} />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 lg:p-12 relative overflow-hidden transition-all duration-500">
                    
                    {/* Brand Accent */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500" />

                    {!isSuccess ? (
                        /* --- FORM STATE --- */
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button 
                                onClick={() => router.push('/auth/signIn')}
                                className="flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-colors mb-10 text-sm font-bold"
                            >
                                <ArrowLeft size={18} />
                                Back to Login
                            </button>

                            <div className="text-center space-y-4 mb-10">
                                <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                                    <KeyRound size={40} strokeWidth={1.5} />
                                </div>
                                <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">
                                    Forgot Password?
                                </h1>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-[300px] mx-auto">
                                    No worries! Enter your email and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <TextInput
                                    label="Registered Email Address"
                                    name="email"
                                    type="email"
                                    value={email}
                                    handleChange={(e: any) => setEmail(e.target.value)}
                                />
                                <ButtonFull
                                    action={isLoading ? "Sending Link..." : "Send Reset Link"}
                                    loading={isLoading}
                                    onClick={submit}
                                />
                            </div>
                        </div>
                    ) : (
                        /* --- SUCCESS STATE --- */
                        <div className="text-center animate-in zoom-in-95 fade-in duration-500">
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                                <CheckCircle2 size={56} strokeWidth={1.5} />
                                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                            </div>

                            <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight mb-4">
                                Check your email
                            </h2>
                            
                            <p className="text-slate-500 text-sm leading-relaxed mb-8">
                                We have sent a password reset link to:<br/>
                                <span className="font-bold text-slate-800 text-base">{email}</span>
                            </p>

                            <div className="space-y-4">
                                <button 
                                    onClick={() => setIsSuccess(false)}
                                    className="text-sm font-bold text-slate-400 hover:text-orange-600 transition-colors py-2"
                                >
                                    Didn't get the email? Try again
                                </button>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-50">
                                <div className="bg-amber-50 p-4 rounded-2xl flex gap-3 text-left">
                                    <Send size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                        <b>Tip:</b> If you don't see the email within 2 minutes, check your <b>Spam</b> or <b>Promotions</b> folders.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer - Only show logic for form state */}
                    {!isSuccess && (
                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <ShieldCheck size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Secure Link Verification</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
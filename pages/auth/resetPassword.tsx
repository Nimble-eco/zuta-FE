import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { LockKeyhole, ShieldCheck, Check, ShieldAlert } from 'lucide-react';
import Header from '../../Components/Header';
import Password from '../../Components/inputs/Password';
import ButtonFull from '../../Components/buttons/ButtonFull';
import axiosInstance from '../../Utils/axiosConfig';

const ResetPassword = () => {
    const router = useRouter();
    const { email, token } = router.query;
    
    const [new_password, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Password Validation States
    const [checks, setChecks] = useState({
        length: false,
        number: false,
        special: false,
        match: false
    });

    useEffect(() => {
        setChecks({
            length: new_password.length >= 8,
            number: /\d/.test(new_password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(new_password),
            match: new_password !== '' && new_password === confirmNewPassword
        });
    }, [new_password, confirmNewPassword]);

    const isReady = checks.length && checks.number && checks.special && checks.match;

    const submit = async () => {
        if (!email || !token) return toast.error('Invalid or expired reset link');
        if (!isReady) return toast.error('Please fulfill all security requirements');

        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/auth/password/reset', { 
                email, 
                token, 
                new_password 
            });
            
            if (response.status === 200) {
                toast.success('Security update successful!');
                setTimeout(()=>router.push('/auth/signIn'), 1200);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Verification failed. Please request a new link.');
        } finally {
            setIsLoading(false);
        }
    };

    const CriteriaItem = ({ met, label }: { met: boolean; label: string }) => (
        <div className={`flex items-center gap-2 text-xs font-medium transition-colors ${met ? 'text-emerald-600' : 'text-slate-400'}`}>
            {met ? <Check size={14} strokeWidth={3} /> : <div className="w-1 h-1 rounded-full bg-slate-300 ml-1.5 mr-1" />}
            {label}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            <Header search={false} />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-[500px] bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 lg:p-12 relative overflow-hidden">
                    
                    {/* Security Bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-orange-600" />

                    <div className="text-center space-y-4 mb-10">
                        <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-orange-100">
                            <LockKeyhole size={36} strokeWidth={1.5} />
                        </div>
                        <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-800">
                            Secure your account
                        </h1>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-[320px] mx-auto font-medium">
                            Create a strong, unique password to protect your Zuta marketplace data.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* Password Inputs */}
                        <div className="space-y-4">
                            <Password
                                label="New Password"
                                name="new_password"
                                value={new_password}
                                handleChange={(e) => setNewPassword(e.target.value)}
                            />

                            {/* Live Validation UI */}
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-y-2">
                                <CriteriaItem met={checks.length} label="8+ Characters" />
                                <CriteriaItem met={checks.number} label="At least 1 number" />
                                <CriteriaItem met={checks.special} label="1 Special char" />
                                <CriteriaItem met={checks.match} label="Passwords match" />
                            </div>

                            <Password
                                label="Confirm New Password"
                                name="confirmNewPassword"
                                value={confirmNewPassword}
                                handleChange={(e) => setConfirmNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-2">
                            <ButtonFull
                                action={isLoading ? "Updating Security..." : "Reset Password"}
                                loading={isLoading}
                                onClick={submit}
                            />
                        </div>

                        {/* Security Alert Footer */}
                        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-3 items-start">
                            <ShieldAlert size={18} className="text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] leading-relaxed text-blue-700 font-medium">
                                Once updated, you will be redirected to the login page. Ensure you don't share your password with anyone, including Zuta staff.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                        <div className="flex items-center justify-center gap-2 text-emerald-600 mb-2">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encryption</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
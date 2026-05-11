import { useState } from 'react'
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { FaGoogle } from "react-icons/fa";
import Password from "../../Components/inputs/Password";
import ButtonFull from "../../Components/buttons/ButtonFull";
import { useRouter } from 'next/router';
import axiosInstance from '../../Utils/axiosConfig';
import TextInput from '../../Components/inputs/MyTextInput';
import LoginSelectWorkSpaceModal from '../../Components/modals/switch-worskapce/LoginSelectWorkSpaceModal';
import Link from 'next/link';

export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({ email: '', password: '' });
    const [showSwitchProfileModal, setShowSwitchProfileModal] = useState(false);

    const handleDataChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const socialSignUp = async (platform: string) => {
        try {
            const response = await axiosInstance.get(`/api/auth/${platform}/redirect`);
            router.push(response.data);
        } catch (error: any) {
            toast.error(error.message || 'Social login failed');
        }
    }

    const submit = async () => {
        if (!data.email) return toast.error('Please enter your email');
        setIsLoading(true);

        try {
            const response = await axiosInstance.post('/api/auth/login', data);
            if (response.status === 200) {
                setIsLoading(false);
                Cookies.set('user', JSON.stringify(response.data.data));
                toast.success('Welcome back!');

                if (response?.data?.data?.vendor) {
                    setShowSwitchProfileModal(true);
                } else {
                    // Logic for redirect
                    (router.asPath !== '/' && !router.asPath.includes('/auth')) ? router.back() : router.push('/');
                }
            }
        } catch (error: any) {
            console.log({error})
            setIsLoading(false);
            toast.error(error.response?.data?.message || 'Login failed');
            if(error?.response?.status === 413) {
                router.push('/auth/requestEmailVerification');
            }
        }
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            <LoginSelectWorkSpaceModal show={showSwitchProfileModal} setShow={setShowSwitchProfileModal} />

            {/* Left Side: Brand/Marketing (Hidden on Mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-orange-600 relative overflow-hidden items-center justify-center p-12">
                <div className="relative z-10 text-white max-w-md">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Shop better, together.</h1>
                    <p className="text-orange-100 text-lg leading-relaxed">
                        Join thousands of shoppers on Zuta saving up to 40% through community-driven wholesale deals.
                    </p>
                </div>
                {/* Decorative element */}
                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Don't have an account? {' '}
                            <span 
                                className="text-orange-600 hover:text-orange-500 font-semibold cursor-pointer transition-colors"
                                onClick={() => router.push('/auth/register')}
                            >
                                Create one for free
                            </span>
                        </p>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-1">
                        <button 
                            onClick={() => socialSignUp('google')}
                            className="flex justify-center items-center py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
                        >
                            <FaGoogle className="text-[#DB4437] text-xl" />
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200"></span></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Or continue with email</span></div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5">
                        <TextInput
                            label="Email Address"
                            name="email"
                            value={data.email}
                            handleChange={handleDataChange}
                        />
                        <div className="space-y-1">
                            <Password
                                label="Password"
                                name="password"
                                value={data.password}
                                handleChange={handleDataChange}
                            />
                            <div className="flex items-center justify-end mt-2">
                                <span 
                                    className="text-xs font-medium text-orange-600 hover:underline cursor-pointer"
                                    onClick={() => router.push('/auth/forgotPassword')}
                                >
                                    Forgot password?
                                </span>
                            </div>
                        </div>

                        <div className="pt-2">
                            <ButtonFull
                                action="Sign In"
                                loading={isLoading}
                                onClick={submit}
                                // className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
                            />
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400">
                        By signing in, you agree to Zuta's 
                        <Link href='/legal'><span className="underline text-gray-600 mx-1">Terms of Service</span></Link> and 
                        <Link href='/legal'><span className="underline text-gray-600 mx-1">Privacy Policy</span></Link>.
                    </p>
                </div>
            </div>
        </div>
    );
}
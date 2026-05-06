import { useState } from 'react'
import { toast } from 'react-toastify';
import ButtonFull from "../../Components/buttons/ButtonFull"
import Password from "../../Components/inputs/Password"
import TextInput from "../../Components/inputs/MyTextInput"
import axiosInstance from '../../Utils/axiosConfig';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { FaGoogle } from "react-icons/fa";

const Register = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const handleDataChange = (e: any) => {
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const socialSignUp = async (platform: string) => {
        try {
            const response = await axiosInstance.get(`/api/auth/${platform}/redirect`);
            router.push(response.data);
        } catch (error: any) {
            toast.error('Social registration failed. Please try email.');
        }
    }

    const submit = async () => {
        if (!data.name) return toast.error('Please enter your full name');
        if (!data.email) return toast.error('Add a valid email address');
        if (!data.phone || data.phone.length <= 10) return toast.error('Add a valid phone number');
        if (data.password.length < 6) return toast.error('Password must be at least 6 characters');
        if (data.password !== data.password_confirmation) return toast.error('Passwords do not match');

        setIsLoading(true);
        try {
            const response = await axiosInstance.post('/api/auth/register', data);
            if (response.status === 201) {
                Cookies.set('user', JSON.stringify(response.data.data));
                toast.success('Welcome to Zuta!');
                setTimeout(() => router.push('/'), 2000);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            
            {/* Left Side: Brand Experience */}
            <div className="hidden lg:flex lg:w-1/2 bg-orange-600 relative overflow-hidden items-center justify-center p-12">
                <div className="relative z-10 text-white max-w-md">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md mb-8 flex items-center justify-center">
                        <span className="text-3xl font-bold">Z</span>
                    </div>
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">Unlock Wholesale Prices.</h1>
                    <p className="text-orange-100 text-lg leading-relaxed">
                        Create an account today and start buying with your community. Experience the power of social shopping.
                    </p>
                </div>
                {/* Visual Blurs */}
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white overflow-y-auto">
                <div className="w-full max-w-md space-y-7 my-auto">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create Account</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Already have an account? {' '}
                            <span 
                                className="text-orange-600 hover:text-orange-500 font-semibold cursor-pointer transition-colors"
                                onClick={() => router.push('/auth/signIn')}
                            >
                                Sign in
                            </span>
                        </p>
                    </div>

                    {/* Social Registration */}
                    <div className="grid grid-cols-1">
                        <button onClick={() => socialSignUp('google')} className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all active:scale-95">
                            <FaGoogle className="text-[#DB4437] text-xl" />
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white px-4 text-gray-400 font-bold">Or register with email</span></div>
                    </div>

                    {/* Manual Form */}
                    <div className="space-y-4">
                        <TextInput
                            label="Full Name"
                            name="name"
                            value={data.name}
                            handleChange={handleDataChange}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <TextInput
                                label="Email"
                                name="email"
                                type="email"
                                value={data.email}
                                handleChange={handleDataChange}
                            />
                            <TextInput
                                label="Phone"
                                name="phone"
                                type="tel"
                                value={data.phone}
                                handleChange={handleDataChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Password
                                label="Password"
                                name="password"
                                value={data.password}
                                handleChange={handleDataChange}
                            />
                            <Password
                                label="Confirm"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                handleChange={handleDataChange}
                            />
                        </div>

                        <div className="pt-4">
                            <ButtonFull
                                action="Create Zuta Account"
                                loading={isLoading}
                                onClick={submit}
                            />
                        </div>
                    </div>

                    <p className="text-center text-[11px] text-gray-400 px-4 leading-relaxed">
                        By clicking "Create Zuta Account", you agree to our <span className="text-gray-600 underline">Terms</span>, <span className="text-gray-600 underline">Privacy Policy</span> and <span className="text-gray-600 underline">Cookie Use</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
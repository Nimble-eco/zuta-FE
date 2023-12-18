import { useState } from 'react'
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";
import { FaGoogle,
    FaTwitter,
    FaFacebook
} from "react-icons/fa";
import Password from "../../Components/inputs/Password";
import ButtonFull from "../../Components/buttons/ButtonFull";
import { useRouter } from 'next/router';
import axiosInstance from '../../Utils/axiosConfig';
import TextInput from '../../Components/inputs/MyTextInput';

export default function SignIn({ providers }: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const handleDataChange = (e: any) => {
        setData({...data, [e.target.name]: e.target.value});
    }

    if(typeof window !== 'undefined') injectStyle();

    const socialSignUp = async (platform: string) => {

        const getSocialSignInRedirectUrl = async () => { 
            await axiosInstance.get(`/api/auth/${platform}/redirect`)
            .then((response) => {
                router.push(response.data)
            })
            .catch(error => {
                toast.error(error.message || 'Error try again later');
            });
        }

        switch (platform.toLowerCase()) {
            case 'google':
                await getSocialSignInRedirectUrl();
            break;

            case 'facebook':
                await getSocialSignInRedirectUrl();
            break;

            case 'twitter':
                await getSocialSignInRedirectUrl();
            break;
        
            default:
                break;
        }
    }

    const submit = async () => {
        if(!data.email) return toast.error('Add a valid email address');

        setIsLoading(true);

        await axiosInstance.post('/api/auth/login', data)
        .then((response) => {
            if(response.status === 200) {
                setIsLoading(false);
                Cookies.set('user', JSON.stringify(response.data.data))
                toast.success('Login successful');
                setTimeout(() => {
                    if (router && router.asPath && router.asPath !== '/') router.back();
                    else router.push('/');
                }, 5000);
            }
        })
        .catch(error => {
            console.log({error})
            setIsLoading(false);
            toast.error(error.response?.data?.message || 'Error try again later');
        })
    }

  return (
    <div className="min-h-screen flex flex-row my-0 mx-0 overflow-y-scroll">
        <ToastContainer />
        <div className='hidden lg:flex w-[50%] bg-orange-700'>

        </div>

        <div className="flex flex-col w-full md:w-[80%] md:mx-auto lg:w-[50%] lg:mx-0 px-8 py-6 align-middle my-auto !bg-white">
            <h2 className="text-orange-600 text-lg lg:text-2xl text-center font-semibold">Sign In Here</h2>
            <p className='text-xs lg:text-sm text-gray-700 font-medium opacity-30 mb-8 text-center'>Buy with a community and enjoy whole sale discounts</p>

            <div className="flex flex-col gap-8">

                <TextInput
                    label="Email"
                    name="email"
                    value={data.email}
                    handleChange={handleDataChange}
                />

                <Password
                    label="Password"
                    name="password"
                    value={data.password}
                    handleChange={handleDataChange}
                />

                <div className="w-[80%] lg:w-[50%] mx-auto h-14">
                    <ButtonFull
                        action="Login"
                        loading={isLoading}
                        onClick={submit}
                    />
                </div>

                <p className="font-lg text-center">
                    Don't have an account ? {" "}
                    <span className="text-orange-500 cursor-pointer font-medium" onClick={() => router.push('/auth/register')}>
                        Sign up here
                    </span>
                </p>
            </div>

            <p className="font-semibold opacity-30 text-lg text-center my-4">OR</p>

            <div className="flex flex-col md:flex-row gap-5 text-white text-sm font-medium w-full md:w-fit mx-auto mb-8">
                <div
                    className="flex flex-row items-center border border-[#DB4437] rounded-md cursor-pointer"
                    onClick={() => socialSignUp('google')}
                >
                    <FaGoogle className="text-2xl w-[20%] text-[#DB4437] text-center "/>
                    <span 
                        className="bg-[#DB4437] w-[80%] px-3 py-2 whitespace-nowrap"
                    >
                        Sign in with Google
                    </span>
                </div>

                <div
                    className="flex flex-row items-center border border-[#4267B2] rounded-md cursor-pointer"
                >
                    <FaFacebook className="text-2xl w-[20%] text-[#4267B2] text-center "/>
                    <span 
                        className="bg-[#4267B2] w-[80%] px-3 py-2 whitespace-nowrap"
                    >
                        Sign in with Facebook
                    </span>
                </div>

                <div
                    className="flex flex-row items-center border border-blue-400 rounded-md cursor-pointer"
                >
                    <FaTwitter className="text-2xl w-[20%] text-[#1DA1F2] text-center "/>
                    <span 
                        className="bg-[#1DA1F2] w-[80%] px-3 py-2 whitespace-nowrap"
                    >
                        Sign in with Twitter
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
}

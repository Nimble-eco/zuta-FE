import { useRouter } from "next/router";
import ButtonFull from "../../Components/buttons/ButtonFull"
import Header from "../../Components/Header"
import Password from "../../Components/inputs/Password"
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../Utils/axiosConfig";

const verifyEmail = () => {
    const router = useRouter();
    const email = router.query.email;
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const submit = async () => {
        if(!otp) return toast.error('Enter OTP Code');

        setIsLoading(true);
        await axiosInstance.post('/api/auth/verify-email', {email, otp})
        .then((response) => {
            if(response.status === 202) {
                setIsLoading(false);
                toast.success('Email address has been verified successfully');
                router.push('/auth/signIn');
            }
        })
        .catch(error => {
            console.log({error})
            setIsLoading(false);
            toast.error(error.response?.data?.message || 'Error try again later');
        })
    }

  return (
    <div className="items-center justify-center w-full align-middle my-auto !bg-gray-100 min-h-screen">
        <Header search={false}/>
        <div className='flex flex-col gap-10 px-6 py-8 w-full md:w-[80%] md:mx-auto lg:w-[40%] h-fit my-auto bg-white rounded-xl border-opacity-40 mt-10'>
            <h2 className="text-orange-600 text-lg lg:text-2xl text-center font-semibold">Verify Email Address</h2>
            <p className='text-gray-600 font-medium text-sm text-center'>Enter OTP Code sent to your email</p>

            <Password
                label="OTP Code"
                name="otp"
                value={otp}
                handleChange={(e)=>setOtp(e.target.value)}
            />

            <div className="w-[80%] lg:w-[50%] mx-auto h-14">
                <ButtonFull
                    action="Submit"
                    loading={isLoading}
                    onClick={submit}
                />
            </div>
        </div>
    </div>
  )
}

export default verifyEmail
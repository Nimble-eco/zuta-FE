import React, { useState } from 'react'
import ButtonFull from '../../Components/buttons/ButtonFull'
import TextInput from '../../Components/inputs/MyTextInput';
import Header from '../../Components/Header';
import { toast } from 'react-toastify';
import axiosInstance from '../../Utils/axiosConfig';
import { useRouter } from 'next/router';

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const submit = async () => {
        if(!email) return toast.error('Add a valid email address');

        setIsLoading(true);
        await axiosInstance.post('/api/auth/password/request/reset', {email})
        .then((response) => {
            if(response.status === 200) {
                setIsLoading(false);
                toast.success('Reset passsword link has been sent to this email');
                router.push('/auth/resetPassword');
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
            <h2 className="text-orange-600 text-lg lg:text-2xl text-center font-semibold">Forgot Password</h2>
            <p className='text-gray-600 font-medium text-sm text-center'>Enter your email to reset your password</p>

            <TextInput
                label="Email"
                name="email"
                value={email}
                handleChange={(e)=>setEmail(e.target.value)}
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

export default ForgotPassword
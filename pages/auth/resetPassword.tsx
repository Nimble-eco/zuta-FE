import React, { useState } from 'react'
import ColumnTextInput from '../../Components/inputs/ColumnTextInput'
import ButtonFull from '../../Components/buttons/ButtonFull'
import TextInput from '../../Components/inputs/MyTextInput';
import Header from '../../Components/Header';
import { toast } from 'react-toastify';
import axiosInstance from '../../Utils/axiosConfig';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Password from '../../Components/inputs/Password';

const ResetPassword = () => {
    const router = useRouter();
    const [new_password, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {email, token } = router.query;
    console.log({token, email})

    const submit = async () => {
        if(!email) return toast.error('Missing email address');
        if(!new_password) return toast.error('Add a valid password');
        if(!confirmNewPassword) return toast.error('Please confirm password');
        if(new_password !== confirmNewPassword) return toast.error('Password missmatch');

        setIsLoading(true);
        await axiosInstance.post('/api/auth/password/reset', {email, token, new_password})
        .then((response) => {
            console.log({response})
            if(response.status === 200) {
                setIsLoading(false);
                toast.success('Reset passsword succesfull');
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
            <h2 className="text-orange-600 text-lg lg:text-2xl text-center font-semibold">Reset Password</h2>
            <p className='text-gray-600 font-medium text-sm text-center'>Enter your new password</p>

            <Password
                label="New Password"
                name="new_password"
                value={new_password}
                handleChange={(e)=>setNewPassword(e.target.value)}
            />

            <Password
                label="Confirm New Password"
                name="confirmNewPassword"
                value={confirmNewPassword}
                handleChange={(e)=>setConfirmNewPassword(e.target.value)}
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

export default ResetPassword
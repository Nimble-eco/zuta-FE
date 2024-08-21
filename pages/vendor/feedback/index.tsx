import { useState } from 'react'
import { toast } from 'react-toastify'
import VendorSideNavPanel from '../../../Components/vendor/layout/VendorSideNavPanel'
import FeedbackForm from '../../../Components/vendor/feedback/FeedbackForm'
import ButtonFull from '../../../Components/buttons/ButtonFull'
import { storeFeedbackAction } from '../../../requests/feedback/feedback.request';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router'
import MyDropDownInput from '../../../Components/inputs/MyDropDownInput'
import { feedbackCategories, feedbackTypes } from '../../../Utils/data'

const index = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');

    let user: any = {}

    if(typeof window !== 'undefined') {
        user = JSON.parse(Cookies.get('user')!);
    }

    const sendFeedback = async () => {
        if(!message) return toast.error('Message cannot be empty');

        setIsLoading(true);
        await storeFeedbackAction({
            comment: message,
            user_id: user?.id,
            email: user?.email,
            type,
            category
        })
        .then((response) => {
            if(response.status === 201) {
                toast.success('Your feedback has been submitted');
            }
        })
        .catch(error => {
            console.log({error})
            toast.error(
                error?.response?.data?.message ||
                error?.response?.data  || 
                'Error submitting feedback'
            );
            if(error?.response?.status === (401 || 403)) router.push('/auth/signIn');
            if(error?.response?.status === 422) {
                const errors = error?.response?.data?.error?.errors;
                errors?.map((validationError: any) => {
                    toast.error(`${validationError?.field} ${validationError?.rule}`);
                })
            }
        })
        .finally(() => setIsLoading(false));
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex flex-row w-[90%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[21%]">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Feedback</h2>
                <div className="flex flex-col gap-4 py-3 px-4 relative bg-white min-h-[50vh] h-fit">
                    <div className="grid grid-cols-2 gap-4">
                        <MyDropDownInput
                            label="Category"
                            name="category"
                            value={category}
                            onSelect={(e: any)=>setCategory(e.target?.value)}
                            options={feedbackCategories}
                        />

                        <MyDropDownInput
                            label="Type of feedback"
                            name="type"
                            value={type}
                            onSelect={(e: any)=>setType(e.target?.value)}
                            options={feedbackTypes}
                        />
                    </div>

                    <FeedbackForm 
                        message={message}
                        handleMessageChange={(e: any) => setMessage(e.target.value)}
                    />

                    <div className='w-fit absolute right-2 bottom-2'>
                        <ButtonFull 
                            action='Send'
                            loading={isLoading}
                            onClick={sendFeedback}
                        />

                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default index
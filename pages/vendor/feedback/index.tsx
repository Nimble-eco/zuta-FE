import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { injectStyle } from "react-toastify/dist/inject-style";
import VendorSideNavPanel from '../../../Components/vendor/layout/VendorSideNavPanel'
import FeedbackForm from '../../../Components/vendor/feedback/FeedbackForm'
import ButtonFull from '../../../Components/buttons/ButtonFull'
import { storeFeedbackAction } from '../../../requests/feedback/feedback.request';
import Cookies from 'js-cookie';

const index = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setFMessage] = useState('');
    let user: any = {}

    if(typeof window !== 'undefined') {
        injectStyle();
        user = JSON.parse(Cookies.get('user')!);
    }

    const sendFeedback = async () => {
        if(!message) return toast.error('Message cannot be empty');

        setIsLoading(true);
        await storeFeedbackAction({
            comment: message,
            user_id: user?.id,
            email: user?.email
        })
        .then((response) => {
            if(response.status === 201) {
                toast.success('Your feedback has been submitted');
            }
        })
        .catch(error => {
            console.log({error})
            toast.error(error.response?.data?.message ?? 'Error try agin later');
        })
        .finally(() => setIsLoading(false));
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <ToastContainer />
        <div className="flex flex-row w-[90%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[21%]">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Feedback</h2>
                <div className="flex flex-col py-3 px-4 relative bg-white min-h-[50vh] h-fit">
                    <FeedbackForm 
                        message={message}
                        handleMessageChange={(e: any) => setFMessage(e.target.value)}
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
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
import ImagePicker from '../../../Components/inputs/ImagePicker'
import { convertToBase64 } from '../../../Utils/convertImageToBase64'
import VendorNavBar from '../../../Components/vendor/layout/VendorNavBar'

const index = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState<any>(null);
    const [base64Image, setBase64Image] = useState('');

    let user: any = {}

    if(typeof window !== 'undefined') {
        user = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null;
    }

    const selectImage = async (e: any) => {
        let base64_image = await convertToBase64(e.target.files[0]);
        setBase64Image(base64_image!);
        setImage(e.target.files[0]);
    }

    const removeImage = async () => {
        setBase64Image('');
        setImage(null);
    }

    const sendFeedback = async () => {
        if(!message) return toast.error('Message cannot be empty');

        setIsLoading(true);
        await storeFeedbackAction({
            comment: message,
            user_id: user?.id,
            email: user?.email,
            type,
            category,
            image
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
            if(error?.response?.status === 401 || error?.response?.status === 403) router.push('/auth/signIn');
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
    <div className="min-h-screen bg-white lg:bg-gray-100 flex flex-col">
        <div className="flex flex-row w-full mx-auto relative">
            <VendorSideNavPanel />
            <div className="flex flex-col lg:w-[80%] lg:absolute lg:right-0 lg:left-[20%]">
                <VendorNavBar />
                <div className="flex flex-col gap-4 py-3 px-4 relative bg-white min-h-[50vh] h-fit">
                    <h2 className="text-xl font-semibold text-slate-700 !text-center lg:!text-left">Feedback</h2>
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

                    <ImagePicker
                        label='Screenshot'
                        files={[base64Image]}
                        onSelect={selectImage}
                        onRemove={removeImage}
                    />

                    <div className='w-[80%] md:w-[60%] lg:w-[30%] !mx-auto lg:!mx-0 lg:!ml-[68%]'>
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
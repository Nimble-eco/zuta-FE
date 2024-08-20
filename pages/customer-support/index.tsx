import { useState } from "react"
import ButtonFull from "../../Components/buttons/ButtonFull"
import Header from "../../Components/Header"
import TextAreaInput from "../../Components/inputs/TextAreaInput";
import MyDropDownInput from "../../Components/inputs/MyDropDownInput";
import { toast } from "react-toastify";
import { convertToBase64 } from "../../Utils/convertImageToBase64";
import { FaInstagram, FaTelegram, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { storeFeedbackAction } from "../../requests/feedback/feedback.request";
import { useRouter } from "next/router";
import { feedbackCategories, feedbackTypes } from "../../Utils/data";

const CustomerSupport = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState<string | undefined>(undefined);
    
    const selectImage = async (e: any) => {
        let base64_image = await convertToBase64(e.target.files[0]);
        setImage(base64_image!);
    }

    const submit = async () => {
        if(!comment) return toast.error('Add a comment');
       
        setIsLoading(true);

        await storeFeedbackAction({type, category, comment, image})
        .then(response => {
            if(response.status === 201) return toast.success('Thank you for reaching out, your feedback has been noted');
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
        .finally(()=>setIsLoading(false))
    }

  return (
    <div className="items-center justify-center w-full align-middle my-auto !bg-white min-h-screen">
        <Header search={false}/>
       
        <div className='flex flex-col-reverse md:flex-row gap-6 px-6 w-full'>
            <div className='flex flex-col md:w-[60%]'>
                <h2 className="text-slate-700 text-xl font-bold my-4 text-center md:text-left">Customer support</h2>
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

                <TextAreaInput
                    label="Comment"
                    value={comment}
                    onInputChange={(e: any)=>setComment(e.target.value)}
                    name="comment"
                    placeHolder="Enter your comment here"
                />
                
                <div className="flex flex-row gap-4 items-center">
                    <label htmlFor="image" className="font-semibold">Image:</label>
                    <input
                        type="file"
                        name="image"
                        onChange={selectImage}
                    />
                </div>

                <div className="w-[80%] lg:w-[50%] mx-auto h-10 mt-4">
                    <ButtonFull
                        action="Submit"
                        loading={isLoading}
                        onClick={submit}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-4 md:w-[40%] justify-center align-middle">
                <p className="text-lg text-center text-gray-500 hidden lg:block">Or</p>
                <p className='text-gray-700 font-medium text-center mt-4 md:mt-0'>Reach out to us on our socials</p>
                <div className='flex flex-row items-center justify-center lg:grid lg:grid-cols-2 gap-4 text-white'>
                    <div
                        className="flex flex-row items-center lg:border border-[#FD1D1D] rounded-md cursor-pointer"
                    >
                        <FaInstagram className="text-2xl lg:text-2xl lg:w-[20%] text-[#FD1D1D] text-center "/>
                        <span 
                            className="bg-[#FD1D1D] w-[80%] px-3 py-2 whitespace-nowrap hidden lg:flex"
                        >
                            Follow on Instagram
                        </span>
                    </div>

                    <div
                        className="flex flex-row items-center lg:border border-[#25D366] rounded-md cursor-pointer"
                    >
                        <FaWhatsapp className="text-2xl lg:text-2xl lg:w-[20%] text-[#25D366] text-center "/>
                        <span 
                            className="bg-[#25D366] w-[80%] px-3 py-2 whitespace-nowrap hidden lg:flex"
                        >
                            Chat us on WhatsApp
                        </span>
                    </div>

                    <div
                        className="flex flex-row items-center lg:border border-black rounded-md cursor-pointer"
                    >
                        <FaTwitter className="text-2xl lg:text-2xl lg:w-[20%] text-black text-center "/>
                        <span 
                            className="bg-black w-[80%] px-3 py-2 whitespace-nowrap hidden lg:flex"
                        >
                            Follow on X
                        </span>
                    </div>

                    <div
                        className="flex flex-row items-center lg:border border-[#229ED9] rounded-md cursor-pointer"
                    >
                        <FaTelegram className="text-2xl lg:text-2xl lg:w-[20%] text-[#1DA1F2] text-center "/>
                        <span 
                            className="bg-[#229ED9] w-[80%] px-3 py-2 whitespace-nowrap hidden lg:flex"
                        >
                            Join us on Telegram
                        </span>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-1 lg:items-center lg:justify-center text-center">
                    <p className="font-medium text-gray-800">Send us an email @</p>
                    <p className="text-lg font-medium text-orange-600">support@zuta.com.ng</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CustomerSupport
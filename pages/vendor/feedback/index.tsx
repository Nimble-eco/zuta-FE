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
import { Send, MessageSquare, Twitter, Instagram, Send as Telegram, HelpCircle, Image as ImageIcon } from "lucide-react";

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

    const socialChannels = [
        { 
            name: 'Telegram', 
            icon: <Telegram size={20} />, 
            link: 'https://t.me/zutahq', 
            color: 'bg-[#229ED9]', 
            handle: '@ZutaSupport' 
        },
        { 
            name: 'Twitter', 
            icon: <Twitter size={20} />, 
            link: 'https://twitter.com/zutahq', 
            color: 'bg-black', 
            handle: '@Zuta_HQ' 
        },
        { 
            name: 'Instagram', 
            icon: <Instagram size={20} />, 
            link: 'https://instagram.com/zutahq', 
            color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', 
            handle: '@zuta_marketplace' 
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-row">
          <VendorSideNavPanel />
    
          <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
            <VendorNavBar />
    
            <div className="p-4 lg:p-8">
              <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                
                {/* LEFT: FEEDBACK FORM */}
                <div className="flex-1 space-y-6">
                  <header>
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                      <MessageSquare className="text-indigo-600" size={24} />
                      Vendor Feedback
                    </h1>
                    <p className="text-slate-500 text-sm">Have a suggestion or found a bug? Let the Zuta team know.</p>
                  </header>
    
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MyDropDownInput
                        label="Category"
                        name="category"
                        value={category}
                        onSelect={(e: any) => setCategory(e.target?.value)}
                        options={feedbackCategories}
                      />
                      <MyDropDownInput
                        label="Feedback Type"
                        name="type"
                        value={type}
                        onSelect={(e: any) => setType(e.target?.value)}
                        options={feedbackTypes}
                      />
                    </div>
    
                    <div className="space-y-1">
                      <FeedbackForm 
                        message={message}
                        handleMessageChange={(e: any) => setMessage(e.target.value)}
                      />
                    </div>
    
                    <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
                      <div className="flex items-center gap-2 mb-3 text-slate-600">
                        <ImageIcon size={18} />
                        <span className="text-sm font-semibold">Attach Screenshot (Optional)</span>
                      </div>
                      <ImagePicker
                        label=""
                        files={[base64Image]}
                        onSelect={selectImage}
                        onRemove={removeImage}
                      />
                    </div>
    
                    <div className="pt-2">
                      <ButtonFull 
                        action={isLoading ? 'Submitting...' : 'Submit Feedback'}
                        loading={isLoading}
                        onClick={sendFeedback}
                      />
                    </div>
                  </div>
                </div>
    
                {/* RIGHT: SOCIAL CHANNELS & HELP */}
                <div className="w-full lg:w-[350px] space-y-6">
                  <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
                    <h3 className="font-bold text-lg flex items-center gap-2 mb-2">
                      <HelpCircle size={20} />
                      Need Quick Help?
                    </h3>
                    <p className="text-indigo-100 text-xs leading-relaxed mb-6">
                      For urgent issues regarding payments or active orders, reach us directly on our social channels for a faster response.
                    </p>
    
                    <div className="space-y-3">
                      {socialChannels.map((channel) => (
                        <a 
                          key={channel.name}
                          href={channel.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${channel.color} text-white shadow-sm`}>
                              {channel.icon}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold">{channel.name}</span>
                              <span className="text-[10px] text-indigo-200">{channel.handle}</span>
                            </div>
                          </div>
                          <Send size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ))}
                    </div>
                  </div>
    
                    {/* TICKET STATUS HINT */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Response Time</h4>
                        <div className="flex items-center gap-3 text-slate-700">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-medium">Support Team is Online</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">Formal feedback is usually reviewed within 24 hours.</p>
                    </div>
                </div>
              </div>
            </div>
          </main>
        </div>
    );
}

export default index
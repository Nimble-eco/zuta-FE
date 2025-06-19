import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav";
import ButtonFull from "../../../Components/buttons/ButtonFull";
import { useRouter } from "next/router";
import { useState } from "react";
import MyDropDownInput from "../../../Components/inputs/MyDropDownInput";
import { feedbackCategories, feedbackStatusTypes, feedbackTypes, priorityTypes } from "../../../Utils/data";
import TextAreaInput from "../../../Components/inputs/TextAreaInput";
import TextCard from "../../../Components/texts/TextCard";
import { updateFeedbackAction } from "../../../requests/feedback/feedback.request";
import { toast } from "react-toastify";
import AdminNavBar from "../../../Components/admin/layout/AdminNavBar";

interface IShowFeedbackProps {
    feedback: any;
}

const Show = ({feedback}: IShowFeedbackProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [feedbackData, setFeedbackData] = useState<any>(feedback.data);

    const handleChange = (e: any) => {
        setFeedbackData((prev: any) => ({
            ...feedbackData,
            [e.target.name]: e.target.value
        }))
    }

    const updateFeedback = async () => {
        setIsLoading(true);
        await updateFeedbackAction({
           id: feedback.data?.id,
           type: feedbackData.type,
           category: feedbackData.category,
           priority: feedbackData.priority,
           status: feedbackData.status,
        })
        .then((response) => {
            if(response.status === 202) {
                setIsLoading(false);
                toast.success('Feedback updated successfully');
                router.push('/admin/feedback')
            }
        })
        .catch(error => {
            console.log({error})
            toast.error(error.response?.data?.message ?? 'Error try agin later');
        })
        .finally(() => setIsLoading(false));
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-scroll">
        <div className="flex flex-row w-full mx-auto relative mb-10">
            <AdminSideNavPanel />
            <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] gap-4 !px-2 lg:px-0">
                <AdminNavBar />
                <div className="flex flex-row justify-between items-center py-4 px-4 bg-white border-b border-gray-200 mt-14 lg:mt-0">
                    <h2 className="text-lg font-bold">Feedback Details</h2>
                    <div className="flex flex-row gap-4 items-center">
                        <div className="w-fit">
                            <ButtonFull 
                                action="Update"
                                loading={isLoading}
                                onClick={updateFeedback}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-white py-3 px-4">
                    <div className="grid grid-cols-2 gap-4">
                        <MyDropDownInput
                            label="Category"
                            name="category"
                            value={feedbackData.category}
                            onSelect={handleChange}
                            options={feedbackCategories}
                        />
                        <MyDropDownInput
                            label="Type"
                            name="type"
                            value={feedbackData.type}
                            onSelect={handleChange}
                            options={feedbackTypes}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <MyDropDownInput
                            label="priority"
                            name="priority"
                            value={feedbackData.priority}
                            onSelect={handleChange}
                            options={priorityTypes}
                        />
                        <MyDropDownInput
                            label="Status"
                            name="status"
                            value={feedbackData.status}
                            onSelect={handleChange}
                            options={feedbackStatusTypes}
                        />
                    </div>
                    <TextAreaInput
                        label="Comment"
                        value={feedbackData?.comment}
                        name="comment"
                        onInputChange={handleChange}
                    />

                    {feedbackData?.image && (
                        <>
                            <p className='text-base font-bold text-slate-800'>Screenshot</p>
                            <img src={feedbackData?.image} alt="feedback" className="h-640 w-64 rounded-md object cover object-center" />
                        </>
                    )}
                </div>

                {
                    feedbackData?.user && (
                        <div className="flex flex-col gap-4 bg-white py-5 rounded-md">
                            <div className="flex flex-row justify-between px-4 items-center">
                                <p className="font-semibold text-slate-700">User</p>
                                <a href={`/admin/users/${feedbackData?.user?.id}`} className="!text-orange-500 border border-orange-500 rounded-md px-4 py-1">View</a>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <TextCard label="Name" value={feedbackData?.user?.name} />
                                <TextCard label="Email" value={feedbackData?.user?.email} />
                                <TextCard label="Phone number" value={feedbackData?.user?.phone} />
                                <TextCard label="Verified" value={feedbackData?.user?.user_verified ? 'True' : 'False'} />
                                <TextCard label="Blocked" value={feedbackData?.user?.blocked ? 'True' : 'False'} />
                                <TextCard label="Flag" value={feedbackData?.user?.flag} />
                                <TextCard label="Birth Year" value={feedbackData?.user?.birth_year} />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    </div>
  )
}

export default Show

export async function getServerSideProps(context: any) {
    const { id } = context.query;
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getFeedback = await axiosInstance.get('/api/feedback/show?id=' + id, {
            headers: { Authorization: token }
        });

        const [feedbackResult] = await Promise.allSettled([
            getFeedback
        ]);

        const feedback = feedbackResult.status === 'fulfilled' ? feedbackResult?.value?.data : [];
       
        return {
            props: {
                feedback
            }
        }

    } catch(error: any) {
        console.log({error})
        if(error?.response?.status === 401 || error?.response?.status === 403) {
            return {
                redirect: {
                  destination: '/auth/signIn',
                  permanent: false
                }
            }
        }

        return {
            props: {
                feedback: {}
            }
        }
    }
}
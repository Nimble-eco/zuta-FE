import { useState } from "react"
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav"
import ButtonFull from "../../../Components/buttons/ButtonFull"
import ColumnTextInput from "../../../Components/inputs/ColumnTextInput";
import TextAreaInput from "../../../Components/inputs/TextAreaInput";
import MyDropDownInput from "../../../Components/inputs/MyDropDownInput";
import ImagePicker from "../../../Components/inputs/ImagePicker";
import { convertToBase64 } from "../../../Utils/convertImageToBase64";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { deleteBannerAction, updateBannersAction } from "../../../requests/banners/banner.request";
import axiosInstance from "../../../Utils/axiosConfig";
import { parse } from "cookie";
import ButtonGhost from "../../../Components/buttons/ButtonGhost";

interface IUpdateBannerProps {
    banner: any;
}

const update = ({banner}: IUpdateBannerProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [newBanner, setNewBanner] = useState<any>({
        ...banner, 
        image: undefined,
        base64_images: banner.image
    }); 
    
    const handleChange = (e: any) => {
        setNewBanner((prev: any) => ({
            ...newBanner,
            [e.target.name]: e.target.value
        }))
    }

    const selectImage = async (e: any) => {
        let base64_image = await convertToBase64(e.target.files[0]);
        setNewBanner({...newBanner, image: e.target.files[0], base64_images: base64_image});
    }

    const updateBanner = async () => {
        setIsLoading(true);
        await updateBannersAction({
            ...newBanner,
            id: banner.id
        })
        .then((response) => {
            if(response.status === 202) {
                setIsLoading(false);
                toast.success('Banner updated successfully');
                setTimeout(()=>router.back(), 2000);
            }
        })
        .catch(error => {
            console.log({error})
            toast.error(error.response?.data?.message ?? 'Error try agin later');
        })
        .finally(() => setIsLoading(false));
    }

    const deleteBanner = async () => {
        setIsLoading(true);
        await deleteBannerAction(banner.id)
        .then((response) => {
            if(response.status === 200) {
                setIsLoading(false);
                toast.success('Banner deleted successfully');
                setTimeout(()=>router.back(), 2000);
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
        <div className="flex flex-row w-full mx-auto mt-8 relative">
            <AdminSideNavPanel />
            <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%]">
                <div className="flex flex-row justify-between items-center bg-white px-4 py-3 rounded-t-md border-b border-gray-200 mt-20 lg:mt-0">
                    <h2 className="text-lg font-bold">Banner Details</h2>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="hidden lg:flex w-fit ">
                            <ButtonGhost 
                                action="Delete"
                                loading={isLoading}
                                onClick={deleteBanner}
                            />
                        </div>
                        <div className="w-fit">
                            <ButtonFull 
                                action="Update Banner"
                                loading={isLoading}
                                onClick={updateBanner}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 bg-white py-6 px-4 rounded-md">
                    <ColumnTextInput 
                        label="Title"
                        name='title'
                        value={newBanner.title}
                        placeHolder="Enter product name"
                        onInputChange={handleChange}
                    />

                    <ColumnTextInput 
                        label="URL"
                        name='url'
                        value={newBanner.url}
                        placeHolder="E.g https://zuta.com/stores/rierer"
                        onInputChange={handleChange}
                    />

                    <TextAreaInput
                        label="Description"
                        value={newBanner.description}
                        name="description"
                        onInputChange={handleChange}
                        placeHolder="A short description"
                    />

                    <MyDropDownInput 
                        label="Enabled"
                        onSelect={handleChange}
                        name="enabled"
                        options={[
                            {title: 'true', value: '1'},
                            {title: 'false', value: '0'},
                        ]}
                        value={newBanner.enabled}
                    />

                    <ColumnTextInput 
                        label="Position"
                        name='position'
                        type="number"
                        value={newBanner.position}
                        placeHolder="Psotion in the advert slider"
                        onInputChange={handleChange}
                    />

                    <div className="my-4">
                        <ImagePicker 
                            label="Image"
                            onSelect={selectImage}
                            files={[newBanner.base64_images]}
                        />
                    </div>

                    <div className="lg:hidden flex w-full">
                        <ButtonGhost 
                            action="Delete"
                            loading={isLoading}
                            onClick={deleteBanner}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default update

export async function getServerSideProps(context: any) {
    const { id } = context.query;
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;
  
    try {
      const getBanner = await axiosInstance.get('/api/advert/banners/show?id=' + id, {
        headers: { Authorization: token }
      });
      const banner = getBanner.data?.data;
  
      return {
        props: {
          banner
        }
      }
    } catch (error: any) {
      console.log({error})
        if(error?.response?.status === 401) {
          return {
            redirect: {
              destination: '/auth/signIn',
              permanent: false
            }
          }
        }
  
        return {
          props: {banner: {}}
        }
    }
}
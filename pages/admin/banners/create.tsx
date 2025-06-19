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
import { storeBannerAction } from "../../../requests/banners/banner.request";
import AdminNavBar from "../../../Components/admin/layout/AdminNavBar";

const create = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [newBanner, setNewBanner] = useState<any>({
        title: '',
        url:'',
        descripton: '',
        image: undefined,
        base64_image: '',
        enabled: undefined,
        position: undefined
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

    const createBanner = async () => {
        setIsLoading(true);
        await storeBannerAction(newBanner)
        .then((response) => {
            if(response.status === 201) {
                setIsLoading(false);
                toast.success('Banner created successfully');
                router.push('/admin/banners')
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
            <div className="flex flex-col w-full !px-4 lg:!px-0 lg:w-[80%] lg:absolute lg:right-0 lg:left-[20%]">
                <AdminNavBar />
                <div className="flex flex-row relative items-center pr-2 py-4 mb-3 border-b border-gray-200 mt-10 lg:mt-0">
                    <h2 className="text-lg font-bold">Banner Details</h2>
                    <div className="w-fit absolute right-1 bottom-2">
                        <ButtonFull 
                            action="Create Banner"
                            loading={isLoading}
                            onClick={createBanner}
                        />
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
                </div>
            </div>
        </div>
    </div>
  )
}

export default create
import { BsFillCameraVideoFill } from "react-icons/bs";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { RiCloseCircleLine } from "react-icons/ri";
import ButtonFull from "../buttons/ButtonFull";
import { processImgUrl } from "../../Utils/helper";

interface VideoPickerProps {
    label: string;
    onSelect: (e: any) => void;
    files: any[];
    onRemove?: (e: any) => void;
    uploadFiles?: ()=>void;
    uploading?: boolean;
    disabled?: boolean;
}

const VideoPicker = ({label, onSelect, files, onRemove, uploading, uploadFiles, disabled}: VideoPickerProps) => {
    return (
    <div className='flex flex-col gap-1'>
        <div className="flex flex-row relative py-2 border-b border-gray-200">
            <h4 className="font-medium text-left pb-3 text-sm">{label}</h4>
            <div className="flex w-fit absolute right-2 bottom-1">
                <ButtonFull
                    action="Save Files"
                    loading={uploading}
                    onClick={uploadFiles}
                    disabled={disabled}
                />  
            </div>
        </div>
        {
            !files || files?.length === 0 || (files?.length === 1 && !files[0]) ? (
            <div className='flex flex-col bg-orange-50 rounded-md border-dashed justify-center text-center py-10 cursor-pointer'>
                <label className="text-sm font-semibold cursor-pointer">
                    <BsFillCameraVideoFill className="text-3xl text-orange-300 mb-3 mx-auto" />
                    Click here to select video
                    <input type="file" accept='.mp4,.3gp,.mov' onChange={onSelect} className="hidden" />
                </label>
            
            </div>
            ) : (
            <div className="flex flex-row flex-wrap overflow-y-auto gap-4">
                {
                    files?.map((file, index) => (
                        <div className="flex flex-col relative" key={index}>
                            {
                                onRemove && <RiCloseCircleLine 
                                    className="text-xl absolute top-1 right-1 z-20 text-orange-500 cursor-pointer"
                                    onClick={() => onRemove(index)}
                                />
                            }
                            <video
                                className="h-40 w-48 rounded-md object-cover object-center"
                                src={
                                    typeof(file) === 'string' ? 
                                    file?.includes('data:') ?
                                        file :
                                        processImgUrl(file) :
                                    URL.createObjectURL(file) 
                                }
                                key={index}
                                controls
                            />
                        </div>
                    ))
                }
                <div className="flex flex-col justify-center align-middle h-40 w-36 rounded-md bg-gray-300">
                    <label className="mx-auto font-medium text-orange-500 text-opacity-60 cursor-pointer">
                        Add video
                        <input type="file" accept='.mp4,.3gp,.mov' onChange={onSelect} className="hidden" />
                    </label>
                    <HiOutlinePlusCircle className="text-2xl text-center mx-auto text-orange-500 text-opacity-60" />
                </div>
            </div>
            )
        }
    </div>
  )
}

export default VideoPicker
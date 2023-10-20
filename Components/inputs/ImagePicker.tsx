import { BsFileImage } from "react-icons/bs";
import { HiOutlinePlusCircle } from "react-icons/hi";

interface ImagePickerProps {
  label: string;
  onSelect: (e: any) => void;
  files: any[];
}

const ImagePicker = ({label, onSelect, files}: ImagePickerProps) => {
  return (
    <div className='flex flex-col'>
      <p className='text-sm font-semibold text-left pl-4 py-3 border-b border-gray-200 mb-4'>
        {label}
      </p>
      {
        !files || files?.length === 0 ? (
          <div className='flex flex-col bg-orange-50 rounded-md border-dashed justify-center text-center py-10 cursor-pointer'>
            <BsFileImage className="text-3xl text-orange-300 mb-3 mx-auto" />
            <label className="text-sm font-semibold cursor-pointer">
              Click here to select image
              <input type="file" onChange={onSelect} className="hidden" />
            </label>
           
          </div>
        ) : (
          <div className="flex flex-row flex-wrap gap-4">
            {
              files?.map((file) => (
                <div className="flex flex-col relative">
                  <img
                    className="h-40 w-36 rounded-md"
                    src={file}
                  />
                </div>
              ))
            }
            <div className="flex flex-col justify-center align-middle h-40 w-36 rounded-md bg-gray-300">
              <label className="mx-auto font-medium text-orange-500 text-opacity-60 cursor-pointer">
                Add image
                <input type="file" onChange={onSelect} className="hidden" />
              </label>
              <HiOutlinePlusCircle className="text-2xl text-center mx-auto text-orange-500 text-opacity-60" />
            </div>
          </div>
        )
      }
     
    </div>
  )
}

export default ImagePicker
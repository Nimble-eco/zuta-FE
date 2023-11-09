import { BsFileImage } from "react-icons/bs";
import { HiOutlinePlusCircle } from "react-icons/hi";
import TextButton from "../buttons/TextButton";
import { RiCloseCircleLine } from "react-icons/ri";

interface ImagePickerProps {
  label: string;
  onSelect: (e: any) => void;
  files: any[];
  onRemove?: (e: any) => void;
}

const ImagePicker = ({label, onSelect, files, onRemove}: ImagePickerProps) => {
  return (
    <div className='flex flex-col'>
      <div className="flex flex-row relative py-2 mb-4 border-b border-gray-200">
        <h4 className="font-semibold text-left pb-3 pl-3">{label}</h4>
        <div className=" hidden md:flex w-fit absolute right-2 bottom-1">
          <label
            className=" hover:text-orange-800 text-orange-500 font-semibold py-2 px-4 min-w-fit mx-auto cursor-pointer"
          >
            Upload Image
            <input type="file" onChange={onSelect} className="hidden" />
          </label>  
        </div>
      </div>
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
          <div className="flex flex-row flex-wrap overflow-y-auto gap-4">
            {
              files?.map((file, index) => (
                <div className="flex flex-col relative">
                  {
                    onRemove && <RiCloseCircleLine 
                      className="text-xl absolute top-1 right-1 text-orange-500 cursor-pointer"
                      onClick={() => onRemove(index)}
                    />
                  }
                  <img
                    className="h-40 w-36 rounded-md"
                    src={file}
                    key={index}
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
            <div className="flex md:hidden w-fit mx-auto mt-8">
              <label
                className=" hover:text-orange-800 text-orange-500 font-semibold py-2 px-4 min-w-fit mx-auto cursor-pointer"
              >
                Upload Image
                <input type="file" onChange={onSelect} className="hidden" />
              </label> 
            </div>
          </div>
        )
      }
     
    </div>
  )
}

export default ImagePicker
import { BsFileImage } from "react-icons/bs";
import { HiOutlinePlusCircle } from "react-icons/hi";
import { Trash2 } from "lucide-react";
import ButtonFull from "../buttons/ButtonFull";

interface ImagePickerProps {
  label: string;
  onSelect: (e: any) => void;
  files: any[];
  onRemove?: (e: any) => void;
  uploadFiles?: ()=>void;
  uploading?: boolean;
}

const ImagePicker = ({label, onSelect, files, onRemove, uploading, uploadFiles}: ImagePickerProps) => {
  return (
    <div className='flex flex-col gap-1'>
      <div className="flex flex-row relative py-2 border-b border-gray-200">
        <h4 className="font-medium text-left pb-3 text-sm">{label}</h4>
        <div className="flex w-fit absolute right-2 bottom-1">
          <ButtonFull
            action="Upload Files"
            loading={uploading}
            onClick={uploadFiles}
          />
        </div>
      </div>
      {
        !files || files?.length === 0 || (files?.length === 1 && !files[0]) ? (
          <div className='flex flex-col bg-orange-50 rounded-md border-dashed justify-center text-center py-10 cursor-pointer'>
            <label className="text-sm font-semibold cursor-pointer">
              <BsFileImage className="text-3xl text-orange-300 mb-3 mx-auto" />
              Click here to select image
              <input type="file" onChange={onSelect} className="hidden" />
            </label>
           
          </div>
        ) : (
          <div className="flex flex-row flex-wrap overflow-y-auto gap-4">
            {
              files?.map((file, index) => (
                <div className="flex flex-col relative" key={index}>
                  {
                    onRemove && <Trash2 
                      className="text-xl absolute top-1 right-1 text-red-500 cursor-pointer"
                      onClick={() => onRemove(index)}
                    />
                  }
                  <img
                    className="h-40 w-36 rounded-md object-cover object-center"
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
          </div>
        )
      }
     
    </div>
  )
}

export default ImagePicker
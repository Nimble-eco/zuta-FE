import { BsFileImage } from "react-icons/bs";


interface ImagePickerProps {
    label: string;
    onSelect: () => void;
}

const ImagePicker = ({label, onSelect}: ImagePickerProps) => {
  return (
    <div className='flex flex-col'>
        <p className='text-sm font-semibold text-left pl-4 py-3 border-b border-gray-200 mb-4'>
            {label}
        </p>
        <div className='flex flex-col bg-orange-50 rounded-md border-dashed justify-center text-center py-10 cursor-pointer'>
            <BsFileImage className="text-3xl text-orange-300 mb-3 mx-auto" />
            <p className="text-sm font-semibold">Click here to select image</p>
        </div>
    </div>
  )
}

export default ImagePicker
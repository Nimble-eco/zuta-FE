import { GrFormClose } from "react-icons/gr";

interface ISelectedListItemCardProps {
    title: string;
    onClick: (title: string) => void;
}

const SelectedListItemCard = ({title, onClick}: ISelectedListItemCardProps) => {
  return (
    <div className="flex flex-row px-5 py-1 w-fit min-w-[6rem] h-fit rounded-[20px] bg-orange-500 bg-opacity-20 relative">
        <p className="px-3">{title}</p>

        <GrFormClose 
            className="text-xl cursor-pointer absolute right-1 top-2 text-white"
            onClick={() => onClick(title)}
        />
    </div>
  )
}

export default SelectedListItemCard
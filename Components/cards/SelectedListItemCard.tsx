import { GrFormClose } from "react-icons/gr";

interface ISelectedListItemCardProps {
    title: string;
    onClick: (title: string) => void;
}

const SelectedListItemCard = ({title, onClick}: ISelectedListItemCardProps) => {
  return (
    <div className="flex flex-row justify-between px-5 !py-2 w-fit min-w-[6rem] h-fit rounded-[20px] bg-orange-500 bg-opacity-20">
      <p className="px-1 my-auto">{title}</p>

      <GrFormClose 
        className="text-xl cursor-pointer my-auto"
        onClick={() => onClick(title)}
      />
    </div>
  )
}

export default SelectedListItemCard
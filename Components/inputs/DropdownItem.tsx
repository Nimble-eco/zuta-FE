
interface IDropdownItemProps {
    title: string;
    onClick: (value: string) => void;
}

const DropdownItem = ({title, onClick}: IDropdownItemProps) => {
  return (
    <div className="flex flex-row cursor-pointer font-medium w-full border-b-[1px] border-opacity-25 border-gray-400 pb-3" onClick={() => onClick(title)}>
        {title}
    </div>
  )
}

export default DropdownItem
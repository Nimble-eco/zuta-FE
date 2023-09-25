import { FC } from "react"

interface IButtonGhostProps {
  action: string;
  onClick: any;
  loading?: boolean;
}

const ButtonGhost: FC<IButtonGhostProps> = ({action, onClick, loading}) => {
  return (
    <button
      onClick={onClick}
      className=" hover:bg-orange-500 hover:text-white border-2 border-orange-500 text-orange-500 font-bold py-2 px-4 rounded-md min-w-fit whitespace-nowrap h-full"
    >
      {loading ? 'Loading...' : action}
    </button>  
  )
}

export default ButtonGhost
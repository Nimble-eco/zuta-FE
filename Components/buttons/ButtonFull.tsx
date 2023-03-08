import { FC } from "react"

interface IButtonFullProps {
  action: string;
  onClick: any;
  loading?: boolean;
}
const ButtonFull: FC<IButtonFullProps> = ({action, onClick, loading}) => {
  return (
    <button
      onClick={onClick}
      className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md min-w-fit mx-auto"
    >
      {loading ? 'Loading...' : action}
    </button>
  )
}

export default ButtonFull
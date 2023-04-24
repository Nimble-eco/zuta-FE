import { FC } from "react"

interface ITextButtonProps {
  action: string;
  onClick: any;
}

const TextButton: FC<ITextButtonProps> = ({action, onClick}) => {
  return (
    <p
      onClick={onClick}
      className=" hover:text-orange-800 text-orange-500 font-semibold py-2 px-4 min-w-fit mx-auto cursor-pointer"
    >
      {action}
    </p>  
  )
}

export default TextButton
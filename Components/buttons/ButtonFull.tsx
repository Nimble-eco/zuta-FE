import { FC } from "react"
import { PropagateLoader } from "react-spinners";

interface IButtonFullProps {
  action: string;
  onClick: any;
  loading?: boolean;
}

const override = {
  display: "block",
  // margin: " auto",
  padding: '10px auto',
  borderColor: " #FFFFFF",
};

const ButtonFull: FC<IButtonFullProps> = ({action, onClick, loading}) => {
  return (
    <button
      onClick={onClick}
      className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 h-14 rounded-full min-w-fit w-full mx-auto whitespace-nowrap"
    >
      {loading ? 
        <PropagateLoader 
          cssOverride={override}
          color="#FFFFFF"
          aria-label="Loading Spinner"
          data-testid="loader"
        /> : 
        action
      }
    </button>
  )
}

export default ButtonFull
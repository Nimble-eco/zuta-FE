import { FC } from "react"
import { BeatLoader } from "react-spinners";

interface IButtonFullProps {
  action: string;
  onClick: any;
  loading?: boolean;
}

const override = {
  display: "block",
  width: '50%',
  height: '1rem',
  margin: "auto",
  padding: '5px auto',
  borderColor: " #FFFFFF",
};

const ButtonFull: FC<IButtonFullProps> = ({action, onClick, loading}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-orange-500 hover:bg-orange-700 text-white font-bold flex justify-center items-center px-4 min-h-[2.5em] rounded-full min-w-[8rem] w-full mx-auto whitespace-nowrap"
    >
      {loading ? 
        <BeatLoader 
          cssOverride={override}
          color="#FFFFFF"
          aria-label="Loading Spinner"
          data-testid="loader"
          className="h-2"
        /> : 
        action
      }
    </button>
  )
}

export default ButtonFull
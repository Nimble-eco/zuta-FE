import { FC } from "react"
import { BeatLoader } from "react-spinners";

interface IButtonFullProps {
  action: string;
  onClick: any;
  loading?: boolean;
  disabled?: boolean;
}

const override = {
  display: "block",
  width: '50%',
  height: '1rem',
  margin: "auto",
  padding: '5px auto',
  borderColor: " #FFFFFF",
};

const ButtonFull: FC<IButtonFullProps> = ({action, onClick, loading, disabled}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${!disabled && !loading ? 'bg-orange-500 text-white' : 'bg-orange-900 cursor-not-allowed text-gray-500'} hover:bg-orange-700 font-bold flex justify-center items-center px-4 min-h-[2.5em] rounded-full min-w-[8rem] w-full mx-auto whitespace-nowrap`}
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
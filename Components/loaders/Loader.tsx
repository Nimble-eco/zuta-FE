import { ClipLoader } from "react-spinners";

const override = {
    display: "block",
    margin: "20% auto",
    borderColor: " #FFA500",
};

const LoadingState = () => {
  return (
    <div className="w-fit mx-auto">
        <ClipLoader
            cssOverride={override}
            color="#FFA500"
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    </div>
  )
}

export default LoadingState
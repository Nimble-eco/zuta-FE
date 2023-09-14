import { CircleLoader } from "react-spinners";

const override = {
    display: "block",
    margin: "20% auto",
    borderColor: "#ffffff",
};

const SimpleLoader = () => {
  return (
    <div className="flex flex-col !px-9 align-middle justify-center">
        <CircleLoader
            cssOverride={override}
            color="#1B6909"
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    </div>
  )
}

export default SimpleLoader
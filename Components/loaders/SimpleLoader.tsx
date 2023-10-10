import { FadeLoader } from "react-spinners";

const override = {
    display: "block",
    margin: "20% auto",
    borderColor: "#FFA500",
};

const SimpleLoader = () => {
  return (
    <div className="flex flex-col !px-9 align-middle justify-center">
        <FadeLoader
            cssOverride={override}
            color="#FFA500"
            aria-label="Loading Spinner"
            data-testid="loader"
        />
    </div>
  )
}

export default SimpleLoader
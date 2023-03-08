import ReactLoading from "react-loading";

const Loader = () => {
    return (
        <div
            className=" min-w-full flex justify-center bg-gray-200 bg-opacity-25 z-50 fixed top-0 bottom-0"
        >
            <ReactLoading
                type="spinningBubbles"
                color="#293F76"
                height={100}
                width={100}
                className="relative flex z-50 mt-[15%]"
            />
        </div>
    )
}

export default Loader

import ButtonFull from "../../buttons/ButtonFull";
import ButtonGhost from "../../buttons/ButtonGhost";

export const SingleProduct = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col w-[80%] absolute right-0 left-[23%] border border-gray-200 rounded-md">
            <div className='flex flex-col'>
                <div className="flex flex-row justify-between border-b border-gray-200 py-3 px-4">
                    <h2 className="text-lg font-semibold">Cat fish</h2>
                    <div className="flex flex-row ">
                        <div>
                            <ButtonGhost
                                action="Edit Product"
                                onClick={() => {}}
                            />
                        </div>
                        <div className="ml-3">
                            <ButtonFull
                                action="Publish"
                                onClick={() => {}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import ButtonFull from "../../buttons/ButtonFull";
import ButtonGhost from "../../buttons/ButtonGhost";
import TextCard from "../../texts/TextCard";

interface ISingleProductProps {
    product: {
        id: string,
        name: string,
        description: string,
        price: number,
        discount?: number,
        rating?: number,
        stock: number,
        potential_price?: number,
        potential_discount?: number,
        product_category: string[],
        product_tags: string[],
        flag: number,
        featured_status?: string,
        position: number,
        images: string[],
        status: string,
        created_at: string,
        featured?: any
    }
}

export const SingleProduct = ({product} : ISingleProductProps) => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col w-full md:w-[80%] absolute right-0 md:left-[21%] rounded-md px-4">
            <div className='flex flex-col bg-white'>
                <div className="flex flex-row justify-between border-b border-gray-200 py-2 px-4">
                    <h2 className="text-lg font-semibold align-center">{product.name}</h2>
                    <div className="flex flex-row ">
                        <div className="hidden md:flex">
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
                <div className='flex flex-col'>
                    <div className='flex flex-col lg:flex-row'>
                        <div className="flex flex-row w-full lg:w-[50%]">
                            <div className='w-[60%] mr-[3%] md:mr-none'>
                                <TextCard label='Product ID' value={product.id} />
                            </div>
                            <div className='w-[30%] md:w-auto md:mr-none'>
                                <TextCard label='Price' value={product.price} />
                            </div>
                        </div>
                        <div className="flex flex-row lg:w-[50%]">
                            <div className='w-[60%] mr-[3%] md:mr-none'>
                                <TextCard label='Stock' value={product.stock} />
                            </div>
                            <div className='w-[30%] md:w-auto md:mr-none'>
                                <TextCard label='Flag' value={product.flag} />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col lg:flex-row'>
                        <div className="flex flex-row lg:w-[50%]">
                            <div className='w-[60%] mr-[3%] md:mr-none'>
                                <TextCard label='Created On' value={product.created_at} />
                            </div>
                            <div className='w-[30%] md:mr-none'>
                                <TextCard label='Status' value={product.status} />
                            </div>
                        </div>
                        <div className="flex flex-row lg:w-[50%]">
                            <div className='w-[60%] mr-[3%] md:mr-none'>
                                { product.discount &&  <TextCard label='Discount' value={product.discount} /> }
                            </div>
                            <div className='w-[30%] md:mr-none'>
                                { product.potential_price &&  <TextCard label='Potential price' value={product.potential_price} /> }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col px-4 mt-8 bg-white py-6">
                <h3 className="font-semibold text-left border-b border-gray-200 mb-4">Product Description</h3>
                <div className="">
                    <p className="text-gray-700">{product.description}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row mt-8 justify-between">
                <div className="flex flex-col bg-white px-4 py-3 w-full md:w-[48%] mb-6 md:mb-0">
                    <h4 className="font-semibold border-b border-gray-200 pb-3 mb-4">Product Category</h4>
                    <div className="flex flex-col py-3">
                        <p className="text-sm text-gray-600">
                            Category
                        </p>
                        <p className="text-base text-black font-semibold">
                            {product.product_category}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col bg-white px-4 py-3 w-full md:w-[48%]">
                    <h4 className="font-semibold border-b border-gray-200 pb-3 mb-4">Product Tags</h4>
                    <div className="flex flex-col py-3">
                        <p className="text-sm text-gray-600">
                            Tags
                        </p>
                        <div className="flex flex-row">
                            {product.product_tags.map((tag) => (
                                <p className="text-base text-black font-semibold" key={tag}>{tag }, &nbsp;</p>
                            ))}
                        </div>
                       
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col bg-white py-4 mt-8">
                <div className="flex flex-row justify-between pb-3 mb-4 border-b border-gray-100 px-4 relative">
                    <h3 className="font-semibold">Feature Details</h3>
                    <div className="absolute right-2 bottom-1">
                        {product.featured_status && product.featured_status === 'active' ? (
                            <ButtonFull
                                action='Feature product'
                                onClick={() => {}}
                            />
                            ) : (
                            <ButtonGhost
                                action='Stop Feature'
                                onClick={() => {}}
                            />
                        )}
                    </div>
                </div>
                { product?.featured &&
                    <div className="flex flex-col md:flex-row">
                        <div className="flex flex-row md:w-[50%] lg:w-auto">
                            <div className="w-[60%] lg:w-auto">
                                <TextCard label="Cost" value={product.featured.cost} />
                            </div>
                            <div className="w-[40%] lg:w-auto">
                                <TextCard label="Status" value={product.featured.status} />
                            </div>
                        </div>

                        <div className="flex flex-row md:w-[50%] lg:w-auto">
                            <div className="w-[60%] lg:w-auto">
                                <TextCard label="Duration" value={product.featured.duration_in_hours} />
                            </div>
                            <div className="w-[40%] lg:w-auto"> 
                                <TextCard label="Time left" value={product.featured.time_left} />
                            </div>
                        </div>
                    </div>
                }
            </div>

            <div className="flex flex-col my-8 bg-white py-6">
                <h4 className="font-semibold text-left pb-3 mb-4 border-b border-gray-200 pl-3">Product Images</h4>
                <div className="grid grid-cols-3 gap-2 lg:flex lg:flex-row px-4">
                    {
                        product?.images?.map((image) => (
                            <div>
                                <img src={image} alt='Product' className="h-32 mr-6" />
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="flex md:hidden w-[60%] mx-auto mb-8">
                    <ButtonFull
                        action="Edit Product"
                        onClick={() => {}} 
                    />
            </div>
        </div>
    );
}


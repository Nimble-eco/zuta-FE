import { FC } from "react";
import { MdOutlineAdd, MdOutlineDeleteForever } from "react-icons/md";

interface INewProductCardProps {
    category: string;
    categoryCardIndex: number;
    newProducts: {
        name: string;
        price: string;
        description: string;
        tags: any[];
        image: string,
        isSoldOut: boolean
    }[];
    addNewProduct: (index: number) => void; 
    removeNewProduct: (index: number, i: number) => void;
    handleNewProductChange:(
        index: number, 
        i: number, 
        productName: string, 
        productPrice: string, 
        productDescription: string, 
        productTags: any, 
        productImage: any, 
        productQuantity: number,
        productDiscount: number,
        isSoldOut: boolean
    ) => void;
    toggleSoldOut: (index: number, i: number) => void;
}

const NewProductCard: FC<INewProductCardProps> = (props: any) => {

    return (
        <div>
            {props.newProducts.map((product: any, index: number) => (
                <div
                    key={index}
                    className="flex flex-col mt-5 bg-white pb-5 border-b-2 border-gray-300"
                >
                    {
                        product.isSoldOut ?
                        <button
                            className="text-base font-mono text-green-500 text-center py-1 mb-7 border border-green-500 rounded-md w-[25%] ml-[70%]" 
                            onClick={() => props.handleNewProductChange(props.categoryCardIndex, index, product.name, product.price, product.description, product.tags, product.image, product.quantity, product.discount, !product.isSoldOut)}
                        >
                            In Stock ?
                        </button>
                        : <button
                            className="text-base font-mono text-orange-500 text-center py-1 mb-7 border border-orange-500 rounded-md w-[25%] ml-[70%]"
                            onClick={() => props.handleNewProductChange(props.categoryCardIndex, index, product.name, product.price, product.description, product.tags, product.image, product.quantity, product.discount, !product.isSoldOut)}
                        >
                            Sold out ?
                        </button>
                    }
    
                    <div
                        className="flex flex-col justify-between md:flex-row lg:flex lg:flex-row"
                    >
                        <input
                            type="text"
                            placeholder="Product name"
                            value={product.name || ''}
                            className="text-gray-600 px-2 py-2 bg-gray-100 rounded-md w-[80%] mx-[5%] text-center mb-3"
                            name="product-name"
                            onChange={(e: any) => props.handleNewProductChange(props.categoryCardIndex, index, e.target.value, product.price, product.description, product.tags, product.image, product.quantity, product.discount, product.discount, product.isSoldOut)}
                        />
                        <input
                            type="text"
                            placeholder="Product price"
                            value={product.price || ''}
                            className="text-gray-600 px-2 text-center py-2 rounded-md w-[80%] mx-[5%] bg-gray-100 mb-3"
                            name="product-price"
                            onChange={(e: any) => props.handleNewProductChange(props.categoryCardIndex, index, product.name, e.target.value, product.description, product.tags, product.image, product.quantity, product.discount, product.isSoldOut)}
                        />
                        {
                            index ? (
                                <MdOutlineDeleteForever 
                                    className="text-4xl text-red-600 py-1 w-[10%] cursor-pointer" 
                                    onClick={() => props.removeNewProduct(props.categoryCardIndex, index)}
                                />
                            ) : null
                        }
                    </div>
                    <div
                        className="flex flex-col mt-5"
                    >
                        <textarea
                            placeholder="Description"
                            value={product.description || ''}
                            className="text-gray-600 px-7 py-4 bg-gray-100 w-[90%] mx-auto rounded-md h-24"
                            name="product-description"
                            onChange={(e: any) => props.handleNewProductChange(props.categoryCardIndex, index, product.name, product.price, e.target.value, product.tags, product.image, product.quantity, product.discount, product.isSoldOut)}
                        />
            
                        <div
                            className="flex flex-row mt-5 w-full px-5"
                        >
                            <div
                                className="flex flex-col justify-center w-[60%]"
                            >
                                <span
                                    className="flex justify-start ml-[10%] pl-5 text-gray-700"
                                >
                                    Tags:
                                </span>
    
                                <textarea 
                                    value={product.tags || ''}
                                    className="w-[80%] mx-auto outline-none h-16 text-gray-700 py-4 text-sm bg-gray-200 rounded-md px-4"                                    
                                    onChange={(e) => props.handleNewProductChange(props.categoryCardIndex, index, product.name, product.price, product.description, e.target.value, product.image, product.quantity, product.discount, product.isSoldOut)}
                                />
                            </div>
                            <div
                                className="flex flex-col justify-center w-[60%]"
                            >
                                <span
                                    className="flex justify-start ml-[10%] pl-5 text-gray-700"
                                >
                                    Quantity:
                                </span>
    
                                <input
                                    type="text" 
                                    value={product.quantity || ''}
                                    className="w-[80%] mx-auto outline-none h-16 text-gray-700 py-4 text-sm bg-gray-200 rounded-md px-4"                                    
                                    onChange={(e) => props.handleNewProductChange(props.categoryCardIndex, index, product.name, product.price, product.description, product.tags, product.image,e.target.value, product.discount, product.isSoldOut)}
                                />
                            </div>
                            <div
                                className="flex flex-col justify-center w-[40%]"
                            >
                                <span
                                    className="flex text-gray-700"
                                >
                                    Discount:
                                </span>
                                <div
                                    className="flex flex-row"
                                >
                                    <input
                                        type="number"
                                        value={product.discount || ''}
                                        className="w-[50%] outline-none h-16 text-gray-700 py-3 text-sm bg-gray-200 rounded-md px-4"
                                        onChange={(e) => props.handleNewProductChange(props.categoryCardIndex, index, product.name, product.price, product.description, product.tags, product.image, product.quantity, e.target.value, product.isSoldOut)}
                                    />
                                    <span
                                        className="text-gray-700 text-2xl mt-2"
                                    >
                                        %
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="flex flex-row mt-2 w-full px-5 justify-center items-center"
                        >
                            <label
                                className="flex justify-start text-gray-700"
                            >
                                Product image:
                            </label>
                            <input
                                type="file"
                                className="outline-none text-gray-700 py-4 text-sm justify-center px-4"
                                onChange={(e) => props.handleNewProductChange(props.categoryCardIndex, index, product.name, product.price, product.description, product.tags, URL.createObjectURL(e.target.files![0]), product.quantity, product.discount, product.isSoldOut)}
                            />
                            {
                                product.image ? (
                                    <img
                                        src={product.image}
                                        className="w-16 rounded-md justify-start items-start h-auto"
                                    />
                                ) : null
                            }
                        </div>
                    </div>
                </div>
            ))}
            <div
                className="w-full flex justify-center pt-5"
            >
                <button
                    className="text-2xl py-1 border border-orange-500 text-orange-500 rounded-md px-3 hover:bg-orange-500 hover:text-white"
                    onClick={() => props.addNewProduct(props.categoryCardIndex)}
                >
                    <div
                        className="flex flex-row"
                    >
                        <MdOutlineAdd className="text-xl"/>
                        <span
                            className="text-sm "
                        >
                            Add product
                        </span>
                    </div>
                </button>
            </div>
        </div>
    )
}

export default NewProductCard

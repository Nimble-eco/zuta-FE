import React from "react";

interface ICartComponentsProps {
    items: any;
    onQuantityChange: (index: number, newQuantity: number) => void;
    onRemove: (key: string, index: number) => void;
}

const CartComponent = ({ items, onQuantityChange, onRemove }: ICartComponentsProps) => {
  const handleQuantityChange = (index: number, newQuantity: number) => {
    onQuantityChange(index, newQuantity);
  };

  return (
    <div className="w-full bg-white">
        <h2 className="font-semibold text-lg text-orange-500 mb-4 border-b-2 border-gray-100 py-4 pl-3">Shopping Cart</h2>
        <p className="text-gray-700 text-lg pl-4">Products</p>
        {items.products?.map((item: any, index: number) => (
            <div key={item.id} className='flex flex-row relative mb-6 rounded-md px-4 py-3 border-b-2 border-gray-100'>
                <div className="mr-4 w-[20%]">
                    <img 
                        src={item.product_images[0]} 
                        alt={item.product_name} 
                        className='rounded-md'
                    />
                </div>
                <div className="flex flex-col w-[80%]">
                    <div className="flex flex-row gap-6 w-full mb-4">
                        <p className="text-base">{item.product_name}</p>
                        <p className="text-green-600">N {item.product_price}</p>
                    </div>
                    <div className="flex flex-col">
                        <input
                            type="number"
                            value={item.order_count || 1}
                            onChange={event => handleQuantityChange(index, Number(event.target.value))}
                            className='outline-none bg-gray-100 rounded-md w-fit mb-4 py-2 pl-3 text-sm md:mr-4'
                        />
                        <div className="flex flex-row gap-4">
                            <p className="text-green-600 font-medium md:mr-4">N{item.product_price * (item.order_count || 1)}</p>

                            <p
                                onClick={() => onRemove('products', index)}
                                className='text-red-600 text-xs font-semibold cursor-pointer px-2 py-2 bg-red-400 bg-opacity-20 rounded-[20px]'
                            >
                                X  Delete
                            </p>
                        </div>
                    </div>
                </div>
                
            </div>
        ))}

        <p className="text-gray-700 text-lg pl-4">Bundles</p>
        {items.bundles?.map((item: any, index: number) => (
            <div key={item.id} className='flex flex-row relative mb-6 rounded-md px-4 py-3 border-b-2 border-gray-100'>
                <div className="mr-4 w-[20%]">
                    <img 
                        src={item.product_images[0]} 
                        alt={item.product_name} 
                        className='rounded-md'
                    />
                </div>
                <div className="flex flex-col w-[80%]">
                    <div className="flex flex-row gap-6 w-full mb-4">
                        <p className="text-base">{item.product_name}</p>
                        <p className="text-green-600">N {item.product_price}</p>
                    </div>
                    <div className="flex flex-col">
                        <input
                            type="number"
                            value={item.order_count || 1}
                            onChange={event => handleQuantityChange(index, Number(event.target.value))}
                            className='outline-none bg-gray-100 rounded-md w-fit mb-4 py-2 pl-3 text-sm md:mr-4'
                        />
                        <div className="flex flex-row gap-4">
                            <p className="text-green-600 font-medium md:mr-4">N{item.product_price * (item.order_count || 1)}</p>

                            <p
                                onClick={() => onRemove('products', index)}
                                className='text-red-600 text-xs font-semibold cursor-pointer px-2 py-2 bg-red-400 bg-opacity-20 rounded-[20px]'
                            >
                                X  Delete
                            </p>
                        </div>
                    </div>
                </div>
                
            </div>
        ))}
    </div>
  );
};

export default CartComponent;

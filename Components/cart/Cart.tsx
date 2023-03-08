import React from "react";

interface ICartComponentsProps {
    items: any[];
    onQuantityChange: (index: number, newQuantity: number) => void;
    onRemove: (index: number) => void;
}

const CartComponent = ({ items, onQuantityChange, onRemove }: ICartComponentsProps) => {
  const handleQuantityChange = (index: number, newQuantity: number) => {
    onQuantityChange(index, newQuantity);
  };

  const handleRemove = (index: number) => {
    onRemove(index);
  };

  return (
    <div className="w-full bg-white">
        <h2 className="font-semibold text-lg text-orange-500 mb-4 border-b-2 border-gray-100 py-4 pl-3">Shopping Cart</h2>
        {items.map((item: any, index: number) => (
            <div key={item.id} className='flex flex-row relative mb-6 rounded-md px-4 py-3 border-b-2 border-gray-100'>
                <div className="mr-4 w-[20%]">
                    <img 
                        src={item.images[0]} 
                        alt={item.name} 
                        className='rounded-md'
                    />
                </div>
                <div className="flex flex-col w-[80%]">
                    <div className="flex flex-row justify-between w-full mb-4">
                        <p className="text-base">{item.name}</p>
                        <p>${item.price}</p>
                    </div>
                    <div className="flex flex-col md:flex-row">
                        <input
                            type="number"
                            value={item.quantity || 1}
                            onChange={event => handleQuantityChange(index, Number(event.target.value))}
                            className='outline-none bg-gray-100 rounded-md w-fit mb-4 py-2 pl-3 text-sm md:mr-4'
                        />
                    
                        <p className="text-orange-600 text-sm md:mr-4">N{item.price * (item.quantity || 1)}</p>

                        <button 
                            onClick={() => handleRemove(index)}
                            className='text-xs text-red-700 h-fit'
                        >
                            Delete
                        </button>
                    </div>
                </div>
                
            </div>
        ))}
    </div>
  );
};

export default CartComponent;

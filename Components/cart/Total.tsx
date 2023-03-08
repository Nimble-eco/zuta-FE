interface ICartTotalProps {
    items: any[];
}
const Total = ({ items }: ICartTotalProps) => {
  const total: number = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="justify-center text-center text-lg mb-8">
        <h3>Total: 
            <span className='text-orange-500'>N{total.toFixed(2)}</span>
        </h3>
    </div>
  );
};

export default Total;

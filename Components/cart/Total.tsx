interface ICartTotalProps {
    items: any;
}
const Total = ({ items }: ICartTotalProps) => {
  const products_total: number = items.products?.reduce((acc: number, item: any) => acc + item.product_price * item.order_count, 0);
  const bundles_total: number = items.bundles?.reduce((acc: number, item: any) => acc + item.product_price * item.order_count, 0);
  const total = products_total + bundles_total;

  return (
    <div className="justify-center text-center text-lg mb-8">
        <h3>Total: 
            <span className='text-orange-500'>N{total.toFixed(2)}</span>
        </h3>
    </div>
  );
};

export default Total;

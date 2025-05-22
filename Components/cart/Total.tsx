import { formatAmount } from "../../Utils/formatAmount";

interface ICartTotalProps {
    items: any;
}
const Total = ({ items }: ICartTotalProps) => {
  const products_total: number = items?.products?.reduce((acc: number, item: any) => acc + item.product_price * item.quantity, 0);
  const order_train: number = items?.subscriptions?.reduce((acc: number, item: any) => acc + item.open_order_price * item.quantity, 0);               
  const bundles_total: number = items?.bundles?.reduce((acc: number, item: any) => acc + item.product_price * item.order_count, 0);               
  const total = products_total + order_train + bundles_total;

  return (
    <div className="justify-center text-center text-lg">
      <h3 className="!text-lg">Total: {" "}
        <span className='text-orange-500'>{formatAmount(total)}</span>
      </h3>
    </div>
  );
};

export default Total;

import { FC, useState } from "react"
import { GrShareOption } from "react-icons/gr"
import H2 from "../Components/H2"
import Header from "../Components/Header"
import TransactionModal from "../Components/TransactionModal"
import { sendAxiosRequest } from "../Utils/sendAxiosRequest"

interface ITransactionsProps {
  userTransactions: any[];
}

const transactions: FC<ITransactionsProps> = ({userTransactions}) => {
  const [chosenTransaction, setchosenTransaction] = useState<any>({})
    const [modal, setmodal] = useState<boolean>(false);
    const showTransactionModal = (order: any) => {
        setmodal(true);
        setchosenTransaction(order);
    }
    const closeModal = () => setmodal(false);
  return (
    <div>
      <Header />
      <div
        className="flex flex-col"
      >
        <H2 heading="Transactions" />
        <div  
          className="flex flex-col justify-center"
          >
            {
              userTransactions.map((transaction: any) => (
                <div
                  onClick={() => showTransactionModal(transaction)}
                  className="flex flex-row justify-between py-2 px-7 pt-2 rounded-md shadow-md w-[80%] mx-auto border-b-2 border-gray-500 mb-5"
                >
                    <div
                      className="flex flex-col cursor-pointer"
                    >
                        <span
                          className="text-gray-700 text-lg hover:border-b-2 border-gray-600"
                        >
                          {transaction.product_name}
                        </span>
                        <span
                          className="text-gray-500 text-base"
                        >
                          {transaction.date_of_order}
                        </span>
                    </div>
                    <div
                      className="flex flex-row pt-2 text-center"
                    >
                      <span
                        className="text-gray-700 text-base"
                      >
                        {transaction.total_price}
                      </span>
                      <span 
                        className="mx-1"
                      >
                          &#124;
                      </span>
                      <span
                        className="text-gray-500 text-base"
                      >
                        {transaction.order_count}
                      </span>
                    </div>
                    <GrShareOption 
                      className="text-2xl text-gray-600 cursor-pointer text-center"
                    />
                </div>
              ))
            }
          </div>
      </div>
      {
        modal && <TransactionModal 
          closeModal={closeModal}
          transaction={chosenTransaction}
        />
      }
    </div>
  )
}

export default transactions


export async function getServerSideProps(context: any) {
    const token: string = context.query.token;
    const res = await sendAxiosRequest(
      '/api/customer/orders/all',
      'get',
      {},
      token,
      ''
    );
     
    return {
      props: {
        userTransactions: res.transactions
      }
    }
}
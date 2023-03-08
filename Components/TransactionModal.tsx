import { FC, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import {GoThumbsup, GoThumbsdown} from 'react-icons/go'
import H2 from './H2'
import ButtonGhost from './buttons/ButtonGhost'
import ButtonFull from './buttons/ButtonFull'
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { sendAxiosRequest } from '../Utils/sendAxiosRequest'
import Loader from './Loader'


interface ITransactionModalProps {
  transaction: any
  closeModal: any;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Order Graph',
    },
  },
};

const labels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];	

export const data = {
  labels,
  datasets: [
    {
      label: 'Orders',
      data: [23, 45, 12, 67, 34, 56, 78],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgb(53, 162, 235)',
    },
    {
      label: 'Discount',
      data: [12, 34, 56, 78, 23, 45, 67],
      borderColor: 'rgb(53, 235, 68)',
      backgroundColor: 'rgb(53, 235, 68)',
    },
  ],
};


const TransactionModal: FC<ITransactionModalProps> = ({transaction, closeModal}) => {
  let token: string;
  if(typeof window !== undefined){
    token = localStorage.getItem('token')!
  }
  
  let host: string = "";
  const env = process.env.ENV;
  if (env === 'production') {
    host = process.env.HOST!;
  } else {
    host = 'http://localhost'
  }

  const [loading, setloading] = useState<boolean>(false);
  
  const reviewProduct = async (e:any, productName: string, vendorUid: string, productId: string) => {
    e.preventDefault();
    setloading(true);
    await sendAxiosRequest(
      '/api/product/review',
      "post",
      {
        product_name: productName,
        product_uid: productId,
        vendor_uid: vendorUid,
        comment
      },
      token,
      ''
    );
    setloading(false);
  } 
  
  const rateProduct = async (e:any, productId: string, rating: string) => {
    e.preventDefault();
    sendAxiosRequest(
      '/api/product/rate',
      'put',
      {
        productId,
        rating
      },
      token,
      ''
    );

  }
  
  const [showCancelOrderMessageBox, setshowCancelOrderMessageBox] = useState<boolean>(false);
  const [comment, setcomment] = useState<string>('');
  const onOrderCommentChange = (e: any) => setcomment(e.target.value);
  const cancelOrder = async (e:any, orderId: string) => {
    e.preventDefault();
    setloading(true);
    sendAxiosRequest(
      `/api/orders/one/cancel`,
      'post',
      {
        orderId, 
        comment
      },
      token,
      ''
    ).then(()=> setloading(false));
  }

  const recieveOrder = async(e: any, orderId: string) => {
    e.preventDefault();
    setloading(true);
    sendAxiosRequest(
      `/api/orders/one/recieve/${orderId}`,
      'post',
      {},
      token,
      ''
    ).then(()=> setloading(false));
  }
  
  
  return (
    <div
        className="flex flex-col bg-gray-100 pb-10 rounded-md w-[80%] lg:w-[70%] z-50 absolute top-24 left-[15%] "
    >
      {
        loading && <Loader />
      }
      
      <MdOutlineClose 
          onClick={closeModal}
          className="text-red-600 text-2xl mb-8 hover:text-red-800 cursor-pointer mt-4 w-[10%] ml-[87%]"
      />

    	<H2 
        heading={transaction.product_name}
      />
      <div
        className='flex flex-col justify-center my-5'
      >
        <div
          className='flex flex-row w-[70%] mx-[15%] px-4 justify-between mb-5'
        >
          <div
            className='flex flex-col justify-between'
          >
            <div
              className='flex flex-row'
            >
              <span
                className='text-lg pr-4'
              >
                Quantity:
              </span>
              <span
                className='text-gray-500 text-lg'
              >
                {transaction.quantity}
              </span>
            </div>
            <div
              className='flex flex-row'
            >
              <span
                className='text-lg pr-4'
              >
                Price paid:
              </span>
              <span
                className='text-gray-500 text-lg'
              >
                {transaction.price_paid}
              </span>
            </div>
            <div
              className='flex flex-row'
            >
              <span
                className='text-lg pr-4'
              >
                Discount:
              </span>
              <span
                className='text-gray-500 text-lg'
              >
                {transaction.discount}
              </span>
            </div>
            <div
              className='flex flex-row'
            >
              <span
                className='text-lg pr-4'
              >
                Total:
              </span>
              <span
                className='text-gray-500 text-lg'
              >
                {transaction.total}
              </span>
            </div>
          </div>
          <div
            className='flex flex-col justify-between'
          >
            <div
              className='flex flex-row'
            >
              <span
                className='text-lg pr-4'
              >
                Potential price:
              </span>
              <span
                className='text-green-500 text-lg'
              >
                {transaction.potential_price}
              </span>
            </div>
            <div
              className='flex flex-row'
            >
              <span
                className='text-lg pr-4'
              >
                Potential discount:
              </span>
              <span
                className='text-green-500 text-lg'
              >
                {transaction.potential_discount}%
              </span>
            </div>
            <div
              className='flex flex-row'
            >
              <span
                className='text-lg pr-4'
              >
                Potential refund:
              </span>
              <span
                className='text-green-500 text-lg'
              >
                {transaction.potential_refund}
              </span>
            </div>
          </div>
        </div>
        <div
          className='flex flex-row my-5 justify-center items-center'
        >
          <FacebookShareButton
            url={`${host}:3333/open-orders/order/${transaction.open_order_uid}`}
            quote={`Buy ${transaction.product_name} at wholesale discout on webuy`}
            hashtag={"make_we_run_am"}
            className="mr-2"
          >
            <FacebookIcon size={32} round />
          </FacebookShareButton>

          <TwitterShareButton
            title={`Buy ${transaction.product_name} at wholesale discout on webuy`}
            url={`${host}:3333/open-orders/order/${transaction.open_order_uid}`}
            hashtags={["make_we_run_am", "webuy"]}
            className="mr-2"
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
          <WhatsappShareButton 
            title={`Buy ${transaction.product_name} at wholesale discout on webuy`}
            url={`${host}:3333/open-orders/order/${transaction.open_order_uid}`}
            className="rounded-full"
          >
            <WhatsappIcon size={32} />
          </WhatsappShareButton>
        </div>
        <div
          className='flex flex-row justify-center w-[60%] mx-auto px-4 mb-5'
        >
          <Line options={options} data={data} />
        </div>

      </div>

      {
        transaction.order_status === 'pending' &&( 
          <div
            className='flex flex-col justify-center mb-5'
          >
            <div
              className='flex flex-row justify-center w-[60%] mx-auto px-4'
            >
              <span
                className='text-lg pr-4 text-blue-700'
              >
                Order is pending
              </span>
            </div>
            {
              showCancelOrderMessageBox ? (
                <div
                  className='flex flex-col w-[60%] mx-auto my-4'
                >
                  <label
                    className='text-lg text-gray-600 mb-3 pl-3'
                  >
                    What went wrong ?
                    <span
                      className='text-gray-500 text-base font pl-3'
                    >
                      optional
                    </span>
                  </label>
                  <textarea
                    className='px-4 py-4 rounded-md'
                    placeholder='Your comment will help us improve'
                    name='cancel-order-message'
                    onChange={(e) => onOrderCommentChange(e)}
                  />
                  <div
                    className='flex flex-row justify-center'
                  >
                    <ButtonGhost
                      action='Close'
                      onClick={() => setshowCancelOrderMessageBox(false)}
                    />

                    <ButtonFull
                      action='Submit'
                      onClick={cancelOrder}
                    />
                  </div>
                </div>
              )
              :
              <ButtonGhost
                action='Cancel order'
                onClick={() => setshowCancelOrderMessageBox(true)}
              />
            }
            
          </div>
        )
      } 
      {
        transaction.order_status === 'en-route' && (
          <span
            className='text-lg pr-4 text-blue-700'
          >
            Order enroute
          </span>
        )
      }
      {
        transaction.order_status === 'delivered' && (
          <div
            className='flex flex-col justify-center mb-5'
          >
            <div
              className='flex flex-row justify-center w-[60%] mx-auto px-4'
            >
              <span
                className='text-lg pr-4 text-green-700'
              >
                Order has been delivered
              </span>
            </div>
            <ButtonGhost
              action='Recieve order'
              onClick={recieveOrder}
            />
          </div>
        )
      }

      {
        transaction.order_status === 'completed' &&
        <div
          className='flex flex-col justify-center mb-5' 
        >
          <div
            className='flex flex-row justify-center w-[80%] mx-auto px-4'
          >
            <div
              className='flex flex-col w-[80%] mr-[5%] justify-start'
            >
              <label
                className='text-base text-gray-700 pl-2 pb-3'
              >
                Leave a Review
              </label>
              <textarea
                className='px-4 py-2'
                placeholder='Your review will be appreciated'
                name='message'
                onChange={(e) => onOrderCommentChange(e)}
              />
            </div>
            
            <div
              className='flex flex-col justify-start mt-5'
            >
              <GoThumbsup 
                className='text-green-500 text-2xl mb-4' 
                onClick={(e) => rateProduct(e, '', "good")}
              />
              <GoThumbsdown 
                className='text-red-500 text-2xl'
                onClick={(e) => rateProduct(e,'', "bad")}
              />
            </div>
          </div>
          <ButtonFull
            action='Rate Product'
            onClick={(e: any) => reviewProduct(
              e, 
              transaction.product_name,
              transaction.vendor_uid,
              transaction.product_uid,
            )}
          />
        </div>
      }
    </div>
  )
}

export default TransactionModal
import ButtonFull from "../../../Components/buttons/ButtonFull";
import ButtonGhost from "../../../Components/buttons/ButtonGhost";
import { useRouter } from "next/router";
import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import TextCard from "../../../Components/texts/TextCard";
import MyTable from "../../../Components/tables/MyTable";
import { useState } from "react";
import { toast } from "react-toastify";
import { blockUserAction } from "../../../requests/user/user.request";
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav";
import AdminNavBar from "../../../Components/admin/layout/AdminNavBar";

interface IShowUserProps {
  user: any;
}

const show = ({user}: IShowUserProps) => {
  const router = useRouter();
  const [orderTab, setOrderTab] = useState('order');
  const [isBlockingUser, setIsBlockingUser] = useState(false);

  const blockUser = async() => {
    setIsBlockingUser(true)

    await blockUserAction(user.id)
    .then((response) => {
        if(response.status === 202) {
            toast.success('Product status updated');
        }
    })
    .catch(error => {
      console.log({error});
      toast.error(error?.response?.data?.message || 'Error try again later');
    })
    .finally(() => setIsBlockingUser(false));
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-scroll flex flex-row relative">
      <AdminSideNavPanel />
      <div className="min-h-screen bg-gray-100 flex flex-col gap-6 w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] rounded-md !px-2 lg:!px-0">
        <AdminNavBar />
        <div className='flex flex-col bg-white rounded-md mt-20 lg:mt-6'>
          <div className="flex flex-row justify-between items-center border-b border-gray-200 py-4 px-4">
              <h2 className="text-xl font-semibold align-center align-baseline my-auto capitalize">{user.name}</h2>
              <div className="flex flex-row ">
                <div className="ml-3">
                  <ButtonFull
                    action="Block User"
                    onClick={blockUser}
                    loading={isBlockingUser}
                  />
                </div>
              </div>
          </div>

          <div className='flex flex-col'>
            <div className='flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-2'>
              <TextCard label='Name' value={user.name} />
              <TextCard label='Email' value={user.email} />
              <TextCard label='Phone Number' value={user.phone} />
              <TextCard label='Gender' value={user.gender} />

              <TextCard label='Orders' value={user.orders?.length} />
              <TextCard label='Order Trains' value={user.openOrderSubscriptions?.length ?? 0} />
              <TextCard label='Blocked' value={user.blocked ? 'True' : 'False'} />
              <TextCard label='Flags' value={user.flags} />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-white rounded-md">
          <div className="flex flex-row gap-4 text-gray-600 mt-8 pl-4 items-center font-medium text-base">
            <h4 className={`${orderTab === 'order' && 'text-orange-700 text-lg font-semibold'} cursor-pointer`} onClick={()=>setOrderTab('order')}>Orders</h4>
            <h4 className={`${orderTab === 'train' && 'text-orange-700 text-lg font-semibold'} cursor-pointer`} onClick={()=>setOrderTab('train')}>Order Train</h4>
          </div>

          {
            orderTab === 'order' &&
            <div className="flex flex-col pb-8 bg-white overflow-y-auto">
              <MyTable
                headings={['sn', 'product_name', 'product_price_paid', 'quantity', 'product_categories', 'order_amount', 'order_sub_amount', 'order_delivery_fee', 'order_service_fee', 'order_payment_method', 'order_paid', 'order_payment_confirmed', 'created_at']}
                content={user?.orders?.map((order: any, index: number) => ({
                  ...order,
                  id: order.id,
                  sn: index + 1,
                  order_payment_confirmed: order.order_payment_confirmed ? 'True' : 'False',
                  created_at: new Date(order.created_at).toDateString(),
                  product_categories: order?.product?.product_categories
                }))} 
                onRowButtonClick={(order: any) => router.push(`orders/${order.id}`)}
              />
            </div>
          }

          {
            orderTab === 'train' &&
            <div className="flex flex-col pb-8 bg-white overflow-y-auto">
              <MyTable
                headings={['sn', 'product_name', 'open_order_price', 'open_order_discount', 'status', 'created_at']}
                content={user?.orderTrains?.map((order: any, index: number) => ({
                  ...order,
                  id: order.id,
                  sn: index + 1,
                  created_at: new Date(order.created_at).toDateString()
                }))} 
                onRowButtonClick={(order: any) => router.push(`orders/${order.id}`)}
              />
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default show

export async function getServerSideProps(context: any) {
    const { id } = context.query;
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
      const getUser = await axiosInstance.get('/api/user/show?id=' + id, {
        headers: {
          Authorization: token,
        //   team: user?.vendor
        }
      });

      const user = getUser.data?.data;
  
      return {
        props: {
          user
        }
      }
    } catch (error: any) {
      console.log({error})
        if(error?.response?.status === 401) {
          return {
            redirect: {
              destination: '/auth/signIn',
              permanent: false
            }
          }
        }
  
        return {
          props: {user: {}}
        }
    }
}
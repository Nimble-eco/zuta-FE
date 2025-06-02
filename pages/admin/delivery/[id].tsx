import { useRouter } from "next/router";
import AdminSideNavPanel from "../../../Components/admin/layout/AdminSideNav";
import ButtonFull from "../../../Components/buttons/ButtonFull";
import { useState } from "react";
import { toast } from "react-toastify";
import TextCard from "../../../Components/texts/TextCard";
import { toIntNumberFormat } from "../../../Utils/helper";
import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import { adminDeliveryCancelRequest, adminDeliveryCompleteRequest, adminDeliveryGetPaymentLinkRequest } from "../../../requests/delivery/delivery.requests";
import { Button } from "../../../Components/buttons/button";

interface IShowAdminDeliveryProps {
  delivery: any;
}

const AdminShowDelivery = ({ delivery }: IShowAdminDeliveryProps) => {
  const router = useRouter();
  const [status, setStatus] = useState(delivery?.status);
  const [loading, setLoading] = useState(false);

  const updateDeliveryStatus = async() => {
    if(!status) return toast.error('Select a status');

    setLoading(true);
    let res: any;

    switch (status) {
      case 'complete':
        res = await adminDeliveryCompleteRequest({
          order_id: delivery?.id,
          payment_id: delivery?.payment_id
        })
        .catch(error => {
          toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(()=>setLoading(false));
      break;

      case 'cancel':
        res = await adminDeliveryCancelRequest({order_id: delivery?.id})
        .catch(error => {
          toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(()=>setLoading(false));
      break;
    }

    if(res?.status === 200) {
      toast.success('Status updated');
      setTimeout(()=>window.location.reload(), 1300);
    }
  }

  const getPaymentLink = async () => {
    setLoading(true);

    await adminDeliveryGetPaymentLinkRequest({order_id: delivery?.id})
    .then((response)=>{
      if(response?.status === 200) {
        window.location.href = response?.data?.data?.authorization_url;
      }
    })
    .catch(error => {
      toast.error(error?.response?.data?.message || 'Error try again later');
    })
    .finally(()=>setLoading(false));
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-scroll flex flex-row relative mb-10">
      <AdminSideNavPanel />
      <div className="min-h-screen bg-gray-100 flex flex-col gap-6 w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] rounded-md px-4">
        <div className='flex flex-col bg-white mt-20 lg:mt-6 rounded-md'>
          <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center border-b border-gray-200 py-4 px-4">
            <h2 className="text-lg md:text-xl font-semibold align-center align-baseline my-auto capitalize">{delivery?.id}</h2>
            {
              delivery?.status === 'pending' && (
                <div className="flex flex-row gap-4 items-center">
                  <p className="text-orange-600 font-medium mb-0">Status:</p>
                  <select 
                    className="px-4 py-2 bg-gray-100 rounded-xl"
                    onChange={(e)=>setStatus(e.target?.value)}
                    value={status}
                  >
                    <option value={''}>Select Status</option>
                    <option value={'complete'}>Complete</option>
                    <option value={'cancel'}>Cancel</option>
                  </select>
                  <ButtonFull
                    action="Update"
                    loading={loading}
                    onClick={updateDeliveryStatus}
                  />
                </div>
              )
            }
          </div>

          <div className='flex flex-col gap-4 mt-4'>
            <div className="flex flex-col gap-1 border-b-4 border-gray-100">
              <p className="text-slate-600 font-semibold px-4 text-xl">Pickup Details</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <TextCard label="Customer Name" value={delivery?.sender_name} />
                <TextCard label="Customer Phone" value={delivery?.sender_phone} />
                <TextCard label="Customer Email" value={delivery?.sender_email} />

                <TextCard label="Pickup Address" value={delivery?.sender_address} />
                <TextCard label="Pickup City" value={delivery?.sender_city} />
                <TextCard label="Pickup State" value={delivery?.sender_state} />
                <TextCard label="Pickup country" value={delivery?.sender_country} />
                <TextCard label="Pickup Address Description" value={delivery?.sender_address_description} />
              </div>
            </div>

            <div className="flex flex-col gap-1 border-b-4 border-gray-100">
              <p className="text-slate-600 font-semibold px-4 text-xl">Destination Details</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <TextCard label="Customer Name" value={delivery?.recipient_name} />
                <TextCard label="Customer Phone" value={delivery?.recipient_phone} />
                <TextCard label="Customer Email" value={delivery?.recipient_email} />

                <TextCard label="Destination Address" value={delivery?.recipient_address} />
                <TextCard label="Destination City" value={delivery?.recipient_city} />
                <TextCard label="Destination State" value={delivery?.recipient_state} />
                <TextCard label="Destination country" value={delivery?.recipient_country} />
                <TextCard label="Destination Address Description" value={delivery?.recipient_address_description} />
              </div>
            </div>

            <div className="flex flex-col gap-1 border-b-4 border-gray-100 pb-5">
              <p className="text-slate-600 font-semibold px-4 text-xl">Order Details</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <TextCard label="Order Amount" value={toIntNumberFormat(delivery?.order_amount)} />
                <TextCard label="Order Sub Amount" value={toIntNumberFormat(delivery?.order_sub_amount)} />
                <TextCard label="Order Discount" value={toIntNumberFormat(delivery?.order_discount)} />
                <TextCard label="Order Service Fee" value={toIntNumberFormat(delivery?.order_service_fee)} />
                <TextCard label="Order Delivery Fee" value={toIntNumberFormat(delivery?.order_delivery_fee)} />
                <TextCard label="Order Insurance Fee" value={toIntNumberFormat(delivery?.order_insurance_fee)} />
                <TextCard label="Order Items" value={delivery?.order_items?.length} />
                <TextCard label="Order Paid" value={delivery?.order_paid ? 'Paid' : 'Not Paid'} />
                <TextCard label="Order Payment Confirmed" value={delivery?.order_payment_confirmed ? 'Confirmed' : 'Not Confirmed'} />
                <TextCard label="Order Status" value={delivery?.status} />
                {
                  delivery?.status === 'pending' && (
                    <div className="flex flex-col gap-1 px-5">
                      <p className="text-sm text-gray-600 whitespace-nowrap">Pay Now</p>
                      <Button
                        className="w-fit"
                        variant={"outline"}
                        isLoading={loading}
                        disabled={loading || !delivery?.id}
                        onClick={getPaymentLink}
                      >
                        <p className="font-medium animate-pulse">Get Payment Link</p>
                      </Button>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminShowDelivery

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  const cookies = parse(context.req.headers.cookie || ''); 
  const user = JSON.parse(cookies.user || 'null');
  const token = user?.access_token;

  try {
    const getDelivery = await axiosInstance.get('/api/delivery/show?id=' + id, {
      headers: {Authorization: token}
    });
    const delivery = getDelivery.data?.data;

    return {
      props: { delivery }
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
      props: {delivery: {}}
    }
  }
}
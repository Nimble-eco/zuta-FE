import { parse } from "cookie";
import VendorSideNavPanel from "../../../../Components/vendor/layout/VendorSideNavPanel";
import axiosInstance from "../../../../Utils/axiosConfig";
import SingleOpenOrderTransaction from "../../../../Components/vendor/transaction/orderTrain/SingleTransaction";

interface IShowTransactionPageProps {
    order: any;
}

const show = ({order}: IShowTransactionPageProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-auto">
        <div className="flex flex-row w-[95%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <SingleOpenOrderTransaction transaction={order} reviews={order.reviews}/>
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
        const getMyOrder = await axiosInstance.get('/api/open-order/show?id=' + id, {
            headers: {
              Authorization: token,
              team: user?.vendor
            }
        });

        const order = getMyOrder.data?.data

        return {
            props: {order}
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
            props: {order: {}}
        }
    }
}
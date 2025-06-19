import { parse } from "cookie";
import axiosInstance from "../../Utils/axiosConfig";
import StatsCard from "../../Components/cards/StatsCard";
import ColumnChart from "../../Components/charts/ColumnChart";
import { getMonthName } from "../../Utils/helper";
import VendorSideNavPanel from "../../Components/vendor/layout/VendorSideNavPanel";
import VendorNavBar from "../../Components/vendor/layout/VendorNavBar";

interface IVendorDashboardProps {
  orderStats: any;
  openOrderStats: any;
}

const VendorDashboardPage = ({ orderStats, openOrderStats }: IVendorDashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-scroll">
      <div className="flex flex-row w-full mx-auto relative mb-10">
        <VendorSideNavPanel />
        <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] !px-2 lg:!px-0">
          <VendorNavBar />
          <div className="flex flex-col gap-4">
            <h3 className="text-slate-700 font-semibold !text-xl">Orders Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <StatsCard
                title='All Orders'
                value={orderStats?.data?.total ?? 0}
              />
              <StatsCard
                title='Uncompleted Orders'
                value={(
                  orderStats?.data?.pending_orders + 
                  orderStats?.data?.unshipped_orders + 
                  orderStats?.data?.shipped_orders
                ) || 0}
              />
              <StatsCard
                title='Completed Orders'
                value={(
                  orderStats?.data?.delivered_orders +
                  orderStats?.data?.closed_orders
                ) || 0}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-slate-700 font-semibold !text-xl">Orders Train Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              <StatsCard
                title='All Order Train'
                value={openOrderStats?.data?.total ?? 0}
              />
              <StatsCard
                title='Subscribed'
                value={(openOrderStats?.data?.subscribers_count) || 0}
              />
              <StatsCard
                title='Unique Subscriber'
                value={(openOrderStats?.data?.unique_subscribers_count) || 0}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
            <h4 className="text-slate-700 font-semibold !text-xl">Orders and Order Train Chart</h4>
            <ColumnChart
              title="Order and order train chart"
              categoriesData={
                orderStats?.data?.monthly?.length > openOrderStats?.data?.monthly?.length ?
                orderStats?.data?.monthly?.map((obj: any)=>getMonthName(obj?.name))  :
                openOrderStats?.data?.monthly?.map((obj: any)=>getMonthName(obj?.name)) 
              }
              seriesData={[
                {
                  name: 'Order Count',
                  data: orderStats?.data?.monthly?.map((obj: any) => obj?.count)
                },
                {
                  name: 'Order train count',
                  data: openOrderStats?.data?.monthly?.map((obj: any) => obj?.count)
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboardPage

export async function getServerSideProps(context: any) {
  const cookies = parse(context.req.headers.cookie || ''); 
  const user = JSON.parse(cookies.user || 'null');
  const token = user?.access_token;
  
  if(!user?.vendor) {
    return {
      redirect: {
        destination: '/auth/signIn',
        permanent: false
      }
    }
  }

  try {
    const getVendorOrderStats = await axiosInstance.get('/api/stats/vendor/order', {
      headers: {
        Authorization: token,
        team: user?.vendor
      },
      params: { vendor_id: user?.vendor }
    });

    const getVendorOpenOrderStats = await axiosInstance.get('/api/stats/vendor/open/order', {
      headers: {
        Authorization: token,
        team: user?.vendor
      },
      params: { vendor_id: user?.vendor }
    });

    const [vendorOrderStatsResult, vendorOpenOrderStatsResult] = await Promise.allSettled([
      getVendorOrderStats,
      getVendorOpenOrderStats
    ]);

    const vendorOrderStats = vendorOrderStatsResult.status === 'fulfilled' ? vendorOrderStatsResult?.value?.data : [];
    const vendorOpenOrderStats = vendorOpenOrderStatsResult.status === 'fulfilled' ? vendorOpenOrderStatsResult?.value?.data : [];
    
    return {
      props: {
        orderStats: vendorOrderStats,
        openOrderStats: vendorOpenOrderStats,
      }
    }

  } catch(error: any) {
    console.log({error})
    if(error?.response?.status === 401 || error?.response?.status === 403) {
      return {
        redirect: {
          destination: '/auth/signIn',
          permanent: false
        }
      }
    }

    return {
      props: {
        orderStats: {},
        openOrderStats: {},
      }
    }
  }
}
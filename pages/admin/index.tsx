import { parse } from "cookie";
import AdminSideNavPanel from "../../Components/admin/layout/AdminSideNav"
import axiosInstance from "../../Utils/axiosConfig";
import StatsCard from "../../Components/cards/StatsCard";
import ColumnChart from "../../Components/charts/ColumnChart";
import { getMonthName } from "../../Utils/helper";
import AdminNavBar from "../../Components/admin/layout/AdminNavBar";

interface IAdminDashboardProps {
  userStats: any;
  vendorStats: any;
  productStats: any;
  orderStats: any;
  openOrderStats: any;
}

const AdminDashboardPage = ({ userStats, vendorStats, productStats, orderStats, openOrderStats }: IAdminDashboardProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-scroll">
      <div className="flex flex-row w-full mx-auto relative mb-10">
        <AdminSideNavPanel />
        <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] !px-2 lg:!px-0">
          <AdminNavBar />
          <div className="flex flex-col gap-4">
            <h3 className="text-slate-700 font-semibold text-2xl">Orders Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 mt-20 lg:mt-0">
              <StatsCard
                title='All Orders'
                value={orderStats.data?.total ?? 0}
              />
              <StatsCard
                title='Uncompleted Orders'
                value={(
                  orderStats.data?.pending_orders + 
                  orderStats.data?.unshipped_orders + 
                  orderStats.data?.shipped_orders
                ) || 0}
              />
              <StatsCard
                title='Completed Orders'
                value={(
                  orderStats.data?.delivered_orders +
                  orderStats.data?.closed_orders
                ) || 0}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-slate-700 font-semibold text-2xl">Orders Train Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 mt-20 lg:mt-0">
              <StatsCard
                title='All Order Train'
                value={openOrderStats.data?.total ?? 0}
              />
              <StatsCard
                title='Subscribed'
                value={(openOrderStats.data?.subscribers_count) || 0}
              />
              <StatsCard
                title='Unique Subscriber'
                value={(openOrderStats.data?.unique_subscribers_count) || 0}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
            <h4 className="text-slate-700 font-semibold text-2xl">Orders Chart</h4>
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

          <div className="flex flex-col gap-4">
            <h3 className="text-slate-700 font-semibold text-2xl">Users Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 mt-20 lg:mt-0">
              <StatsCard
                title='All Users'
                value={userStats.data?.total ?? 0}
              />
              <StatsCard
                title='Unverified Users'
                value={(userStats.data?.total - userStats.data?.verified) || 0}
              />
              <StatsCard
                title='Has Order (%)'
                value={Number(userStats.data?.has_order_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Has Order Train (%)'
                value={Number(userStats.data?.has_open_order_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Has Store (%)'
                value={Number(userStats.data?.has_store_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Blocked Users'
                value={Number(userStats.data?.blocked).toFixed(2) ?? 0}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-slate-700 font-semibold text-2xl">Vendor Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 mt-20 lg:mt-0">
              <StatsCard
                title='All Vendors'
                value={vendorStats.data?.total ?? 0}
              />
              <StatsCard
                title='Approved Vendors (%)'
                value={Number(vendorStats.data?.approved_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Has Product (%)'
                value={Number(vendorStats.data?.has_product_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Has Order (%)'
                value={Number(vendorStats.data?.has_order_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Has Order Train (%)'
                value={Number(vendorStats.data?.has_open_order_percent).toFixed(2) ?? 0}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-slate-700 font-semibold text-2xl">Product Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 mt-20 lg:mt-0">
              <StatsCard
                title='All Products'
                value={productStats.data?.total ?? 0}
              />
              <StatsCard
                title='Approved Products (%)'
                value={Number(productStats.data?.store_approved_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Mgt. Approved Products (%)'
                value={Number(productStats.data?.management_approved_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Has Order (%)'
                value={Number(productStats.data?.has_order_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Has Open Order (%)'
                value={Number(productStats.data?.has_open_order_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Has Review (%)'
                value={Number(productStats.data?.has_review_percent).toFixed(2) ?? 0}
              />
              <StatsCard
                title='Featured Products (%)'
                value={Number(productStats.data?.has_featured_percent).toFixed(2) ?? 0}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
            <h4 className="text-slate-700 font-semibold text-2xl">Newly Added Users and Stores</h4>
            <ColumnChart
              title="Newly Added Statistics"
              categoriesData={
                userStats?.data?.monthly?.length > vendorStats?.data?.monthly?.length ?
                userStats?.data?.monthly?.map((obj: any)=>getMonthName(obj?.name))  :
                vendorStats?.data?.monthly?.map((obj: any)=>getMonthName(obj?.name)) 
              }
              seriesData={[
                {
                  name: 'User Count',
                  data: userStats?.data?.monthly?.map((obj: any) => obj?.count)
                },
                {
                  name: 'Vendor count',
                  data: vendorStats?.data?.monthly?.map((obj: any) => obj?.count)
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage

export async function getServerSideProps(context: any) {
  const cookies = parse(context.req.headers.cookie || ''); 
  const user = JSON.parse(cookies.user || 'null');
  const token = user?.access_token;

  try {
    const getUserStats = await axiosInstance.get('/api/stats/users', {
      headers: {
        Authorization: token
      }
    });

    const getVendorStats = await axiosInstance.get('/api/stats/vendors', {
      headers: {
        Authorization: token
      }
    });

    const getProductStats = await axiosInstance.get('/api/stats/products', {
      headers: {
        Authorization: token
      }
    });

    const getOrderStats = await axiosInstance.get('/api/stats/general/vendor/order', {
      headers: {
        Authorization: token
      }
    });

    const getOpenOrderStats = await axiosInstance.get('/api/stats/general/open/order', {
      headers: {
        Authorization: token
      }
    });

    const [userStatsResult, vendorStatsResult, productStatsResult, orderStatsResult, openOrderStatsResult] = await Promise.allSettled([
      getUserStats,
      getVendorStats,
      getProductStats,
      getOrderStats,
      getOpenOrderStats
    ]);

    const userStats = userStatsResult.status === 'fulfilled' ? userStatsResult?.value?.data : [];
    const vendorStats = vendorStatsResult.status === 'fulfilled' ? vendorStatsResult?.value?.data : [];
    const productStats = productStatsResult.status === 'fulfilled' ? productStatsResult?.value?.data : [];
    const orderStats = orderStatsResult.status === 'fulfilled' ? orderStatsResult?.value?.data : [];
    const openOrderStats = openOrderStatsResult.status === 'fulfilled' ? openOrderStatsResult?.value?.data : [];
    
    return {
      props: {
        userStats,
        vendorStats,
        productStats,
        orderStats,
        openOrderStats
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
        userStats: {},
        vendorStats: {},
        productStats: {},
        orderStats: {},
        openOrderStats: {},
      }
    }
  }
}
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  BarChart3 
} from "lucide-react";
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
  const pendingCount = (orderStats?.data?.pending_orders + orderStats?.data?.unshipped_orders + orderStats?.data?.shipped_orders) || 0;
  const completedCount = (orderStats?.data?.delivered_orders + orderStats?.data?.closed_orders) || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-row">
      <VendorSideNavPanel />
      
      {/* Main Content Area: Margin left matches Sidebar width (64) */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <VendorNavBar />

        <div className="p-6 lg:p-10 space-y-8">
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Vendor Overview</h1>
              <p className="text-slate-500">Welcome back! Here's what's happening with your store today.</p>
            </div>
          </header>

          {/* Primary Orders Stats */}
          <section>
            <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={20} className="text-orange-600" />
                <h2 className="text-lg font-semibold text-slate-700">Orders Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard
                title='Total Orders'
                value={orderStats?.data?.total ?? 0}
                icon={Package}
                color="blue"
              />
              <StatsCard
                title='Pending Fulfillment'
                value={pendingCount}
                icon={Clock}
                color="orange"
              />
              <StatsCard
                title='Completed'
                value={completedCount}
                icon={CheckCircle2}
                color="green"
              />
            </div>
          </section>

          {/* Order Train & Chart Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Chart - Spans 2 columns on large screens */}
            <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-700">Performance Trends</h2>
                </div>
                <div className="h-[350px]">
                    <ColumnChart
                        title=""
                        categoriesData={
                            orderStats?.data?.monthly?.length > openOrderStats?.data?.monthly?.length ?
                            orderStats?.data?.monthly?.map((obj: any)=>getMonthName(obj?.name))  :
                            openOrderStats?.data?.monthly?.map((obj: any)=>getMonthName(obj?.name)) 
                        }
                        seriesData={[
                            {
                                name: 'Direct Orders',
                                data: orderStats?.data?.monthly?.map((obj: any) => obj?.count)
                            },
                            {
                                name: 'Order Train',
                                data: openOrderStats?.data?.monthly?.map((obj: any) => obj?.count)
                            },
                        ]}
                    />
                </div>
            </div>

            {/* Order Train Stats Stack */}
            <div className="flex flex-col gap-6">
                <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <TrendingUp size={20} className="text-orange-600" />
                    Order Train Activity
                </h2>
                <StatsCard
                    title='Active Trains'
                    value={openOrderStats?.data?.total ?? 0}
                    icon={Package}
                    color="slate"
                />
                <StatsCard
                    title='Total Subscribed'
                    value={openOrderStats?.data?.subscribers_count || 0}
                    icon={Users}
                    color="orange"
                    trend="+5% vs last month"
                />
                <StatsCard
                    title='Unique Reach'
                    value={openOrderStats?.data?.unique_subscribers_count || 0}
                    icon={CheckCircle2}
                    color="blue"
                />
            </div>
          </div>
        </div>
      </main>
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
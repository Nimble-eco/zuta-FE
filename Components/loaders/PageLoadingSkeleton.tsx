import Head from "next/head"
import { useRouter } from "next/router";
import Header from "../Header";
import { Loader2 } from "lucide-react";
import VendorSideNavPanel from "../vendor/layout/VendorSideNavPanel";
import AdminSideNavPanel from "../admin/layout/AdminSideNav";
import VendorNavBar from "../vendor/layout/VendorNavBar";

const PageLoadingSkeleton = () => {
    const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 w-full min-w-full">
        <Head>
            <title>Zuta - Buy together, Save More </title>
           <link rel="icon" href="/images/logo.png" />
        </Head>

        {   
            router.pathname.includes('/vendor') ? (
                <div className="flex flex-row w-full mx-auto mb-10 bg-slate-50">
                    <VendorSideNavPanel />
                    <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                        <VendorNavBar />

                        <div className="flex mt-10 justify-center items-center">
                            <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
                        </div>
                    </main>
                </div>
            ) :
            router.pathname.includes('/admin') ? (
                <div className="flex flex-row w-full mx-auto mt-8 relative mb-10">
                    <AdminSideNavPanel />
                    <div className="flex flex-col w-[80%] absolute right-0 left-[20%]">
                        <div className="flex mt-10 justify-center items-center">
                            <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
                        </div>
                    </div>
                </div>
            ) :
            (
                <div className="flex flex-col gap-4">
                    <Header search={false} />
                    <div className="flex mt-10 justify-center items-center">
                        <Loader2 className="h-12 w-12 text-orange-600 animate-spin" />
                    </div>
                </div> 
            ) 
        }
    </div>
  )
}

export default PageLoadingSkeleton
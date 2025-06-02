import AdminSideNavPanel from "../../Components/admin/layout/AdminSideNav"

const AdminDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-scroll">
        <div className="flex flex-row w-full mx-auto mt-8 relative mb-10">
            <AdminSideNavPanel />
            <div className="flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%]">

            </div>
        </div>
    </div>
  )
}

export default AdminDashboardPage
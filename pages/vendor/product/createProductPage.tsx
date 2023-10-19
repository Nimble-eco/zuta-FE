import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import CreateProduct from "../../../Components/vendor/product/CreateProduct"
import axiosInstance from "../../../Utils/axiosConfig"

const createProductPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex flex-row w-[90%] mx-auto mt-8 relative mb-10">
        <VendorSideNavPanel />
        <CreateProduct />
      </div>
    </div>
  )
}

export default createProductPage
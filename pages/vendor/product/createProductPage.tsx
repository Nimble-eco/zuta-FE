import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import CreateProduct from "../../../Components/vendor/product/CreateProduct"

const createProductPage = () => {
  return (
    <div className="min-h-screen">
      <div className="flex flex-row bg-gray-100 w-full mx-auto relative">
        <VendorSideNavPanel />
        <CreateProduct />
      </div>
    </div>
  )
}

export default createProductPage
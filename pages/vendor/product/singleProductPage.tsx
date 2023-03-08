
import VendorSideNavPanel from '../../../Components/vendor/layout/VendorSideNavPanel'
import { SingleProduct } from '../../../Components/vendor/product/SingleProduct'

const singleProductPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
        <div className="flex flex-row w-[90%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <SingleProduct />
        </div>
    </div>
  )
}

export default singleProductPage

import VendorSideNavPanel from '../../../Components/vendor/layout/VendorSideNavPanel'
import { SingleProduct } from '../../../Components/vendor/product/SingleProduct'
import { productDummyData } from '../../../data/product'

interface ISingleProductPageProps {
  product: any;
}

const singleProductPage = ({product}: ISingleProductPageProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-auto">
        <div className="flex flex-row w-[95%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <SingleProduct product={product}/>
        </div>
    </div>
  )
}

export default singleProductPage

export async function getServerSideProps(context: any) {
  try {
    const product = productDummyData;

    return {
      props: {
        product
      }
    }
  } catch (error) {
    
  }
}
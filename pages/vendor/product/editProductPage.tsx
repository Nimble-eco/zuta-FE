import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import EditProduct from "../../../Components/vendor/product/EditProduct"
import { categoriesDummyData } from "../../../data/categories";
import { productDummyData } from "../../../data/product"


interface IEditProductPageProps {
    product: any;
    categories: any[];
}

const editProductPage = ({product, categories}: IEditProductPageProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
        <div className="flex flex-row w-[95%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <EditProduct product={product} categories={categories}/>
        </div>
    </div>
  )
}

export default editProductPage


export async function getServerSideProps(context: any) {
    try {
        const product = productDummyData;
        const categories = categoriesDummyData;
        
        return {
            props: {
                product, 
                categories
            }
        }
    } catch (error) {
      
    }
  }
import { parse } from "cookie";
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import EditProduct from "../../../Components/vendor/product/EditProduct"
import { categoriesDummyData } from "../../../data/categories";
import axiosInstance from "../../../Utils/axiosConfig";

interface IEditProductPageProps {
    product: any;
    categories: any[];
}

const editProductPage = ({product, categories}: IEditProductPageProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
        <div className="flex flex-row w-[95%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <EditProduct product={product} />
        </div>
    </div>
  )
}

export default editProductPage


export async function getServerSideProps(context: any) {
    const { id } = context.query;
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getMyProduct = await axiosInstance.get('/api/product/show?id=' + id, {
            headers: {
              Authorization: token,
              team: user?.vendor
            }
        });
        const product = getMyProduct.data?.data;

      const categories = categoriesDummyData;
        
        return {
            props: {
                product, 
                categories
            }
        }
    } catch (error: any) {
        console.log({error})
        if(error?.response?.status === 401) {
          return {
            redirect: {
              destination: '/auth/signIn',
              permanent: false
            }
          }
        }
  
        return {
          props: {product: {}}
        }
    }
  }
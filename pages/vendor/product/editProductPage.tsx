import { parse } from "cookie";
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import EditProduct from "../../../Components/vendor/product/EditProduct"
import axiosInstance from "../../../Utils/axiosConfig";

interface IEditProductPageProps {
  product: any;
}

const editProductPage = ({product}: IEditProductPageProps) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex flex-row w-[95%] mx-auto lg:mt-8 relative">
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

  if(!token) {
    return {
      redirect: {
        destination: '/auth/signIn',
        permanent: false
      }
    }
  }

  try {
    const getMyProduct = await axiosInstance.get('/api/product/show?id=' + id, {
      headers: {
        Authorization: token,
        team: user?.vendor
      }
    });
    const product = getMyProduct.data?.data;
    
    return {
      props: {
        product
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
import { parse } from 'cookie';
import VendorSideNavPanel from '../../../Components/vendor/layout/VendorSideNavPanel'
import { SingleProduct } from '../../../Components/vendor/product/SingleProduct'
import axiosInstance from '../../../Utils/axiosConfig';

interface ISingleProductPageProps {
  product: any;
}

const singleProductPage = ({product}: ISingleProductPageProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-auto">
      <div className="flex flex-row w-full mt-8 relative mb-10">
        <VendorSideNavPanel />
        <SingleProduct product={product}/>
      </div>
    </div>
  )
}

export default singleProductPage

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
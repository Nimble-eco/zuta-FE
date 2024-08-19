import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from 'react-toastify'
import ButtonFull from "../../../Components/buttons/ButtonFull";
import FilterAndSearchGroup from "../../../Components/inputs/FilterAndSearchGroup";
import MyTable from "../../../Components/tables/MyTable";
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import FilterContainer from "../../../Components/modals/containers/FilterContainer";
import MyDropDownInput from "../../../Components/inputs/MyDropDownInput";
import { parse } from "cookie";
import axiosInstance from "../../../Utils/axiosConfig";
import { formatAmount } from "../../../Utils/formatAmount";
import { sendAxiosRequest } from "../../../Utils/sendAxiosRequest";
import { filterProductsByVendorAction, searchProductsByVendorAction } from "../../../requests/products/products.request";
import Cookies from "js-cookie";

interface IProductsIndexPageProps {
    products: any;
    categories: any[];
    tags: any[];
}

const index = ({products, categories, tags}: IProductsIndexPageProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [filterByDetails, setFilterByDetails] = useState({
        product_categories: '',
        product_tags: '',
        vendor_approved: '',
        management_approved: '',
    });
    const [productsData, setProductsData] = useState(products); 
    let vendorId: string = '';

    if(typeof window !== 'undefined') {
        vendorId = JSON.parse(Cookies.get('user')!).vendor;
    }


    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const filterProductsPage = async () => {
        setLoading(true);

        await filterProductsByVendorAction({
            product_categories: filterByDetails.product_categories ? [filterByDetails.product_categories] : undefined,
            product_tags: filterByDetails.product_tags ? [filterByDetails.product_tags] : undefined,
            vendor_approved: filterByDetails.vendor_approved ? Number(filterByDetails.vendor_approved) : undefined,
            management_approved: filterByDetails.management_approved ? Number(filterByDetails.management_approved) : undefined,
            vendor_id: vendorId
        })
        .then((response: any) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setProductsData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setProductsData({});
            }
        })
        .catch((error: any) => {
            console.log({error});
            toast.error(error.response?.data?.message || 'Error try again later');
        })
        .finally(() => {
            setLoading(false);
            setShowFilterInput(false);
        })
    }

    // PRODUCT FUNCTIONS
    const searchProducts = async (value: string) => {
        setLoading(true);

        await searchProductsByVendorAction(value, vendorId)
        .then((response) => {
            if(response.status === 200) {
                toast.success('Action successful');
                setProductsData(response.data?.data);
            }
            else if(response.status === 204) {
                toast.success('No content');
                setProductsData({});
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error.response?.data?.message || 'Error try again later');
        })
        .finally(() => {
            setLoading(false);
            setShowFilterInput(false);
        })
    }

    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);

    const paginateData = async (paginator: any, direction: 'prev' | 'next') => {
        if(direction === 'prev' && paginator?.previous_page_url) {
            setLoading(true);
            await filterProductsByVendorAction({vendor_id: vendorId, pagination: paginator?.current_page - 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setProductsData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setProductsData({});
                }
            })
            .catch((error: any) => {
                console.log({error});
                toast.error(error.response?.data?.message || 'Error try again later');
            })
            .finally(() => {
                setLoading(false);
                setShowFilterInput(false);
            });
        }

        if(direction === 'next' && paginator?.next_page_url) {
            setLoading(true);
            await filterProductsByVendorAction({vendor_id: vendorId, pagination: paginator?.current_page + 1})
            .then((response: any) => {
                if(response.status === 200) {
                    toast.success('Action successful');
                    setProductsData(response.data?.data);
                }
                else if(response.status === 204) {
                    toast.success('No content');
                    setProductsData({});
                }
            })
            .catch((error: any) => {
                console.log({error});
                toast.error(error.response?.data?.message || 'Error try again later');
            })
            .finally(() => {
                setLoading(false);
                setShowFilterInput(false);
            });
        }
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col"> 
        {
            showFilterInput && <FilterContainer 
                show={showFilterInput}
                setShow={() => setShowFilterInput(!showFilterInput)}
                onFilter={filterProductsPage}
                isLoading={loading}
                children={[
                    <>  
                        <MyDropDownInput 
                            label="Category"
                            onSelect={handleFilterByDetailsChange}
                            name="product_categories"
                            options={categories ?? []}
                            value={filterByDetails.product_categories}
                        />

                        <MyDropDownInput 
                            label="Tags"
                            onSelect={handleFilterByDetailsChange}
                            name="product_tags"
                            options={tags ?? []}
                            value={filterByDetails.product_tags}
                        />

                        <MyDropDownInput 
                            label="Vendor Approved"
                            onSelect={handleFilterByDetailsChange}
                            name="vendor_approved"
                            options={[
                                {title: 'Approved', value: 1},
                                {title: 'Unapproved', value: 0},
                            ]}
                            value={filterByDetails.vendor_approved}
                        />

                        <MyDropDownInput 
                            label="Management Approved"
                            onSelect={handleFilterByDetailsChange}
                            name="management_approved"
                            options={[
                                {title: 'Approved', value: 1},
                                {title: 'Unapproved', value: 0},
                            ]}
                            value={filterByDetails.management_approved}
                        />
                    </>
                ]}
            />
        }
        <div className="flex flex-row w-full mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[20%]">
                <div className="flex flex-row justify-between items-center bg-white py-2 px-4 mb-1">
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Products</h2>
                    <div className="w-fit h-12">
                        <ButtonFull 
                            action="Create Product"
                            onClick={() => router.push('product/createProductPage')}
                        />
                    </div>
                </div>
                
                <div className="flex flex-row text-sm font-semibold !text-gray-400 px-4 py-5 bg-white">
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Active
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Pending
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Inactive
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Featured
                    </a>
                </div>

                <div className="flex flex-row py-3 px-4 relative bg-white justify-between">
                    <FilterAndSearchGroup 
                        searchInputPlaceHolder="Search name, price, category"
                        onSearch={searchProducts}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        isSearching={loading}
                    />
                </div>
                {/* PRODUCTS TABLE */}
                <div className="flex flex-col pb-8 bg-white overflow-y-auto">
                    <MyTable
                        headings={['product_image', 'product_name', 'product_price', 'vendor_approved', 'quantity', 'management_approved']}
                        content={productsData?.data?.map((product: any) => ({
                            ...product,
                            product_image: product.product_images[0],
                            product_price: formatAmount(product.product_price),
                            vendor_approved: product?.vendor_approved ? 'Approved' : 'Unapproved',
                            management_approved: product?.management_approved ? 'Approved' : 'Unapproved',
                        }))} 
                        onRowButtonClick={(product: any) => router.push(`product/singleProductPage?id=${product.id}`)}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button onClick={() => paginateData(productsData?.meta, 'prev')} className='mr-3 cursor-pointer'>Previous</button>
                        <p className="text-base px-2 my-auto">{productsData?.meta?.current_page}</p>
                        <button onClick={() => paginateData(productsData?.meta, 'next')} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default index

export async function getServerSideProps(context: any) {
    const cookies = parse(context.req.headers.cookie || ''); 
    const user = JSON.parse(cookies.user || 'null');
    const token = user?.access_token;

    try {
        const getMyProducts = await axiosInstance.get('/api/product/me', {
            headers: {
                Authorization: token,
                team: user?.vendor
            }
        });

        const getCategories = await sendAxiosRequest(
            '/api/product/category/index',
            'get',
            {},
            '',
            ''
        );

        const getTags = await sendAxiosRequest(
            '/api/product/tag/index',
            'get',
            {},
            '',
            ''
        );
    
        const [myProductsResult, categoriesResult, tagsResult] = await Promise.allSettled([
            getMyProducts,
            getCategories,
            getTags
        ]);
         
        const myProducts = myProductsResult.status === 'fulfilled' ? myProductsResult?.value?.data : [];
        const categories = categoriesResult.status === 'fulfilled' ? categoriesResult?.value?.data : [];
        const tags = tagsResult.status === 'fulfilled' ? tagsResult?.value?.data : [];      
    
        return {
            props: {
                products: myProducts?.data ?? [],
                categories: categories?.data ?? [],
                tags: tags?.data ?? [],
            }
        }
    } catch(error: any) {
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
            props: {
                products: [],
                categories: [],
                tags: []
            }
        }
    }
}
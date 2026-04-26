import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from 'react-toastify'
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
import { processImgUrl } from "../../../Utils/helper";
import VendorNavBar from "../../../Components/vendor/layout/VendorNavBar";
import { Plus, Package, CheckCircle, Clock } from "lucide-react";

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
        vendorId = Cookies.get('user') ? JSON.parse(Cookies.get('user')!).vendor : null;
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
        <div className="min-h-screen bg-slate-50 flex flex-row">
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

            <VendorSideNavPanel />

            <main className="flex-1 lg:ml-64 flex flex-col min-h-screen overflow-x-hidden">
                <VendorNavBar />

                <div className="p-4 lg:p-8 space-y-6">
                    {/* Header Section */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Product Catalog</h1>
                            <p className="text-slate-500 text-sm">Manage your inventory and track approval status.</p>
                        </div>
                        <button 
                            onClick={() => router.push('product/createProductPage')}
                            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-orange-200"
                        >
                            <Plus size={20} />
                            <span>Add New Product</span>
                        </button>
                    </header>

                    {/* Quick Stats (Gives the vendor immediate value) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Package size={24}/></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Products</p>
                                <p className="text-xl font-bold text-slate-800">{productsData?.meta?.total || 0}</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="bg-green-50 p-3 rounded-xl text-green-600"><CheckCircle size={24}/></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Approved</p>
                                <p className="text-xl font-bold text-slate-800">
                                    {productsData?.data?.filter((p:any) => p.management_approved).length || 0}
                                </p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="bg-amber-50 p-3 rounded-xl text-amber-600"><Clock size={24}/></div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Pending</p>
                                <p className="text-xl font-bold text-slate-800">
                                    {productsData?.data?.filter((p:any) => !p.management_approved).length || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <FilterAndSearchGroup 
                            searchInputPlaceHolder="Search name, price, category..."
                            onSearch={searchProducts}
                            onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                            isSearching={loading}
                        />
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <MyTable
                            isLoading={loading}
                            headings={['product_image', 'product_name', 'product_price', 'stock', 'vendor_approved', 'management_approved']}
                            content={productsData?.data?.map((product: any) => ({
                                ...product,
                                product_image: processImgUrl(product.product_images[0]),
                                product_price: formatAmount(product.product_price),
                                vendor_approved: product?.vendor_approved ? 'Approved' : 'Unapproved',
                                management_approved: product?.management_approved ? 'Approved' : 'Unapproved',
                            }))} 
                            onRowButtonClick={(product: any) => router.push(`product/singleProductPage?id=${product.id}`)}
                        />

                        {/* Pagination */}
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <p className="text-sm text-slate-500">
                                Page <span className="font-semibold text-slate-800">{productsData?.meta?.current_page}</span> of {productsData?.meta?.last_page}
                            </p>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => paginateData(productsData?.meta, 'prev')}
                                    disabled={!productsData?.meta?.previous_page_url}
                                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button 
                                    onClick={() => paginateData(productsData?.meta, 'next')}
                                    disabled={!productsData?.meta?.next_page_url}
                                    className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default index

export async function getServerSideProps(context: any) {
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
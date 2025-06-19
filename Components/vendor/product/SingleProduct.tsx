import { useRouter } from "next/router";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'
import { getDateAndTimeFromISODate } from "../../../Utils/convertIsoDateToDateString";
import { formatAmount } from "../../../Utils/formatAmount";
import ButtonFull from "../../buttons/ButtonFull";
import ButtonGhost from "../../buttons/ButtonGhost";
import TextCard from "../../texts/TextCard";
import {useState} from 'react'
import { deleteProductByVendorAction, updateProductVendorApprovedAction, updateProductVendorUnApprovedAction } from "../../../requests/products/products.request";
import SliderInput from "../../inputs/SliderInput";
import DeleteProductModal from "../../modals/vendor/product/DeletProductModal";
import { activateProductShowcaseAction, deactivateProductShowcaseAction } from "../../../requests/showcase/showcase.request";
import { Fade } from "react-awesome-reveal";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import VendorNavBar from "../layout/VendorNavBar";

interface ISingleProductProps {
    product: {
        id: number,
        product_name: string,
        product_description: string,
        product_introduction: string,
        product_summary: string,
        product_price: number,
        product_discount?: number,
        rating?: number,
        quantity: number,
        potential_price?: number,
        potential_discount?: number,
        product_categories: string[],
        product_tags: string[],
        product_faqs: any[],
        flag: number,
        featured_status?: string,
        position: number,
        product_images: string[],
        status: string,
        created_at: string,
        featured?: any
        vendor_approved: boolean;
        management_approved: boolean;
    }
}

export const SingleProduct = ({product} : ISingleProductProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    let vendorId: string = '';
    const [vendorApprovedStatus, setVendorApprovedStatus] = useState(product?.vendor_approved);
    const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
    const [selectedFAQ, setSelectedFAQ] = useState(product?.product_faqs[0] ?? {});
   
    if(typeof window !== 'undefined') {
        vendorId = JSON.parse(Cookies.get('user')!).vendor;
    }

    const approveProduct = async () => {
        setIsApproving(true)

        await updateProductVendorApprovedAction(product?.id, vendorId)
        .then((response) => {
            if(response.status === 202) {
                setVendorApprovedStatus(!vendorApprovedStatus);
                toast.success('Product status updated');
            }
        
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(() => setIsApproving(false));
    }

    const unApproveProduct = async () => {
        setIsApproving(true)

        await updateProductVendorUnApprovedAction(product?.id, vendorId)
        .then((response) => {
            if(response.status === 202) {
                setVendorApprovedStatus(!vendorApprovedStatus);
                toast.success('Product status updated');
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(() => setIsApproving(false));
    }

    const deleteAProduct = async () => {
        setIsLoading(true)

        await deleteProductByVendorAction(product?.id, vendorId)
        .then((response) => {
            if(response.status === 202) {
                toast.success('Product deleted');
                setShowDeleteProductModal(false);
                router.push('/vendor/product');
            }
        })
        .catch(error => {
            console.log({error});
            toast.error(error?.response?.data?.message || 'Error try again later');
        })
        .finally(() => setIsLoading(false));
    }

    const activateProductFeature = async () => {
        setIsLoading(true);
        await activateProductShowcaseAction(product?.featured?.id, vendorId)
        .then((response) => {
            if(response.status === 201) {
                router.push(response.data.data.pay_stack_checkout_url);
            }
        })
        .catch(error => {
            toast.error(error?.response?.data?.message || 'Error! Try again later');
        })
        .finally(() => setIsLoading(false));
    }

    const deactivateProductFeature = async () => {
        setIsLoading(true);
        await deactivateProductShowcaseAction(product?.featured?.id, vendorId)
        .then((response) => {
            if(response.status === 201) {
                router.push(response.data.data.pay_stack_checkout_url);
            }
        })
        .catch(error => {
            toast.error(error?.response?.data?.message || 'Error! Try again later');
        })
        .finally(() => setIsLoading(false));
    }
 
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col w-full lg:w-[80%] lg:absolute right-0 lg:left-[20%] rounded-md !px-2 lg:!px-4">
            <VendorNavBar />
            {
                showDeleteProductModal && (
                    <DeleteProductModal
                        setShow={() => setShowDeleteProductModal(!showDeleteProductModal)}
                        loading={isLoading}
                        onDelete={deleteAProduct}
                    />
                )
            }
            <div className='flex flex-col bg-white'>
                <div className="flex flex-row justify-between border-b border-gray-200 p-4">
                    <h2 className="text-xl font-semibold align-center align-baseline my-auto capitalize">{product?.product_name}</h2>
                    <div className="flex flex-row ">
                        <div className="hidden md:flex h-10">
                            <ButtonGhost
                                action="Delete Product"
                                onClick={() => setShowDeleteProductModal(!showDeleteProductModal)}
                            />
                        </div>
                        <div className="ml-3 h-10">
                            <ButtonFull
                                action="Edit Product"
                                onClick={() => router.push(`editProductPage?id=${product?.id}`)}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex flex-col'>
                    <div className='flex flex-col lg:flex-row'>
                        <div className="flex flex-row w-full lg:w-[50%]">
                            <div className='w-[60%] mr-[3%] md:mr-none'>
                                <TextCard label='Product ID' value={product?.id} />
                            </div>
                            <div className='w-[30%] md:w-auto md:mr-none'>
                                <TextCard label='Price' value={formatAmount(product?.product_price)} />
                            </div>
                        </div>
                        <div className="flex flex-row lg:w-[50%]">
                            <div className='w-[60%] mr-[3%] md:mr-none'>
                                <TextCard label='Discount %' value={product?.product_discount ?? 0} />
                            </div>
                            <div className='w-[30%] md:w-auto md:mr-none'>
                                <TextCard label='Stock' value={product?.quantity} />
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-col lg:flex-row'>
                        <div className="flex flex-row lg:w-[50%]">
                            <div className='w-[60%] mr-[3%] md:mr-none'>
                                <TextCard label='Created On' value={getDateAndTimeFromISODate(product?.created_at)} />
                            </div>
                            <div className='w-[30%] md:mr-none'>
                                <div className='w-[60%] mr-[3%] md:mr-none'>
                                    <TextCard label='Flag' value={product?.flag ?? 0} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row lg:w-[50%]">
                            <div className='w-[60%] whitespace-nowrap mr-[3%] md:mr-none'>
                                <TextCard label='Management Approved' value={product?.management_approved ? 'Approved' : 'Unapproved'} />
                            </div>
                           
                            <div className="flex flex-col w-[30%] py-3 px-5 gap-2">
                                {
                                    vendorApprovedStatus ?
                                    <>
                                        <p className="text-sm text-gray-600 whitespace-nowrap">Hide Product</p> 
                                        <SliderInput
                                            name="vendor_approved"
                                            value={vendorApprovedStatus}
                                            handleChange={unApproveProduct}
                                        />
                                        {isApproving && <p className="text-orange-500">Updating...</p>}
                                    </> : 
                                    <>
                                        <p className="text-sm text-gray-600 whitespace-nowrap">Publish Product</p> 
                                        <SliderInput
                                            name="vendor_approved"
                                            value={vendorApprovedStatus}
                                            handleChange={approveProduct}
                                        />
                                        {isApproving && <p className="text-orange-500">Updating...</p>}
                                    </> 
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col bg-white py-4 mt-8">
                <div className="flex flex-row justify-between items-center pb-3 mb-4 border-b border-gray-100 px-4 relative">
                    <h3 className="font-semibold text-base lg:!text-lg mb-0">Advertisement Details</h3>
                    <div className="h-10">
                        {product?.featured?.status && product?.featured?.status === 'active' ? (
                            <ButtonFull
                                action='Stop Ads'
                                onClick={deactivateProductFeature}
                            />
                            ) :
                            product?.featured?.status === 'inactive' ? (
                                <ButtonFull
                                    action='Activate'
                                    loading={isLoading}
                                    onClick={activateProductFeature}
                                />
                            ) : (
                            <ButtonGhost
                                action='Advertise Product'
                                onClick={() => router.push(`/vendor/showcase/store?product_id=${product?.id}`)}
                            />
                        )}
                    </div>
                </div>
                { product?.featured ?
                    <div className="flex flex-col md:flex-row">
                        <div className="flex flex-row md:w-[50%] lg:w-auto">
                            <div className="w-[60%] lg:w-auto">
                                <TextCard label="Cost" value={product?.featured.featured_amount} />
                            </div>
                            <div className="w-[40%] lg:w-auto">
                                <TextCard label="Status" value={product?.featured.status} />
                            </div>
                        </div>

                        <div className="flex flex-row md:w-[50%] lg:w-auto">
                            <div className="w-[60%] lg:w-auto">
                                <TextCard label="Duration" value={product?.featured.duration_in_hours} />
                            </div>
                            <div className="w-[40%] lg:w-auto"> 
                                <TextCard label="Time left" value={product?.featured.time_left} />
                            </div>
                        </div>
                    </div> : (
                        <>
                            <p className="flex py-8 mx-auto text-center">Advertise your product to reach more customers</p>
                        </>
                    )
                }
            </div>

            <div className="flex flex-col px-4 mt-8 bg-white py-6">
                <h3 className="font-semibold text-left border-b border-gray-200 mb-4 !text-lg">Product Introduction</h3>
                <div className="">
                    <div dangerouslySetInnerHTML={{__html: product?.product_introduction}} />
                </div>
            </div>

            <div className="flex flex-col md:flex-row mt-8 justify-between">
                <div className="flex flex-col bg-white px-4 py-3 w-full md:w-[48%] mb-6 md:mb-0">
                    <h4 className="font-semibold border-b border-gray-200 pb-3 mb-4 !text-lg">Product Category</h4>
                    <div className="flex flex-col py-3">
                        <p className="text-sm text-gray-600">
                            Category
                        </p>
                        <p className="text-base flex flex-row flex-wrap gap-2 text-black font-semibold">
                            {product?.product_categories?.map((category) => (
                                <p className="text-base text-black" key={category}>{category }, &nbsp;</p>
                            ))}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col bg-white px-4 py-3 w-full md:w-[48%]">
                    <h4 className="font-semibold border-b border-gray-200 pb-3 mb-4 !text-lg">Product Tags</h4>
                    <div className="flex flex-col py-3">
                        <p className="text-sm text-gray-600">
                            Tags
                        </p>
                        <div className="flex flex-row flex-wrap gap-2">
                            {product?.product_tags?.map((tag) => (
                                <p className="text-base text-black" key={tag}>{tag }, &nbsp;</p>
                            ))}
                        </div>
                       
                    </div>
                </div>
            </div>

            <div className="flex flex-col px-4 mt-8 bg-white py-6">
                <h3 className="font-semibold text-left border-b border-gray-200 mb-4 !text-lg">Product Description</h3>
                <div className="">
                    <div dangerouslySetInnerHTML={{__html: product?.product_description}} />
                </div>
            </div>

            <div className="flex flex-col my-8 bg-white rounded-md py-6">
                <h4 className="font-semibold text-left pb-3 mb-4 border-b border-gray-200 pl-3">Product Images</h4>
                <div className="flex flex-row gap-3 overflow-scroll px-4">
                    {
                        product?.product_images?.map((image,  index) => (
                            <img src={image} key={index} alt='Product' className="h-36 w-36 object-cover object-center rounded-md" />
                        ))
                    }
                </div>
            </div>

            <div className="flex flex-col px-4 mt-8 bg-white py-6">
                <h3 className="font-semibold text-left border-b border-gray-200 mb-4 !text-lg">Product Footer</h3>
                <div className="">
                    <div dangerouslySetInnerHTML={{__html: product?.product_summary}} />
                </div>
            </div>

            <div className="flex flex-col gap-4 px-4 lg:px-10 xl:px-20 mt-8 bg-white p-4 rounded-md">
                <p className="text-center text-muted text-3xl font-semibold mb-10">
                    Frequently Asked Questions
                </p>
                <div className="flex flex-col gap-2">
                    <Fade cascade triggerOnce>
                    {
                        product?.product_faqs?.map((faq: any, index: number) => (
                            <div 
                                key={faq?.question} 
                                className="flex flex-col gap-1 border-b"
                                onClick={()=>setSelectedFAQ(faq)}    
                            >
                                <div className="flex flex-row gap-4 justify-between">
                                    <div className="flex flex-row gap-4 items-center cursor-pointer">
                                        <p className="bg-foreground w-10 h-10 flex justify-center items-center rounded-xl text-center">{index + 1}</p>
                                        <p className="font-semibold text-lg capitalize">{faq?.question}</p>
                                    </div>
                                    {
                                        selectedFAQ?.answer === faq?.answer ?
                                        <MdKeyboardArrowUp className="text-3xl" /> :
                                        <MdKeyboardArrowDown className="text-3xl" /> 
                                    }
                                </div>
                                {
                                    selectedFAQ?.answer === faq?.answer && (
                                        <p className="text-muted bg-foreground p-4 rounded-xl">{selectedFAQ?.answer}</p>
                                    )
                                }
                            </div>
                        ))
                    }
                    </Fade>
                </div>
            </div>

            <div className="flex md:hidden w-[60%] mx-auto mb-8">
                <ButtonGhost
                    action="Delete Product"
                    onClick={()=>setShowDeleteProductModal(!showDeleteProductModal)} 
                />
            </div>
        </div>
    );
}


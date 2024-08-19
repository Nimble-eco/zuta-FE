import { useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'
import { injectStyle } from "react-toastify/dist/inject-style";
import ButtonFull from "../../buttons/ButtonFull"
import ImagePicker from "../../inputs/ImagePicker"
import MyDropDownInput from "../../inputs/MyDropDownInput"
import MyNumberInput from "../../inputs/MyNumberInput"
import MySearchInput from "../../inputs/MySearchInput"
import TextInput from "../../inputs/ColumnTextInput"
import { searchProductCategoriesAction } from '../../../requests/productCategories/productCategories.request';
import { searchProductTagsAction } from '../../../requests/productTags/productTags.request';
import SimpleLoader from '../../loaders/SimpleLoader';
import SelectedListItemCard from '../../cards/SelectedListItemCard';
import DropdownItem from '../../inputs/DropdownItem';
import { updateProductAction } from '../../../requests/products/products.request';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { convertToBase64 } from '../../../Utils/convertImageToBase64';
import { formatAmount } from '../../../Utils/formatAmount';
import TextAreaInput from '../../inputs/TextAreaInput';

interface IEditProductProps {
    product: {
        id: string,
        product_name: string,
        product_description: string,
        product_price: number,
        product_discount?: number,
        rating?: number,
        quantity: number,
        potential_price?: number,
        potential_discount?: number,
        product_categories: string[],
        product_tags: string[],
        flag: number,
        featured_status?: string,
        position: number,
        product_images: string[],
        status: string,
        created_at: string,
        featured?: any
    },
}

const EditProduct = ({product}: IEditProductProps) => {
    const router = useRouter();
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [productCategories, setProductCategories] = useState<any[]>([]);
    const [productTags, setProductTags] = useState<any[]>([]);
    const [showProductCategoriesDropdown, setShowProductCategoriesDropdown] = useState(false);
    const [showProductTagsDropdown, setShowProductTagsDropdown] = useState(false);
    const showProductCatDropdownRef = useRef<HTMLInputElement>(null);
    const showProductTagDropdownRef = useRef<HTMLInputElement>(null);
    let vendorId: string = '';

    const [productData, setProductData] = useState<any>({
        product_name: product.product_name,
        product_description: product.product_description,
        product_price: product.product_price,
        product_discount: product.product_discount,
        quantity: product.quantity,
        status: product.status,
        product_categories: product.product_categories,
        product_tags: product.product_tags,
        base64_images: product.product_images,
    });

    const handleChange = (e: any) => {
        setProductData((prev: any) => ({
            ...productData,
            [e.target.name]: e.target.value
        }));
    }

    if(typeof window !== 'undefined') {
        injectStyle();
        vendorId = JSON.parse(Cookies.get('user')!).vendor;
    }

    const [searchProductCategoriesString, setSearchProductCategoriesString] = useState<string>('');
    const searchCategories = async (searchString: string) => {
        setSearchProductCategoriesString(searchString);
        if(searchString.length <3) return;

        setLoadingSearch(true);
        await searchProductCategoriesAction(searchString)
        .then((response) => {
            if(response.status === 200) {
                setProductCategories(response.data?.data?.data ?? []);
                setShowProductCategoriesDropdown(true);
            }
        })
        .catch(error => {
            console.log({error})
        })
        .finally(() => setLoadingSearch(false));
    }

    const selectCategory = (category: string) => {
        const arr = productData.product_categories;
        arr.push(category);
        setProductData({...productData, product_categories: arr});
        setShowProductCategoriesDropdown(false);
    }

    const removeCategory = (title: string) => {
        const arr = productData.product_categories?.filter((category: string) => category !== title);
        setProductData({...productData, product_categories: arr});
        setShowProductCategoriesDropdown(false);
    }

    const [searchProductTagsString, setSearchProductTagsString] = useState<string>('');
    const searchTags = async (searchString: string) => {
        setSearchProductTagsString(searchString);
        if(searchString.length <3) return;

        setLoadingSearch(true);
        await searchProductTagsAction(searchString)
        .then((response) => {
            if(response.status === 200) {
                setProductTags(response.data?.data?.data ?? []);
                setShowProductTagsDropdown(true);
            }
        })
        .catch(error => {
            console.log({error})
        })
        .finally(() => setLoadingSearch(false));
    }

    const selectATag = (category: string) => {
        const arr = productData.product_tags;
        arr.push(category);
        setProductData({...productData, product_tags: arr});
        setShowProductTagsDropdown(false);
    }

    const removeTag = (title: string) => {
        const arr = productData.product_tags?.filter((tag: string) => tag !== title);
        setProductData({...productData, product_tags: arr});
        setShowProductTagsDropdown(false);
    }

    const selectImage = async (e: any) => {
        let base64_image = await convertToBase64(e.target.files[0]);
        let arr = productData.base64_images;
        arr.push(base64_image);
        setProductData({...productData, base64_images: arr});
    }

    const removeImage = async(itemIndex: number) => {
        let arr: string[] = productData.base64_images;
        arr = arr.filter((imageSrc, index) => index !== itemIndex);
        setProductData({...productData, base64_images: arr})
    }

    const updateAProduct = async () => {
        setIsLoading(true);
        await updateProductAction({
            ...productData,
            id: product.id,
            vendor_id: vendorId
        })
        .then((response) => {
            if(response.status === 201) {
                setIsLoading(false);
                toast.success('Product upated successfully');
                router.push('/vendor/product')
            }
        })
        .catch(error => {
            console.log({error})
            toast.error(error.response?.data?.message ?? 'Error try agin later');
        })
        .finally(() => setIsLoading(false));
    }

  return (
    <div className="flex flex-col w-full gap-4 md:w-[80%] md:absolute md:right-0 md:left-[20%]">
        <div className="flex flex-row relative bg-white px-2 py-4 mb-3 border-b border-gray-200">
            <h2 className="text-lg font-bold">Product Details</h2>
            <div className="w-fit absolute right-1 bottom-2">
                <ButtonFull 
                    action="Update Product"
                    loading={isLoading}
                    onClick={updateAProduct}
                />
            </div>
        </div>

        <TextInput 
            label="Name"
            value={productData.product_name || ""}
            name='product_name'
            placeHolder="Enter product name"
            onInputChange={handleChange}
        />

        <TextAreaInput 
            label="Shot Description"
            name='product_description'
            value={productData?.product_description || ""}
            placeHolder="Enter a short description of product"
            onInputChange={handleChange}
        />

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-4">
            <div className="w-full">
                <MyNumberInput 
                    label="Price"
                    name="product_price"
                    value={productData.product_price}
                    onInputChange={handleChange}
                />
            </div>
            <div className="w-full">
                <div className='flex flex-row items-center gap-2'>
                    <div className='w-full md:w-[60%]'>
                        <MyNumberInput  
                            label="Discount"
                            name="product_discount"
                            value={productData?.product_discount}
                            onInputChange={handleChange}
                        />
                    </div>
                    <p className='font-medium text-green-600 align-bottom my-auto'>
                        discount  = {" "} {(formatAmount((productData.product_discount/100) * productData.product_price)) ?? 0}
                    </p>
                </div>
            </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-4">
            <div className="w-full">
                <MyDropDownInput
                    label="Staus"
                    name="status"
                    onSelect={handleChange}
                    options={[
                        {
                            title: 'Public',
                            value: 'public'
                        },
                        {
                            title: 'Private',
                            value: 'private'
                        },
                    ]}
                />
                <p className='text-xs text-gray-500 font-medium'>Show this item in the marketplace</p>
            </div>
            <div className="w-full">
                <MyNumberInput 
                    label="Quantity in stock"
                    name="quantity"
                    value={productData.quantity}
                    onInputChange={handleChange}
                />
            </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 justify-between">
            <div className="w-full flex flex-col relative">
                <p className="text-sm font-semibold mb-2">Category</p>
                <MySearchInput 
                    searchInputPlaceHolder="Type here to Search categories"
                    name='searchCategories'
                    value={searchProductCategoriesString}
                    onSearch={searchCategories}
                />
                {
                    showProductCategoriesDropdown && (
                        <div className='flex flex-col bg-white shadow-2xl w-full gap-3 absolute top-20 px-4 py-2 rounded-md h-52 overflow-y-scroll z-30' ref={showProductCatDropdownRef}>
                            {
                                loadingSearch ? 
                                <div className='flex justify-center align-middle'>
                                    <SimpleLoader />
                                </div> : 
                                <>
                                    {
                                        productCategories?.map((category) => (
                                            <DropdownItem
                                                title={category.name}
                                                onClick={selectCategory}
                                            />
                                        ))
                                    }
                                </>

                            }
                        </div>
                    )
                }

                <div className='flex flex-row flex-wrap mt-2 gap-3'>
                    {
                        productData.product_categories && productData.product_categories?.map((category: string) => (
                            <SelectedListItemCard 
                                title={category}
                                onClick={removeCategory}
                            />
                        ))
                    } 
                </div>
            </div>
            <div className="w-full flex flex-col relative">
                <p className="text-sm font-semibold mb-2">Tags</p>
                <MySearchInput 
                    searchInputPlaceHolder="Type here to Search tags"
                    name='searchTags'
                    value={searchProductTagsString}
                    onSearch={searchTags}
                />
                {
                    showProductTagsDropdown && (
                        <div className='flex flex-col bg-white shadow-2xl w-full gap-3 absolute top-20 px-4 py-2 rounded-md h-48 overflow-y-scroll z-30'  ref={showProductTagDropdownRef}>
                            {
                                loadingSearch ? 
                                <div className='flex justify-center align-middle'>
                                    <SimpleLoader />
                                </div> : 
                                <>
                                    {
                                        productTags?.map((tag) => (
                                            <DropdownItem
                                                title={tag.name}
                                                onClick={selectATag}
                                            />
                                        ))
                                    }
                                </>

                            }
                        </div>
                    )
                }

                <div className='flex flex-row flex-wrap mt-2 gap-3'>
                    {
                        productData.product_tags && productData.product_tags?.map((tag: string) => (
                            <SelectedListItemCard 
                                title={tag}
                                onClick={removeTag}
                            />
                        ))
                    } 
                </div>
            </div>
        </div>

        <div className="flex flex-col my-8 bg-white py-6">
            <ImagePicker
                label='Product images'
                onSelect={selectImage}
                files={productData?.base64_images}
                onRemove={removeImage}
            />
        </div>
    </div>
  )
}

export default EditProduct
import { useState, useEffect, useRef } from 'react'
import ButtonFull from "../../buttons/ButtonFull"
import ImagePicker from "../../inputs/ImagePicker"
import MyDropDownInput from "../../inputs/MyDropDownInput"
import MyNumberInput from "../../inputs/MyNumberInput"
import MySearchInput from "../../inputs/MySearchInput"
import TextInput from "../../inputs/ColumnTextInput"
import { searchProductCategoriesAction } from '../../../requests/productCategories/productCategories.request'
import SimpleLoader from '../../loaders/SimpleLoader'
import DropdownItem from '../../inputs/DropdownItem'
import SelectedListItemCard from '../../cards/SelectedListItemCard'
import { searchProductTagsAction } from '../../../requests/productTags/productTags.request'
import { convertToBase64 } from '../../../Utils/convertImageToBase64'
import { createProductAction } from '../../../requests/products/products.request'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const CreateProduct = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [productCategories, setProductCategories] = useState<any[]>([]);
    const [productTags, setProductTags] = useState<any[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [showProductCategoriesDropdown, setShowProductCategoriesDropdown] = useState(false);
    const [showProductTagsDropdown, setShowProductTagsDropdown] = useState(false);
    const showProductCatDropdownRef = useRef<HTMLInputElement>(null);
    const showProductTagDropdownRef = useRef<HTMLInputElement>(null);

    const [newProduct, setNewProduct] = useState<any>({
        product_name: '',
        product_description: '',
        product_price: '',
        product_discount: 0,
        quantity: 0,
        status: '',
        product_categories: [],
        product_tags: [],
        base64_images: [],
    });

    const handleChange = (e: any) => {
        setNewProduct((prev: any) => ({
            ...newProduct,
            [e.target.name]: e.target.value
        }))
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
        const arr = newProduct.product_categories;
        arr.push(category);
        setNewProduct({...newProduct, product_categories: arr});
        setShowProductCategoriesDropdown(false);
    }

    const removeCategory = (title: string) => {
        const arr = newProduct.product_categories?.filter((category: string) => category !== title);
        setNewProduct({...newProduct, product_categories: arr});
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
        const arr = newProduct.product_tags;
        arr.push(category);
        setNewProduct({...newProduct, product_tags: arr});
        setShowProductTagsDropdown(false);
    }

    const removeTag = (title: string) => {
        const arr = newProduct.product_tags?.filter((tag: string) => tag !== title);
        setNewProduct({...newProduct, product_tags: arr});
        setShowProductTagsDropdown(false);
    }

    const selectImage = async (e: any) => {
        let base64_image = await convertToBase64(e.target.files[0]);
        let arr = newProduct.base64_images;
        arr.push(base64_image);
        setNewProduct({...newProduct, base64_images: arr});
    }

    const createProduct = async () => {

        setIsLoading(true);
        const vendorId = localStorage.getItem('vendor_id');
        await createProductAction({
            ...newProduct,
            vendor_id: vendorId
        })
        .then((response) => {
            console.log({response})
            if(response.status === 201) {
                toast.success('Product created successfully');
                router.push('/vendor/products')
            }
        })
        .catch(error => {
            console.log({error})
            toast.error(error.response?.data?.message ?? 'Error try agin later');
        })
        .finally(() => setIsLoading(false));
    }
    
    useEffect(() => {
        let isMounted = true;

        const handleClickOutside = (event: any) => {
            if(isMounted) {
                if (showProductCatDropdownRef.current && !showProductCatDropdownRef.current!.contains(event.target)) setShowProductCategoriesDropdown(false);
                if (showProductTagDropdownRef.current && !showProductTagDropdownRef.current!.contains(event.target)) setShowProductTagsDropdown(false);
            }
        }
    
        document.addEventListener('mousedown', handleClickOutside);
    
       return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          isMounted = false;
        };
    }, []);

    console.log({newProduct})

  return (
    <div className="flex flex-col w-[80%] absolute right-0 left-[23%]">
        <div className="flex flex-row relative px-2 py-4 mb-3 border-b border-gray-200">
            <h2 className="text-lg font-bold">Product Details</h2>
            <div className="w-fit absolute right-1 bottom-2">
                <ButtonFull 
                    action="Create Product"
                    loading={isLoading}
                    onClick={createProduct}
                />
            </div>
        </div>

        <TextInput 
            label="Name"
            name='product_name'
            value={newProduct.product_name}
            placeHolder="Enter product name"
            onInputChange={handleChange}
        />

        <TextInput 
            label="Shot Description"
            name='product_description'
            value={newProduct.product_description}
            placeHolder="Enter a short description of product"
            onInputChange={handleChange}
        />

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
            <div className="w-full">
                <MyNumberInput 
                    label="Price"
                    name="product_price"
                    value={newProduct.product_price}
                    onInputChange={handleChange}
                />
            </div>
            <div className="w-full">
                <MyNumberInput 
                    label="Discount"
                    name="product_discount"
                    value={newProduct.product_discount}
                    onInputChange={handleChange}
                />
            </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
            <div className="w-full">
                <MyDropDownInput
                    label="How long to package"
                    name="duration_to_prepare"
                    onSelect={() => {}}
                    options={[
                        {
                            title: 'Less than a day',
                            value: '1day'
                        },
                        {
                            title: '2 days',
                            value: '2days'
                        },
                        {
                            title: '3 days',
                            value: '3days'
                        },
                        {
                            title: '4 days',
                            value: '4days'
                        },
                        {
                            title: '5 days',
                            value: '5days'
                        },
                        {
                            title: '6 days',
                            value: '6days'
                        },
                        {
                            title: '7 days',
                            value: '7days'
                        }
                    ]}
                />
            </div>
            <div className="w-full">
                <MyNumberInput 
                    label="Quantity in stock"
                    name="quantity"
                    value={newProduct.quantity}
                    onInputChange={handleChange}
                />
            </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4 justify-between">
            <div className="w-full flex flex-col relative">
                <p className="text-sm font-semibold mb-2">Category</p>
                <MySearchInput 
                    searchInputPlaceHolder="Select a category"
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
                        newProduct.product_categories && newProduct.product_categories?.map((category: string) => (
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
                    searchInputPlaceHolder="Select some tags"
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
                        newProduct.product_tags && newProduct.product_tags?.map((tag: string) => (
                            <SelectedListItemCard 
                                title={tag}
                                onClick={removeTag}
                            />
                        ))
                    } 
                </div>
            </div>
        </div>

        <div className="my-4">
            <ImagePicker 
                label="Product Image"
                onSelect={selectImage}
                files={newProduct.base64_images}
            />
        </div>
    </div>
  )
}

export default CreateProduct
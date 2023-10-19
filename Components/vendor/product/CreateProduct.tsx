import { useState } from 'react'
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

const CreateProduct = () => {
    const [productCategories, setProductCategories] = useState<any[]>([]);
    const [productTags, setProductTags] = useState<any[]>([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [showProductCategoriesDropdown, setShowProductCategoriesDropdown] = useState(false);
    const [showProductTagsDropdown, setShowProductTagsDropdown] = useState(false);

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
        await searchProductCategoriesAction(searchString)
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
        setShowProductCategoriesDropdown(false);
    }

    console.log({newProduct})

  return (
    <div className="flex flex-col w-[80%] absolute right-0 left-[23%]">
        <div className="flex flex-row relative px-2 py-4 mb-3 border-b border-gray-200">
            <h2 className="text-lg font-bold">Product Details</h2>
            <div className="w-fit absolute right-1 bottom-2">
                <ButtonFull 
                    action="Create Product"
                    onClick={() => {}}
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
            <div className="w-full flex flex-col gap-3 relative">
                <p className="text-sm font-semibold">Category</p>
                <MySearchInput 
                    searchInputPlaceHolder="Select a category"
                    name='searchCategories'
                    value={searchProductCategoriesString}
                    onSearch={searchCategories}
                />
                {
                    showProductCategoriesDropdown && (
                        <div className='flex flex-col bg-white shadow-2xl w-full gap-3 absolute top-20 px-4 py-2 rounded-md h-48 overflow-y-scroll'>
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

                <div className='flex flex-row flex-wrap gap-3'>
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
            <div className="w-full flex flex-col">
                <p className="text-sm font-semibold gap-3">Tags</p>
                <MySearchInput 
                    searchInputPlaceHolder="Select some tags"
                    name='searchTags'
                    value={searchProductTagsString}
                    onSearch={searchTags}
                />
                {
                    showProductTagsDropdown && (
                        <div className='flex flex-col bg-white shadow-2xl w-full gap-3 absolute top-20 px-4 py-2 rounded-md h-48 overflow-y-scroll'>
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

                <div className='flex flex-row flex-wrap gap-3'>
                    {
                        newProduct.product_tags && newProduct.product_tags?.map((tag: string) => (
                            <SelectedListItemCard 
                                title={tag}
                                onClick={() => {}}
                            />
                        ))
                    } 
                </div>
            </div>
        </div>

        <div className="my-4">
            <ImagePicker 
                label="Product Image"
                onSelect={() => {}}
            />
        </div>
    </div>
  )
}

export default CreateProduct
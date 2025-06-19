
import dynamic from 'next/dynamic';
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
import Cookies from 'js-cookie'
import { formatAmount } from '../../../Utils/formatAmount'
import TextAreaInput from '../../inputs/TextAreaInput'
import { storeMediaAction, storeVideosRequest } from '../../../requests/media/media.requests'
import VideoPicker from '../../inputs/VideoPicker'
import ButtonGhost from '../../buttons/ButtonGhost'
import VendorNavBar from '../layout/VendorNavBar';

const Editor = dynamic(()=>import('react-simple-wysiwyg'), {
    ssr: false
});

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
    let vendorId: string = '';

    if(typeof window !== 'undefined') {
        const cookie = Cookies.get('user');
        vendorId = cookie ? JSON.parse(cookie).vendor : null;
    }
    
    const [newProduct, setNewProduct] = useState<any>({
        product_name: '',
        product_introduction: '',
        product_description: '',
        product_summary: '',
        product_price: '',
        product_discount: 0,
        quantity: 0,
        status: '',
        product_categories: [],
        product_tags: [],
        base64_images: [],
        images: [],
        videos: [],
        testimonial_videos: [],
        product_faqs: [{question: '', answer : ''}],
    });

    const handleChange = (e: any) => {
        setNewProduct((prev: any) => ({
            ...newProduct,
            [e.target.name]: e.target.value
        }))
    }

    const [product_videos, setProductVideos] = useState<any[]>([])
    const [product_testimonial_videos, setProductTestimonialVideos] = useState<any[]>([])

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
        setSearchProductCategoriesString('');
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
        setSearchProductTagsString('');
        setShowProductTagsDropdown(false);
    }

    const removeTag = (title: string) => {
        const arr = newProduct.product_tags?.filter((tag: string) => tag !== title);
        setNewProduct({...newProduct, product_tags: arr});
        setShowProductTagsDropdown(false);
    }

    const selectImage = async (e: any) => {
        let arr = newProduct.images;
        arr.push(e.target.files[0]);
        setNewProduct({...newProduct, images: arr});

        let base64_image = await convertToBase64(e.target.files[0]);
        let base64_arr = newProduct.base64_images;
        base64_arr.push(base64_image);
        setNewProduct({...newProduct, base64_images: base64_arr});
    }

    const selectVideo = async (e: any) => {
        if(e.target.files[0]) {
            let arr = [...product_videos];
            arr.push(e.target.files[0]);
            setProductVideos(arr);
            setNewProduct({...newProduct, videos: arr});
        }
    }

    const removeVideo = async(itemIndex: number) => {
        let arr: string[] = newProduct.base64_videos;
        let videos_arr: string[] = product_videos;
        arr = arr.filter((imageSrc, index) => index !== itemIndex);
        videos_arr = videos_arr.filter((imageSrc, index) => index !== itemIndex);
        setNewProduct({...newProduct, base64_videos: arr})
        setProductVideos(videos_arr)
    }

    const selectTestimonialVideo = async (e: any) => {
        if(e.target.files[0]) {
            let arr = [...product_testimonial_videos]; 
            arr.push(e.target.files[0]);
            setProductTestimonialVideos(arr);
            setNewProduct({...newProduct, testimonial_videos: arr});
        }
    }

    const removeTestimonialVideo = async(itemIndex: number) => {
        let arr: string[] = newProduct.base64_testimonial_videos;
        let videos_arr: string[] = product_testimonial_videos;
        arr = arr.filter((imageSrc, index) => index !== itemIndex);
        videos_arr = videos_arr.filter((imageSrc, index) => index !== itemIndex);
        setNewProduct({...newProduct, base64_testimonial_videos: arr})
        setProductTestimonialVideos(videos_arr)
    }

    const addFaq = () => {
        setNewProduct({
            ...newProduct, 
            product_faqs: newProduct?.product_faqs ? [
                ...newProduct?.product_faqs,
                {question: '', answer : ''}
            ] : [
                {question: '', answer : ''}
            ]
        })
    }

    const removeFaq = (index: number) => {
        setNewProduct({
            ...newProduct, 
            product_faqs: newProduct?.product_faqs?.filter((_:any,i: number)=> i !== index)
        })
    }

    const handleFaqChange = (index: number, field: string, value: string) => {
        const updatedItems = newProduct?.product_faqs?.map((item: any, i: number) => 
            i === index ? { ...item, [field]: value } : item
        );
        setNewProduct({
            ...newProduct,
            product_faqs: updatedItems
        });
    };


    const createProduct = async () => {
        setIsLoading(true);

        let url_product_images:any;
        let url_videos:any;
        let url_testimonial_videos:any;

        if(newProduct?.images?.length > 0){
            await storeMediaAction({
                files: newProduct.images,
                category: 'products'
            })
            .then(response => {
                if(response.status === 201) {
                    url_product_images = [...response?.data?.data];
                }
            })
        }

        if(product_videos?.length > 0){
            await storeVideosRequest({
                files: product_videos,
                category: 'products'
            })
            .then(response => {
                if(response.status === 201) {
                    url_videos = [...response?.data?.data];
                }
            })
        }

        if(product_testimonial_videos?.length > 0){
            await storeVideosRequest({
                files: product_testimonial_videos,
                category: 'products'
            })
            .then(response => {
                if(response.status === 201) {
                    url_testimonial_videos = [...response?.data?.data];
                }
            })
        }


        createProductAction({
            ...newProduct,
            images: null,
            vendor_id: vendorId,
            url_images: url_product_images,
            url_videos,
            url_testimonial_videos
        })
        .then((response) => {
            if(response.status === 201) {
                setIsLoading(false);
                toast.success('Product created successfully');
                setTimeout(()=>router.push('/vendor/product'), 2000);
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

  return (
    <div className="flex flex-col gap-4 min-h-screen w-full mx-auto lg:w-[80%] lg:mx-0 lg:absolute right-0 lg:left-[20%] pb-20 !px-2 lg:!px-4">
        <VendorNavBar />
        <div className="flex flex-row justify-between items-center relative !px-2 lg:!px-0 !py-4 lg:!py-0 bg-white">
            <h2 className="text-lg font-bold">Product Details</h2>
            <div className="w-fit">
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

        <TextAreaInput 
            label="Shot introduction"
            name='product_introduction'
            value={newProduct.product_introduction}
            placeHolder="Enter a short introduction of product"
            onInputChange={handleChange}
        />

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
            <div className="w-full">
                <MyNumberInput 
                    label="Price"
                    name="product_price"
                    value={newProduct.product_price}
                    onInputChange={handleChange}
                />
            </div>
            <div className="w-full">
                <div className='flex flex-col items-baseline gap-2'>
                    <div className='w-full'>
                        <MyNumberInput 
                            label="Discount %"
                            name="product_discount"
                            value={newProduct.product_discount}
                            onInputChange={handleChange}
                        />
                    </div>
                    <p className='font-medium text-green-600 !mb-0 whitespace-nowrap'>
                        Discount  = {" "} {(formatAmount((newProduct.product_discount/100) * newProduct.product_price)) ?? 0}
                    </p>
                </div>
            </div>
        </div>

        <div className='flex flex-col'>
            <p className='text-sm font-medium'>Product Description</p>
            <Editor 
                value={newProduct?.product_description} 
                onChange={(e: any)=>setNewProduct({...newProduct, product_description: e.target.value})} 
                className="min-h-[40vh]"    
            />
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
            <div className="w-full flex flex-col gap-1">
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
                    value={newProduct.quantity}
                    onInputChange={handleChange}
                />
            </div>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-6 justify-between">
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

        <div className="flex flex-col bg-white">
            <VideoPicker
                label='Product videos'
                onSelect={selectVideo}
                files={product_videos}
                onRemove={removeVideo}
                uploading={isLoading}
                disabled={true}
                // disabled={product_videos?.length === product?.product_videos?.length}
                // uploadFiles={()=>uploadVideos('videos')}
            />
        </div>

        <div className="flex flex-col bg-white">
            <VideoPicker
                label='Product testimonials'
                onSelect={selectTestimonialVideo}
                files={product_testimonial_videos}
                // files={productData?.base64_testimonial_videos}
                onRemove={removeTestimonialVideo}
                uploading={isLoading}
                disabled={true}
                // disabled={product_testimonial_videos?.length === product?.product_testimonials?.length}
                // uploadFiles={()=>uploadVideos('testimonials')}
            />
        </div>

        <div className='flex flex-col'>
            <p className='text-sm font-medium'>Foot Note/Specifications</p>
            <Editor 
                value={newProduct?.product_summary} 
                onChange={(e: any)=>setNewProduct({...newProduct, product_summary: e.target.value})} 
                className="min-h-[40vh]"    
            />
        </div>

        <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium'>FAQs</p>
            <p className='text-xs font-light mb-4'>Frequently asked questions about this product</p>
            <div className='flex flex-col gap-2'>
                {
                    (newProduct?.product_faqs || Array.from([1]))?.map((faq: any, index: number) => (
                        <div key={index} className='flex flex-col md:flex-row gap-4 md:items-center'>
                            <p className='hidden md:flex font-light'>{index + 1}.</p>
                            <TextInput 
                                label="Question"
                                value={faq?.question || ""}
                                name='question'
                                placeHolder="Enter FAQ question here"
                                onInputChange={(e: any)=>handleFaqChange(index, e.target.name, e.target.value)}
                                className='lg:w-[50%]'
                            />
                            <TextInput 
                                label="Answer"
                                value={faq?.answer || ""}
                                name='answer'
                                placeHolder="Enter FAQ answer here"
                                onInputChange={(e: any)=>handleFaqChange(index, e.target.name, e.target.value)}
                                className='lg:w-[50%]'
                            />
                            <p 
                                onClick={()=>removeFaq(index)}
                                className='text-red-600 cursor-pointer text-sm font-medium text-right'
                            >
                                Remove
                            </p>
                        </div>
                    ))
                }
            </div>

            <div className='flex lg:justify-end lg:w-[18%] lg:ml-[80%] mt-6'>
                <ButtonGhost
                    action='Add FAQ'
                    onClick={addFaq}
                />
            </div>
        </div>
    </div>
  )
}

export default CreateProduct
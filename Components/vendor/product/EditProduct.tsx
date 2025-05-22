'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify'
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
import { storeMediaAction, storeVideosRequest } from '../../../requests/media/media.requests';
import VideoPicker from '../../inputs/VideoPicker';
import ButtonGhost from '../../buttons/ButtonGhost';

const Editor = dynamic(()=>import('react-simple-wysiwyg'), {
    ssr: false
});

interface IEditProductProps {
    product: {
        id: number,
        product_name: string,
        product_introduction: string,
        product_description: string,
        product_summary: string,
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
        product_videos: string[],
        product_testimonials: string[],
        status: string,
        created_at: string,
        featured?: any
        product_faqs?: any[];
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

    const [product_images, setProductImages] = useState<string[]>(product.product_images ?? [])
    const [product_videos, setProductVideos] = useState<string[]>(product.product_videos)
    const [product_testimonial_videos, setProductTestimonialVideos] = useState<string[]>(product.product_testimonials)
    const [productData, setProductData] = useState<any>({
        product_name: product.product_name,
        product_introduction: product.product_introduction,
        product_description: product.product_description,
        product_summary: product.product_summary,
        product_price: product.product_price,
        product_discount: product.product_discount,
        quantity: product.quantity,
        status: product.status,
        product_categories: product.product_categories,
        product_tags: product.product_tags,
        base64_images: product.product_images,
        base64_videos: product.product_videos,
        base64_testimonial_videos: product.product_testimonials,
        url_images: null,
        images: [],
        videos: [],
        testimonial_videos: product.product_testimonials,
        product_faqs: product?.product_faqs || [{question: '', answer : ''}]
    });

    const handleChange = (e: any) => {
        setProductData((prev: any) => ({
            ...productData,
            [e.target.name]: e.target.value
        }));
    }

    if(typeof window !== 'undefined') {
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
        let arr = productData.images;
        arr.push(e.target.files[0]);
        setProductData({...productData, images: arr});

        let base64_image = await convertToBase64(e.target.files[0]);
        let base64_arr = productData.base64_images;
        base64_arr.push(base64_image);
        setProductData({...productData, base64_images: base64_arr});
    }

    const removeImage = async(itemIndex: number) => {
        let arr: string[] = productData.base64_images;
        let images_arr: string[] = product_images;
        arr = arr.filter((imageSrc, index) => index !== itemIndex);
        images_arr = images_arr.filter((imageSrc, index) => index !== itemIndex);
        setProductData({...productData, base64_images: arr})
        setProductImages(images_arr)
    }

    const selectVideo = async (e: any) => {
        if(e.target.files[0]) {
            let arr = [...product_videos];
            arr.push(e.target.files[0]);
            setProductVideos(arr);
            setProductData({...productData, videos: arr});
        }
    }

    const removeVideo = async(itemIndex: number) => {
        let arr: string[] = productData.base64_videos;
        let videos_arr: string[] = product_videos;
        arr = arr.filter((imageSrc, index) => index !== itemIndex);
        videos_arr = videos_arr.filter((imageSrc, index) => index !== itemIndex);
        setProductData({...productData, base64_videos: arr})
        setProductVideos(videos_arr)
    }

    const selectTestimonialVideo = async (e: any) => {
        if(e.target.files[0]) {
            let arr = [...product_testimonial_videos]; 
            arr.push(e.target.files[0]);
            setProductTestimonialVideos(arr);
            setProductData({...productData, testimonial_videos: arr});
        }
    }

    const removeTestimonialVideo = async(itemIndex: number) => {
        let arr: string[] = productData.base64_testimonial_videos;
        let videos_arr: string[] = product_testimonial_videos;
        arr = arr.filter((imageSrc, index) => index !== itemIndex);
        videos_arr = videos_arr.filter((imageSrc, index) => index !== itemIndex);
        setProductData({...productData, base64_testimonial_videos: arr})
        setProductTestimonialVideos(videos_arr)
    }

    const addFaq = () => {
        setProductData({
            ...productData, 
            product_faqs: productData?.product_faqs ? [
                ...productData?.product_faqs,
                {question: '', answer : ''}
            ] : [
                {question: '', answer : ''}
            ]
        })
    }

    const removeFaq = (index: number) => {
        setProductData({
            ...productData, 
            product_faqs: productData?.product_faqs?.filter((_:any,i: number)=> i !== index)
        })
    }

    const handleFaqChange = (index: number, field: string, value: string) => {
        const updatedItems = productData?.product_faqs?.map((item: any, i: number) => 
            i === index ? { ...item, [field]: value } : item
        );
        setProductData({
            ...productData,
            product_faqs: updatedItems
        });
    };

    const uploadImages = async () => {
        if(productData.images?.length > 0) {
            setIsLoading(true);

            await storeMediaAction({
                files: productData.images,
                category: 'products'
            })
            .then((response: any) => {
                if(response?.status === 201) {
                    let url_imgs: string[] | undefined = [];
                    url_imgs?.push(...response.data?.data);

                    updateProductAction({
                        id: product.id,
                        vendor_id: vendorId,
                        url_images: url_imgs,
                        product_images,
                    })
                    .then((response) => {
                        if(response.status === 201) {
                            setIsLoading(false);
                            toast.success('Images uploaded successfully');
                        }
                    })  
                    .catch(error => {
                        console.log({error})
                        toast.error(error.response?.data?.message ?? 'Error try agin later');
                    })
                    .finally(() => setIsLoading(false));
                }
            })
            .catch(error => {
                console.log({error})
                toast.error(error.response?.data?.message ?? 'Error try agin later');
            })
            .finally(() => setIsLoading(false));
        }
    }

    const uploadVideos = async (type: 'videos' | 'testimonials') => {
        let files: any[] = [];
        if(type === 'videos') files = product_videos;
        if(type === 'testimonials') files = product_testimonial_videos;

        if(files?.length > 0) {
            setIsLoading(true);

            await storeVideosRequest({
                files,
                category: 'products'
            })
            .then((response: any) => {
                if(response?.status === 201) {
                    let url_vids: string[] | undefined = [];
                    url_vids?.push(...response.data?.data);

                    const payload: any = {
                        id: product.id,
                        vendor_id: vendorId,
                    }

                    if(type === 'videos') {
                        payload.url_videos = [...product?.product_videos, ...url_vids];
                    }

                    if(type === 'testimonials') {
                        payload.url_testimonial_videos = [...product?.product_testimonials, ...url_vids];
                    }

                    updateProductAction(payload)
                    .then((response) => {
                        if(response.status === 201) {
                            setIsLoading(false);
                            toast.success('Images uploaded successfully');
                        }
                    })  
                    .catch(error => {
                        console.log({error})
                        toast.error(error.response?.data?.message ?? 'Error try agin later');
                    })
                    .finally(() => setIsLoading(false));
                }
            })
            .catch(error => {
                console.log({error})
                toast.error(error.response?.data?.message ?? 'Error try agin later');
            })
            .finally(() => setIsLoading(false));
        }
    }

    const updateAProduct = async () => {
        setIsLoading(true);
        
        updateProductAction({
            ...productData,
            product_images,
            id: product.id,
            images: undefined,
            vendor_id: vendorId
        })
        .then((response) => {
            if(response.status === 201) {
                setIsLoading(false);
                toast.success('Product upated successfully');
                setTimeout(()=>router.back(), 2000);
            }
        })         
        .catch(error => {
            console.log({error})
            toast.error(error.response?.data?.message ?? 'Error try agin later');
            setIsLoading(false)
        })
        .finally(() => setIsLoading(false));
    }

  return (
    <div className="flex flex-col w-full gap-4 lg:w-[80%] md:absolute lg:right-0 lg:left-[20%] pb-20">
        <div className="flex flex-row relative bg-white px-2 py-4 mb-3 border-b border-gray-200 mt-20 lg:mt-0">
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
            label="Short Introduction"
            name='product_introduction'
            value={productData?.product_introduction || ""}
            placeHolder="Enter a short introduction of product"
            onInputChange={handleChange}
        />

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
            <div className="w-full">
                <MyNumberInput 
                    label="Price"
                    name="product_price"
                    value={productData.product_price}
                    onInputChange={handleChange}
                />
            </div>
            <div className="w-full">
                <div className='flex flex-col items-baseline gap-2'>
                    <div className='w-full'>
                        <MyNumberInput  
                            label="Discount"
                            name="product_discount"
                            value={productData?.product_discount}
                            onInputChange={handleChange}
                        />
                    </div>
                    <p className='font-medium text-green-600 !mb-0'>
                        Discount  = {" "} {(formatAmount((productData.product_discount/100) * productData.product_price)) ?? 0}
                    </p>
                </div>
            </div>
        </div>

        <div className='flex flex-col'>
            <p className='text-sm font-medium'>Product Description</p>
            <Editor 
                value={productData?.product_description} 
                onChange={(e: any)=>setProductData({...productData, product_description: e.target.value})} 
                className="min-h-[40vh]"    
            />
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
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
                                                key={category.name}
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
                                key={category}
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
                                                key={tag.name}
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
                                key={tag}
                                title={tag}
                                onClick={removeTag}
                            />
                        ))
                    } 
                </div>
            </div>
        </div>

        <div className="flex flex-col bg-white">
            <ImagePicker
                label='Product images'
                onSelect={selectImage}
                files={productData?.base64_images}
                onRemove={removeImage}
                uploading={isLoading}
                uploadFiles={uploadImages}
            />
        </div>

        <div className="flex flex-col bg-white">
            <VideoPicker
                label='Product videos'
                onSelect={selectVideo}
                files={product_videos}
                // files={productData?.videos}
                onRemove={removeVideo}
                uploading={isLoading}
                disabled={product_videos?.length === product?.product_videos?.length}
                uploadFiles={()=>uploadVideos('videos')}
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
                disabled={product_testimonial_videos?.length === product?.product_testimonials?.length}
                uploadFiles={()=>uploadVideos('testimonials')}
            />
        </div>
        
        <div className='flex flex-col'>
            <p className='text-sm font-medium'>Foot Note/Specifications</p>
            <Editor 
                value={productData?.product_summary} 
                onChange={(e: any)=>setProductData({...productData, product_summary: e.target.value})} 
                className="min-h-[40vh]"    
            />
        </div>

        <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium'>FAQs</p>
            <p className='text-xs font-light mb-4'>Frequently asked questions about this product</p>
            <div className='flex flex-col gap-2'>
                {
                    (productData?.product_faqs || Array.from([1]))?.map((faq: any, index: number) => (
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

export default EditProduct
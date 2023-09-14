import ButtonFull from "../../buttons/ButtonFull"
import TextButton from "../../buttons/TextButton"
import ImagePicker from "../../inputs/ImagePicker"
import MyDropDownInput from "../../inputs/MyDropDownInput"
import MyNumberInput from "../../inputs/MyNumberInput"
import MySearchInput from "../../inputs/MySearchInput"
import TextInput from "../../inputs/ColumnTextInput"

interface IEditProductProps {
    product: {
        id: string,
        name: string,
        description: string,
        price: number,
        discount?: number,
        rating?: number,
        stock: number,
        potential_price?: number,
        potential_discount?: number,
        product_category: string[],
        product_tags: string[],
        flag: number,
        featured_status?: string,
        position: number,
        images: string[],
        status: string,
        created_at: string,
        featured?: any
    }, 
    categories: any[]
}

const EditProduct = ({product, categories}: IEditProductProps) => {
  return (
    <div className="flex flex-col w-full md:w-[80%] md:absolute md:right-0 md:left-[21%]">
        <div className="flex flex-row relative px-2 py-4 mb-3 border-b border-gray-200">
            <h2 className="text-lg font-bold">Product Details</h2>
            <div className="w-fit absolute right-1 bottom-2">
                <ButtonFull 
                    action="Update Product"
                    onClick={() => {}}
                />
            </div>
        </div>

        <TextInput 
            label="Name"
            value={product.name || ""}
            placeHolder="Enter product name"
            onInputChange={() => {}}
        />

        <TextInput 
            label="Shot Description"
            value={product?.description || ""}
            placeHolder="Enter a short description of product"
            onInputChange={() => {}}
        />

        <div className="flex flex-col md:flex-row mb-4">
            <div className="w-full md:w-[45%]">
                <MyNumberInput 
                    label="Price"
                    name="price"
                    onInputChange={() => {}}
                />
            </div>
            <div className="w-full md:w-[45%]">
                <MyNumberInput  
                    label="Discount"
                    name="discount"
                    onInputChange={() => {}}
                />
            </div>
        </div>

        <div className="flex flex-col md:flex-row mb-4">
            <div className="w-full md:w-[45%]">
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
            <div className="w-full md:w-[45%]">
                <MyNumberInput 
                    label="Quantity in stock"
                    name="quantity"
                    onInputChange={() => {}}
                />
            </div>
        </div>

        <div className="flex flex-col md:flex-row mb-4">
            <div className="w-full md:w-[45%] flex flex-col">
                <MyDropDownInput
                    label="Category"
                    name="product_category"
                    value={product.product_category[0] || ""}
                    onSelect={() => {}}
                    options={categories}
                />
            </div>
            <div className="w-full md:w-[45%] flex flex-col">
                <TextInput 
                    label="Tags"
                    value={product?.product_tags || ""}
                    onInputChange={() => {}}
                />
            </div>
        </div>

        <div className="flex flex-col my-8 bg-white py-6">
            <div className="flex flex-row relative py-2 mb-4 border-b border-gray-200">
                <h4 className="font-semibold text-left pb-3 pl-3">Product Images</h4>
                <div className=" hidden md:flex w-fit absolute right-2 bottom-1">
                    <TextButton action="Upload image" onClick={() => {}} />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2 lg:flex lg:flex-row px-4">
                {
                    product?.images?.map((image) => (
                        <div>
                            <img src={image} alt='Product' className="h-32 mr-6" />
                        </div>
                    ))
                }
            </div>
            <div className="flex md:hidden w-fit mx-auto mt-8">
                <TextButton action="Upload image" onClick={() => {}} />
            </div>
        </div>
    </div>
  )
}

export default EditProduct
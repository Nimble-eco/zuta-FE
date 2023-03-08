import ButtonFull from "../../buttons/ButtonFull"
import ImagePicker from "../../inputs/ImagePicker"
import MyDropDownInput from "../../inputs/MyDropDownInput"
import MyNumberInput from "../../inputs/MyNumberInput"
import MySearchInput from "../../inputs/MySearchInput"
import TextInput from "../../inputs/TextInput"

const CreateProduct = () => {
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
            value=""
            placeHolder="Enter product name"
            onInputChange={() => {}}
        />

        <TextInput 
            label="Shot Description"
            value=""
            placeHolder="Enter a short description of product"
            onInputChange={() => {}}
        />

        <div className="flex flex-col md:flex-row mb-4">
            <div className="w-full md:w-[45%]">
                <TextInput 
                    label="Price"
                    value=""
                    placeHolder="Enter a short description of product"
                    onInputChange={() => {}}
                />
            </div>
            <div className="w-full md:w-[45%]">
                <TextInput 
                    label="Discount"
                    value=""
                    placeHolder="Enter highest discount value per product"
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

        <div className="flex flex-col md:flex-row mb-4 justify-between">
            <div className="w-full md:w-[45%] flex flex-col">
                <p className="text-sm font-semibold mb-3 ">Category</p>
                <MySearchInput 
                    searchInputPlaceHolder="Select a category"
                    onSearch={() => {}}
                />
            </div>
            <div className="w-full md:w-[45%] flex flex-col">
                <p className="text-sm font-semibold mb-3">Tags</p>
                <MySearchInput 
                    searchInputPlaceHolder="Select some tags"
                    onSearch={() => {}}
                />
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
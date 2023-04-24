import { useRouter } from "next/router";
import { useState } from "react";
import ButtonFull from "../../../Components/buttons/ButtonFull";
import FilterAndSearchGroup from "../../../Components/inputs/FilterAndSearchGroup";
import MyTable from "../../../Components/tables/MyTable";
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import { productsDummyData } from "../../../data/products";

const index = () => {
    const router = useRouter();

    // PRODUCT FUNCTIONS
    const searchProducts = (value: string) => {}

    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);

    const [currentProductPage, setCurrentProductPage] = useState(0);

    const itemsPerPage = 8;
    const productsPages = [];

    for (let i = 0; i < productsDummyData?.length; i += itemsPerPage) {
        productsPages.push(productsDummyData.slice(i, i + itemsPerPage));
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex flex-row w-[90%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[21%]">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Products</h2>
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

                <div className="flex flex-row py-3 px-4 relative bg-white">
                    <FilterAndSearchGroup 
                        searchInputPlaceHolder="Search name, price, category"
                        onSearch={searchProducts}
                        onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                    />
                    <div className="w-fit absolute right-1">
                        <ButtonFull 
                            action="Create Product"
                            onClick={() => router.push('product/createProductPage')}
                        />
                    </div>
                </div>
                {/* PRODUCTS TABLE */}
                <div className="flex flex-col pb-8 bg-white">
                    <MyTable
                        headings={['image', 'name', 'price', 'discount']}
                        content={productsPages[currentProductPage]} 
                        onRowButtonClick={() => router.push('product/singleProductPage')}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button disabled={currentProductPage === 0} onClick={() => setCurrentProductPage(currentProductPage - 1)} className='mr-3 cursor-pointer'>Previous</button>
                        <button disabled={currentProductPage === productsPages.length - 1} onClick={() => setCurrentProductPage(currentProductPage + 1)} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default index
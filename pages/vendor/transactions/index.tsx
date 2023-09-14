import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import ButtonFull from "../../../Components/buttons/ButtonFull";
import ButtonGhost from "../../../Components/buttons/ButtonGhost";
import FilterAndSearchGroup from "../../../Components/inputs/FilterAndSearchGroup";
import MyTable from "../../../Components/tables/MyTable";
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import { transactionsDummyData } from "../../../data/transactions";
import FilterContainer from "../../../Components/modals/containers/FilterContainer";
import TextInput from "../../../Components/inputs/ColumnTextInput";
import MyNumberInput from "../../../Components/inputs/MyNumberInput";
import MyDropDownInput from "../../../Components/inputs/MyDropDownInput";

const index = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [filterByDetails, setFilterByDetails] = useState({
        product_name: '',
        product_price: 0,
        product_quantity: 0,
        order_id: '',
        order_amount: 0,
        service_fee: 0,
        total_amount: 0,
        start_date: '',
        end_date: '',
        order_status: '',
        payment_status: ''
    });

    // PRODUCT FUNCTIONS
    const searchProducts = (value: string) => {}

    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);

    const itemsPerPage = 8;
    const [currentTransactionsPage, setCurrentTransactionsPage] = useState(0);

    const transactionsPages = [];

    for (let i = 0; i < transactionsDummyData?.length; i += itemsPerPage) {
        transactionsPages.push(transactionsDummyData.slice(i, i + itemsPerPage));
    }

    const handleFilterByDetailsChange = (e: any) => {
        setFilterByDetails((prevState) => ({
            ...prevState,
            [e.target.name] : e.target.value
        }))
    }

    const filterTransactionsPage = async () => {
        setLoading(true);
        setShowFilterInput(false);

        //TODO: MAKE API CALL
    }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
         {
            showFilterInput && <FilterContainer 
                show={showFilterInput}
                setShow={() => setShowFilterInput(!showFilterInput)}
                onFilter={filterTransactionsPage}
                children={[
                    <>
                        <TextInput 
                            label="PRODUCT NAME"
                            name="product_name"
                            value={filterByDetails?.product_name}
                            placeHolder="Enter a product name here"
                            onInputChange={handleFilterByDetailsChange}
                        />
                        
                        <MyNumberInput 
                            label="PRODUCT PRICE"
                            name="product_price"
                            value={filterByDetails?.product_price}
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <MyNumberInput 
                            label="PRODUCT QUANTITY"
                            name="product_quantity"
                            value={filterByDetails?.product_quantity}
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <TextInput 
                            label="ORDER ID"
                            name="order_id"
                            value={filterByDetails?.order_id}
                            placeHolder="Enter a product id here"
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <MyNumberInput 
                            label="ORDER AMOUNT"
                            name="order_amount"
                            value={filterByDetails?.order_amount}
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <MyNumberInput 
                            label="SERVICE FEE"
                            name="service_fee"
                            value={filterByDetails?.service_fee}
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <MyNumberInput 
                            label="TOTAL AMOUNT"
                            name="total_amount"
                            value={filterByDetails?.total_amount}
                            onInputChange={handleFilterByDetailsChange}
                        />

                        <MyDropDownInput 
                            label="ORDER STATUS"
                            onSelect={handleFilterByDetailsChange}
                            name="order_status"
                            options={[
                                {name: 'completed'}, 
                                {name: 'delivered'}, 
                                {name: 'pending'}, 
                                {name: 'cancelled'}, 
                                {name: 'rejected'}]}
                            value='completed'
                        />

                        <MyDropDownInput 
                            label="PAYMENT STATUS"
                            onSelect={handleFilterByDetailsChange}
                            name="payment_status"
                            options={[
                                {name: 'paid'}, 
                                {name: 'not paid'}, 
                                {name: 'unconfirmed'}, 
                                {name: 'dispute'}
                            ]}
                            value='paid'
                        />
                    </>
                ]}
            />
        }
        <div className="flex flex-row w-[90%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[21%]">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Transactions</h2>
                <div className="flex flex-row text-sm font-semibold !text-gray-400 px-4 py-5 bg-white">
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Completed
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Pending
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Cancelled
                    </a>
                    <a href="#0" className="hover:!text-orange-500 mr-3">
                        Rejected
                    </a>
                </div>

                <div className="flex flex-row py-3 px-4 relative bg-white">
                    <div className="w-[full]">
                        <FilterAndSearchGroup 
                            searchInputPlaceHolder="Search name, price, category"
                            onSearch={searchProducts}
                            onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        />
                    </div>
                    <div className="w-fit absolute right-2">
                        <ButtonGhost 
                            action="Download CSV"
                            onClick={() => {}}
                        />
                    </div>
                </div>
                {/* PRODUCTS TABLE */}
                <div className="flex flex-col pb-8 bg-white text-gray-700">
                    <MyTable
                        headings={['product_name', 'quantity', 'price', 'total_price', 'status']}
                        content={transactionsPages[currentTransactionsPage]} 
                        onRowButtonClick={() => router.push('transactions/show')}
                    />
                    <div className='flex flex-row justify-end text-sm w-[80%] mx-auto'>
                        <button disabled={currentTransactionsPage === 0} onClick={() => setCurrentTransactionsPage(currentTransactionsPage - 1)} className='mr-3 cursor-pointer'>Previous</button>
                        <button disabled={currentTransactionsPage === transactionsPages.length - 1} onClick={() => setCurrentTransactionsPage(currentTransactionsPage + 1)} className='mr-3 cursor-pointer'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default index
import ButtonFull from "../../../Components/buttons/ButtonFull"
import FilterAndSearchGroup from "../../../Components/inputs/FilterAndSearchGroup"
import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel"
import { useState } from 'react'
import { HiOutlineInformationCircle } from "react-icons/hi"
import ButtonGhost from "../../../Components/buttons/ButtonGhost"
import AddPaymentMethodModal from "../../../Components/modals/settings/AddPaymentMethodModal"

const index = () => {
    const [showFilterInput, setShowFilterInput] = useState<boolean>(false);
    const [showAddPaymentMethodModal, setShowAddPaymentMethodModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        {
            showAddPaymentMethodModal && <AddPaymentMethodModal
                show={showAddPaymentMethodModal}
                setShow={() => setShowAddPaymentMethodModal(!showAddPaymentMethodModal)}
            />
        }

        <VendorSideNavPanel />
        <div className="flex flex-col w-[80%] absolute right-2 left-[20%]">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">Settings</h2>
            <div className="flex flex-row text-sm font-semibold !text-gray-400 px-4 py-5 bg-white">
                <a href="#0" className="hover:!text-orange-500 mr-3">
                    Payment
                </a>
                <a href="#0" className="hover:!text-orange-500 mr-3">
                    Order
                </a>
                <a href="#0" className="hover:!text-orange-500 mr-3">
                    Danger
                </a>
            </div>

            {/* PAYMENT SECTION */}
            <div>
                <div className="flex flex-row py-3 px-4 relative bg-white">
                    <div className="w-[full]">
                        <FilterAndSearchGroup 
                            searchInputPlaceHolder="Search name, type"
                            onSearch={() => {}}
                            onFilterButtonClick={() => setShowFilterInput(!showFilterInput)}
                        />
                    </div>
                    <div className="w-fit absolute right-2 hidden md:flex">
                        <ButtonFull 
                            action="Add Payment Method"
                            onClick={() => setShowAddPaymentMethodModal(!showAddPaymentMethodModal)}
                        />
                    </div>
                </div>
                <div className="flex flex-col pb-8 bg-white text-gray-700 px-4">
                    <div className="flex flex-col w-[40%] border border-gray-100 px-2 py-3 relative mb-4 min-h-[6rem]">
                        <div className="flex flex-row">
                            <span className="font-semibold text-slate-600 mr-3">United Bank For Africa</span>
                            <p className="text-orange-500 text-base">fiat</p>
                        </div>
                        <p className="text-gray-800 text-sm">Ale Moreno</p>
                        <p className="text-gray-600 text-sm">00998876765</p>
                    </div>
                    <div className="flex flex-col w-[40%] border border-gray-100 px-2 py-3 relative mb-4 min-h-[6rem]">
                        <div className="flex flex-row">
                            <span className="font-semibold text-slate-600 mr-3">Binance Smart Chain (Bep 20)</span>
                            <p className="text-orange-500 text-base">crypto</p>
                        </div>
                        <p className="text-gray-600 text-sm">009are98876rtye5654564s5343q73qa4765</p>
                    </div>
                </div>

                <div className="flex md:hidden w-[60%] mx-auto mb-8">
                    <ButtonFull
                        action="Add Payment Method"
                        onClick={() => {}} 
                    />
                </div>
            </div>

            {/* ORDER SECTION */}
            <div className="flex flex-col bg-white px-4 py-6 mt-4">
                <div className="flex flex-row">
                    <div className="flex flex-row">
                        <p className="text-gray-800 mr-1">Enable order accumulator</p>
                        <HiOutlineInformationCircle className="text-lg text-gray-600 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* DANGER SECTION */}
            <div className="flex flex-col bg-white px-4 py-6 mt-4">
                <div className="flex flex-row">
                    <div className="flex flex-row mr-[5%] align-middle">
                        <p className="mr-1 text-red-500">Delete Vendor Account</p>
                        <HiOutlineInformationCircle className="text-lg text-red-600 cursor-pointer" />
                    </div>
                    <div className="w-fit">
                        <ButtonGhost
                            action="Close Account"
                            onClick={() => {}} 
                        />
                    </div>
                </div>
            </div>
        </div>

       
    </div>
  )
}

export default index
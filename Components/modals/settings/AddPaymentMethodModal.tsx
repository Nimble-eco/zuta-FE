import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdOutlineClose } from 'react-icons/md';
import { ToastContainer } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import MyDropDownInput from "../../inputs/MyDropDownInput";
import MySearchInput from "../../inputs/MySearchInput";
import TextInput from "../../inputs/TextInput";
import MyNumberInput from "../../inputs/MyNumberInput";
import ButtonFull from "../../buttons/ButtonFull";

interface IAddPaymentMethodModalProps {
  show: boolean;
  setShow: () => void;
}

const AddPaymentMethodModal = ({show, setShow}: IAddPaymentMethodModalProps) => {
  const [loading, setLoading] = useState(false);
  const [newPaymentInfo, setNewPaymentInfo] = useState({
    type: 'Fiat',
    account_id: '' || 0,
    account_name: '',
    institute_name: ''
  });

  const handleChange = (e: any) => {
    setNewPaymentInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="!rounded-md ">
      <ToastContainer />
      <Modal show={show} onHide={setShow} backdrop="static" dialogClassName='modal-90w'>
        <Modal.Body className='md:!min-w-[40vw] !w-[40vw]'>
          <div className='flex flex-col min-h-[50vh] relative'>
            <MdOutlineClose className='text-3xl cursor-pointer absolute top-3 right-3' onClick={setShow} />
            <form className="flex flex-col w-[90%] md:w-[60%] mx-auto my-10">
              <h3 className="text-center mb-3 font-bold text-base text-gray-600">New Payment Method</h3>
              <div className="flex flex-col mb-3">
                <MyDropDownInput 
                  label="Type"
                  name="type"
                  options={[{ name: 'Fiat'}, {name: 'Crypto'}]}
                  value={newPaymentInfo?.type}
                  onSelect={handleChange}
                />
              </div>

              {
                newPaymentInfo?.type.toLowerCase() === 'fiat' ? (
                  <div className="flex flex-col">
                    <div className='flex flex-col'>
                      <label className="text-base text-gray-700 my-2">
                        Bank Name
                      </label>
                      <MySearchInput
                        name="institute_name"
                        value={newPaymentInfo.institute_name}
                        searchInputPlaceHolder="Search bank name"
                        onSearch={() => {}}
                      />
                    </div>
                    <div className='flex flex-col mt-3'>
                      <TextInput
                        label="Account Name"
                        name="account_name"
                        value={newPaymentInfo?.account_name}
                        placeHolder="Account name"
                        onInputChange={handleChange}
                      />
                    </div>
                    <div className='flex flex-col mt-3'>
                      <MyNumberInput
                        label="Account Number"
                        name="account_id"
                        value={newPaymentInfo?.account_id}
                        onInputChange={handleChange}
                      />
                    </div>

                    <div className="w-fit mx-auto">
                      <ButtonFull 
                        action="Save"
                        loading={loading}
                        onClick={() => {}}
                      />
                    </div>
                  </div>
                ) : newPaymentInfo.type.toLowerCase() === 'crypto' ? (
                  <div>
                    <p>Coming soon</p>
                  </div>
                ) : null
              }
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AddPaymentMethodModal
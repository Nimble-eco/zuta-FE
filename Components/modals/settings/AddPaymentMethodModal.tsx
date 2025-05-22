import { useState } from "react";
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MdOutlineClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import MyDropDownInput from "../../inputs/MyDropDownInput";
import TextInput from "../../inputs/ColumnTextInput";
import MyNumberInput from "../../inputs/MyNumberInput";
import ButtonFull from "../../buttons/ButtonFull";
import ngBanks from 'ng-banks';
import { storeBankDetailsAction } from "../../../requests/wallet/wallet.request";

const banks = ngBanks.getBanks();
interface IAddPaymentMethodModalProps {
  show: boolean;
  setShow: () => void;
  redirect?: () => void;
}

const AddPaymentMethodModal = ({show, setShow, redirect}: IAddPaymentMethodModalProps) => {
  const [loading, setLoading] = useState(false);
  const [newPaymentInfo, setNewPaymentInfo] = useState({
    account_type: 'Fiat',
    account_number: '' || 0,
    account_name: '',
    bank_name: ''
  });

  const handleChange = (e: any) => {
    setNewPaymentInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const storeBankDetails = async () => {
    setLoading(true);

    await storeBankDetailsAction(newPaymentInfo)
    .then(response => {
      toast.success('Bank details saved successfully')
      setShow();
      if(redirect) redirect();
    })
    .catch(error => {
      console.log({error});
      toast.error(error.response?.data?.message || 'Error! Try again later');
    })
    .finally(() => setLoading(false));
  }

  return (
    <div className="!rounded-md ">
      <Modal show={show} onHide={setShow} backdrop="static" dialogClassName='lg:modal-90w'>
        <Modal.Body className='lg:!min-w-[40vw] lg:!w-[40vw]'>
          <div className='flex flex-col min-h-[50vh] relative'>
            <MdOutlineClose className='text-3xl cursor-pointer absolute top-3 right-3' onClick={setShow} />
            <form className="flex flex-col w-[90%] md:w-[60%] mx-auto my-10">
              <h3 className="text-center mb-3 font-bold text-base text-gray-600">New Payment Method</h3>
              <div className="flex flex-col mb-3">
                <MyDropDownInput 
                  label="Type"
                  name="account_type"
                  options={[{ name: 'Fiat'}]}
                  value={newPaymentInfo?.account_type}
                  onSelect={handleChange}
                />
              </div>

              {
                newPaymentInfo?.account_type.toLowerCase() === 'fiat' ? (
                  <div className="flex flex-col">
                    <div className='flex flex-col'>
                      <MyDropDownInput
                        label="Bank Name"
                        name="bank_name"
                        value={newPaymentInfo.bank_name}
                        options={banks!.map((obj: any) => ({ name: obj.name }))}
                        onSelect={handleChange}
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
                        name="account_number"
                        value={newPaymentInfo?.account_number}
                        onInputChange={handleChange}
                      />
                    </div>

                    <div className="w-fit mx-auto h-12">
                      <ButtonFull 
                        action="Save"
                        loading={loading}
                        onClick={storeBankDetails}
                      />
                    </div>
                  </div>
                ) : newPaymentInfo.account_type.toLowerCase() === 'crypto' ? (
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
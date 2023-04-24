import VendorSideNavPanel from '../../../Components/vendor/layout/VendorSideNavPanel'
import FeedbackForm from '../../../Components/vendor/feedback/FeedbackForm'
import ButtonFull from '../../../Components/buttons/ButtonFull'

const index = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex flex-row w-[90%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <div className="flex flex-col w-[80%] absolute right-0 left-[21%]">
                <h2 className="text-2xl font-bold text-slate-700 mb-4">Feedback</h2>
                <div className="flex flex-col py-3 px-4 relative bg-white min-h-[50vh] h-fit">
                    <FeedbackForm />
                    <div className='w-fit absolute right-2 bottom-2'>
                        <ButtonFull 
                            action='Send'
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
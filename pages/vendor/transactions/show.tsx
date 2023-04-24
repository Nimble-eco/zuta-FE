import VendorSideNavPanel from "../../../Components/vendor/layout/VendorSideNavPanel";
import SingleTransaction from "../../../Components/vendor/transaction/SingleTransaction";
import { reviewsDummyData } from "../../../data/reviews";
import { singleTransactionDummyData } from "../../../data/transaction";

interface IShowTransactionPageProps {
    transaction: any;
    reviews: any[];
}

const show = ({transaction, reviews}: IShowTransactionPageProps) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col overflow-auto">
        <div className="flex flex-row w-[95%] mx-auto mt-8 relative mb-10">
            <VendorSideNavPanel />
            <SingleTransaction transaction={transaction} reviews={reviews}/>
        </div>
    </div>
  )
}

export default show

export async function getServerSideProps(context: any) {
    const transaction = singleTransactionDummyData;
    const reviews = reviewsDummyData;
    return {
        props: {
            transaction,
            reviews
        }
    }
}
import { toast } from "react-toastify";
import { checkVendorSubscriptionStatusAction, subscribeToVendorAction, unsubscribeFromVendorAction } from "../../requests/user/user.request";
import { processImgUrl } from "../../Utils/helper";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ButtonGhost from "../buttons/ButtonGhost";

interface IExploreVendorCardProps {
    id: string;
    image?: string;
    name: string;
    username?: string;
    redirect?: any;
}

const ExploreVendorCard = ({id, image, name, username, redirect}: IExploreVendorCardProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const checkSubStatus = async () => {
        await checkVendorSubscriptionStatusAction(id)
        .then(response => {
            if(response.status === 200) setSubscribed(true);
        })
    }

    useEffect(()=>{
        let mounted = true;

        if(mounted) checkSubStatus();

        return () => {
            mounted = false;
        }

    }, []);

    const subscribeToVendor = async () => {
        setLoading(true);
        await subscribeToVendorAction(id)
        .then(response => {
            if(response.status === 200) {
                setSubscribed(true);
                toast.success('Subscription successfull');
                if(redirect) setTimeout(()=>router.push(redirect), 2000);
            }
        })
        .catch((error)=>{
            console.log({error});
            toast.error('Unable to subscribe to store');
        })
        .finally(()=>setLoading(false))
    }

    const unsubscribeFromVendor = async () => {
        setLoading(true);
        await unsubscribeFromVendorAction(id)
        .then(response => {
            if(response.status === 200) {
                setSubscribed(false);
                toast.success('Unsubscribed successfully');
                if(redirect) setTimeout(()=>router.push(redirect), 2000);
            }
        })
        .catch((error)=>{
            console.log({error});
            toast.error('Unable to subscribe to store');
        })
        .finally(()=>setLoading(false))
    }

  return (
    <div className="flex flex-row justify-between items-center border-b border-gray-300 py-2 px-4 w-full">
        <div className="flex flex-row items-center gap-4">
            <img src={image ? processImgUrl(image) : 'https://via.placeholder.com/100'} alt={name} className="h-8 w-8 rounded-full object-cover object-center" />
            <div className="flex flex-col">
                <h5 className="font-bold text-slate-800">{name}</h5>
                <p className="text-xs font-medium text-gray-600">{username}</p>
            </div>
        </div>  
        <div className="h-10">
            <ButtonGhost 
                onClick={subscribed ? unsubscribeFromVendor : subscribeToVendor}
                action={subscribed ? "Unsubscribe" :"Subscribe"}
                loading={loading}
            />
        </div>
    </div>
  )
}

export default ExploreVendorCard
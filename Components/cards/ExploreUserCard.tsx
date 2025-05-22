import { useRouter } from "next/router";
import { processImgUrl } from "../../Utils/helper";
import { useEffect, useState } from "react";
import { checkUserFollowingStatusAction, followUserAction, unfollowUserAction } from "../../requests/user/user.request";
import { toast } from "react-toastify";
import ButtonGhost from "../buttons/ButtonGhost";

interface IExploreUserCardProps {
    id: string;
    image?: string;
    name: string;
    redirect?: string;
}

const ExploreUserCard = ({id, image, name, redirect}: IExploreUserCardProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [following, setFollowing] = useState(false);

    const checkSubStatus = async () => {
        await checkUserFollowingStatusAction(id)
        .then(response => {
            if(response.status === 200) setFollowing(true);
        })
    }

    useEffect(()=>{
        let mounted = true;

        if(mounted) checkSubStatus();

        return () => {
            mounted = false;
        }

    }, []);

    const followUser = async () => {
        setLoading(true);
        await followUserAction(id)
        .then(response => {
            if(response.status === 200) {
                setFollowing(true);
                toast.success('Following user successfull');
                if(redirect) setTimeout(()=>router.push(redirect), 2000);
            }
        })
        .catch((error)=>{
            console.log({error});
            toast.error('Unable to subscribe to store');
        })
        .finally(()=>setLoading(false))
    }

    const unFollowUser = async () => {
        setLoading(true);
        await unfollowUserAction(id)
        .then(response => {
            if(response.status === 200) {
                setFollowing(false);
                toast.success('Unfollowed user');
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
    <div className="flex flex-row justify-between items-center border-b border-gray-300 py-2 px-4">
        <div className="flex flex-row items-center gap-4">
            <img src={image ? processImgUrl(image) : 'https://via.placeholder.com/100'} alt={name} className="h-8 w-8 rounded-full object-cover object-center" />
            <div className="flex flex-col">
                <h5 className="font-bold text-slate-800">{name}</h5>
            </div>
        </div>  
        <div className='h-10'>
            <ButtonGhost 
                action={following ? 'Unfollow' : 'Follow'}
                onClick={following ? unFollowUser : followUser} 
                loading={loading}
            />
        </div>
    </div>
  )
}

export default ExploreUserCard
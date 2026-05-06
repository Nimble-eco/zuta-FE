import { useState } from "react";
import axiosInstance from "../../../Utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2, Search } from "lucide-react";
import ExploreUserCard from "../../../Components/cards/ExploreUserCard";
import Cookies from "js-cookie";

interface IUsersResultTabProps {
    search_string: string;
    users: any[];
}

const UsersResultTab = ({search_string, users}: IUsersResultTabProps) => {
    const [usersData, setUsersData] = useState(users);
    const [page, setPage] = useState(1);
    const [moreUsers, setMoreUsers] = useState(users?.length > 24 ? true : false);
    let userCookie: any = {};

    if(typeof window !== 'undefined'){
        userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')!) : null; 
    }

    const loadMoreData = async () => {
        await axiosInstance.post('/api/public/user/search/index', {
            search: search_string,
            page: page + 1
        },{ headers: { Authorization: userCookie?.access_token } })
        .then((response) => {
            console.log({response})
            if(response.data.data?.data) {
                setUsersData(usersData.concat(response.data.data?.data));
                setPage(page + 1);
            }
            else setMoreUsers(false);
        })
    };

  return (
    <div className="w-full">
        <InfiniteScroll
            dataLength={usersData?.length}
            next={loadMoreData}
            hasMore={moreUsers}
            loader={<Loader2 className="h-8 w-8 mx-auto mt-8 text-orange-500 animate-spin" />}
            className="flex flex-col gap-6 w-full"
        >
            {
                usersData?.length > 0 ? usersData?.map(user => (
                    <ExploreUserCard
                        key={user?.id}
                        id={user.id}
                        name={`${user.first_name} ${user?.last_name}`}
                        image={user?.picture}
                        is_following={user?.is_following}
                    />
                )) : 
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                        <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="text-center">
                        <p className="text-base font-semibold text-slate-600">
                            No results for &ldquo;{search_string}&rdquo;
                        </p>
                        <p className="text-sm text-slate-400 mt-1">
                            Try a different keyword or check your spelling
                        </p>
                    </div>
                </div>
            }
        </InfiniteScroll>
    </div>
  )
}

export default UsersResultTab
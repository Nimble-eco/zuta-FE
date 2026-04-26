import { useState } from "react";
import axiosInstance from "../../../Utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2, Search } from "lucide-react";
import ExploreUserCard from "../../../Components/cards/ExploreUserCard";

interface IUsersResultTabProps {
    search_string: string;
    users: any[];
}

const UsersResultTab = ({search_string, users}: IUsersResultTabProps) => {
    const [usersData, setUsersData] = useState(users);
    const [page, setPage] = useState(1);
    const [moreUsers, setMoreUsers] = useState(users?.length > 0 ? true : false);

    const loadMoreData = async () => {
        await axiosInstance.post('/api/public/users/search/index', {
            search: search_string,
            pagination: page + 1
        })
        .then((response) => {
            if(response.data.data) {
                setUsersData(usersData.concat(response.data.data));
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
                        name={user.name}
                        image={user?.picture}
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
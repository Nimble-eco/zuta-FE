import { useState } from "react";
import axiosInstance from "../../../Utils/axiosConfig";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "lucide-react";
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
                <div className="flex flex-col justify-center px-4 gap-4">
                    <h3 className="text-2xl font-bold text-slate-600">
                        No results for "#{search_string}"
                    </h3>
                    <p className="text-xs font-medium text-gray-500">
                        Try searching for something else
                    </p>
                </div>
            }
        </InfiniteScroll>
    </div>
  )
}

export default UsersResultTab
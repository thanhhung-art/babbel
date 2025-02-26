import { createRef, useMemo } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import Avatar from "../Avatar";
import useSearchUsers from "../../hooks/friends/useSearchUsers";
import { useQuery } from "@tanstack/react-query";
import { friends } from "../../utils/contants";
import { getFriends } from "../../lib/react_query/queries/user/friend";

const SearchUsers = () => {
  const inputValue = createRef<HTMLInputElement>();
  const searchContainer = createRef<HTMLDivElement>();
  const dataResultsContainer = createRef<HTMLDivElement>();

  const { searchUsersMutation, handleSendSearch } = useSearchUsers({
    inputValue,
  });

  const friendsQuery = useQuery({ queryKey: [friends], queryFn: getFriends });

  const friendsArray = useMemo(
    () =>
      friendsQuery.data ? friendsQuery.data.map((friend) => friend.id) : [],
    [friendsQuery.data]
  );

  const handleOpenSearch = () => {
    dataResultsContainer.current?.classList.remove("hidden");
    dataResultsContainer.current?.classList.add("block");
  };

  const handleSendFriendRequest = (userId: string) => {
    console.log(userId);
  };

  const isRenderResults =
    !!searchUsersMutation.data && !!searchUsersMutation.data.length;

  return (
    <div>
      <div
        className="border rounded-lg bg-white flex items-center relative search-container"
        ref={searchContainer}
      >
        <div className="flex-1 pl-3">
          <label htmlFor="search-user" className="border w-full">
            <input
              id="search-user"
              type="text"
              placeholder="Search users..."
              className="w-full outline-none"
              onFocus={handleOpenSearch}
              ref={inputValue}
              onChange={handleSendSearch}
            />
          </label>
        </div>
        <span className="cursor-pointer border p-2" onClick={handleOpenSearch}>
          <SearchIcon width={24} height={24} />
        </span>
        {isRenderResults && (
          <div
            className="absolute top-full w-full z-30 block"
            ref={dataResultsContainer}
          >
            <ul className="flex flex-col gap-4 bg-white border rounded-lg p-4">
              {searchUsersMutation.data.map((user, index) => {
                const isFriend = friendsArray.includes(user.id);
                return (
                  <li key={index} className="flex items-center gap-4">
                    <Avatar width="w-12" height="h-12" name={user.name} />
                    <h4 className="flex-1">{user.name}</h4>
                    <div>
                      <button
                        className={`border rounded-full ${
                          isFriend ? "bg-gray-300" : "bg-blue-500"
                        } px-4 py-2 text-white hover:bg-blue-600 active:bg-blue-700`}
                        disabled={isFriend}
                        onClick={() => handleSendFriendRequest(user.id)}
                      >
                        {isFriend ? "friend" : "add friend"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;

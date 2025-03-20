import { createRef, useMemo } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import Avatar from "../Avatar";
import useSearchUsers from "../../hooks/friends/useSearchUsers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { friends } from "../../utils/contants";
import { getFriends } from "../../lib/react_query/queries/user/friend";
import { sendFriendRequestQuery } from "../../lib/react_query/queries/user/friendRequest";

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

  const sendFriendRequestMutation = useMutation({
    mutationFn: (userId: string) => {
      return sendFriendRequestQuery(userId);
    },
    onSuccess: () => {},
  });

  const handleOpenSearch = () => {
    dataResultsContainer.current?.classList.remove("hidden");
    dataResultsContainer.current?.classList.add("block");
  };

  const handleSendFriendRequest = (userId: string) => {
    sendFriendRequestMutation.mutate(userId);
  };

  const isRenderResults =
    !!searchUsersMutation.data && !!searchUsersMutation.data.length;

  return (
    <div className="relative search-container">
      <div
        className="flex items-center gap-2 px-3 py-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
        ref={searchContainer}
      >
        <SearchIcon
          width={20}
          height={20}
          className="text-gray-400 flex-shrink-0"
        />
        <input
          id="search-user"
          type="text"
          placeholder="Search users..."
          className="w-full outline-none text-sm text-gray-700 placeholder:text-gray-400"
          onFocus={handleOpenSearch}
          ref={inputValue}
          onChange={handleSendSearch}
        />
      </div>

      {/* Search Results Dropdown */}
      {isRenderResults && (
        <div
          ref={dataResultsContainer}
          className="absolute top-full left-0 right-0 mt-2 z-30 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
        >
          <div className="max-h-[350px] overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {searchUsersMutation.data.map((user, index) => {
                const isFriend = friendsArray.includes(user.id);
                return (
                  <li
                    key={index}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Avatar width="w-10" height="h-10" name={user.name} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {user.name}
                      </h4>
                    </div>
                    <button
                      className={`
                          px-4 py-1.5 rounded-full text-sm font-medium
                          transition-all duration-200
                          ${
                            isFriend
                              ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                          }
                        `}
                      disabled={isFriend}
                      onClick={() => handleSendFriendRequest(user.id)}
                    >
                      {isFriend ? "Friends" : "Add Friend"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchUsers;

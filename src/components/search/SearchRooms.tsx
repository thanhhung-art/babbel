import { createRef, useMemo } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import Avatar from "../Avatar";
import useSearchRooms from "../../hooks/room/useSearchRooms";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRoomsJoinedQuery,
  requestJoinRoomQuery,
} from "../../lib/react_query/queries/room/room";
import { chatting, roomsJoined } from "../../utils/contants";

const SearchRooms = () => {
  const inputValue = createRef<HTMLInputElement>();
  const searchContainer = createRef<HTMLDivElement>();
  const dataResultsContainer = createRef<HTMLDivElement>();
  const queryClient = useQueryClient();

  const { searchRoomsMutation, handleSendSearch } = useSearchRooms({
    inputValue,
  });

  const roomsJoinedData = useQuery({
    queryKey: [roomsJoined],
    queryFn: getRoomsJoinedQuery,
  });

  const roomJoinedArray = useMemo(
    () => (roomsJoinedData.data ? roomsJoinedData.data.map((r) => r.id) : []),
    [roomsJoinedData.data]
  );

  const sendJoinRoomRequestMutation = useMutation({
    mutationFn: (roomId: string) => {
      return requestJoinRoomQuery(roomId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roomsJoined] });
      queryClient.invalidateQueries({ queryKey: [chatting] });
    },
    onError: (error) => {
      console.error("Error joining room:", error);
    },
  });

  const handleOpenSearch = () => {
    dataResultsContainer.current?.classList.remove("hidden");
    dataResultsContainer.current?.classList.add("block");
  };

  const handleSendJoinRoom = (roomId: string) => {
    sendJoinRoomRequestMutation.mutate(roomId);
  };

  const isRenderResults =
    !!searchRoomsMutation.data && !!searchRoomsMutation.data.length;

  return (
    <div className="">
      <div className="relative search-container">
        <div
          className="flex items-center gap-2 px-3 py-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all duration-200"
          ref={searchContainer}
        >
          <SearchIcon width={20} height={20} className="text-gray-400" />
          <input
            id="search-room"
            type="text"
            placeholder="Search rooms..."
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
            <div className="max-h-[300px] overflow-y-auto">
              <ul className="divide-y divide-gray-100">
                {searchRoomsMutation.data.map((room) => {
                  const isJoined = roomJoinedArray.includes(room.id);

                  return (
                    <li
                      key={room.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Avatar width="w-10" height="h-10" name={room.name} />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {room.name}
                        </h4>
                        {/* {room.description && (
                          <p className="text-sm text-gray-500 truncate">
                            {room.description}
                          </p>
                        )} */}
                      </div>
                      <button
                        className={`
                          px-4 py-1.5 rounded-full text-sm font-medium 
                          transition-all duration-200
                          ${
                            isJoined
                              ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700"
                          }
                        `}
                        disabled={isJoined}
                        onClick={() => handleSendJoinRoom(room.id)}
                      >
                        {isJoined ? "Joined" : "Join"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchRooms;

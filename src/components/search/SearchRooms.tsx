import { createRef, useMemo } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import Avatar from "../Avatar";
import useSearchRooms from "../../hooks/room/useSearchRooms";
import { useQuery } from "@tanstack/react-query";
import { getRoomsJoinedQuery } from "../../lib/react_query/queries/room/room";
import { roomsJoined } from "../../utils/contants";

const SearchRooms = () => {
  const inputValue = createRef<HTMLInputElement>();
  const searchContainer = createRef<HTMLDivElement>();
  const dataResultsContainer = createRef<HTMLDivElement>();

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

  const handleOpenSearch = () => {
    dataResultsContainer.current?.classList.remove("hidden");
    dataResultsContainer.current?.classList.add("block");
  };

  const handleSendJoinRoom = (roomId: string) => {
    console.log("Join room:", roomId);
  };

  const isRenderResults =
    !!searchRoomsMutation.data && !!searchRoomsMutation.data.length;

  return (
    <div>
      <div
        className="border rounded-lg bg-white flex items-center relative search-container"
        ref={searchContainer}
      >
        <div className="flex-1 pl-3">
          <label htmlFor="search-room" className="border w-full">
            <input
              id="search-room"
              type="text"
              placeholder="Search rooms..."
              className="w-full outline-none"
              onFocus={handleOpenSearch}
              ref={inputValue}
              onChange={handleSendSearch}
            />
          </label>
        </div>
        <span className="cursor-pointer border p-2">
          <SearchIcon width={24} height={24} />
        </span>
        {isRenderResults && (
          <div
            className="absolute top-full w-full z-30 block"
            ref={dataResultsContainer}
          >
            <ul className="flex flex-col gap-4 bg-white border rounded-lg p-4">
              {searchRoomsMutation.data.map((room) => {
                const isJoined = roomJoinedArray.includes(room.id);

                return (
                  <li key={room.id} className="flex items-center gap-4">
                    <Avatar width="w-12" height="h-12" name={room.name} />
                    <h4 className="flex-1 font-semibold">{room.name}</h4>
                    <div>
                      <button
                        className={`border rounded-full ${
                          isJoined ? "bg-gray-300" : "bg-blue-500"
                        } px-4 py-2 text-white hover:bg-blue-600 active:bg-blue-700`}
                        disabled={isJoined}
                        onClick={() => handleSendJoinRoom(room.id)}
                      >
                        {isJoined ? "Joined" : "Join"}
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

export default SearchRooms;

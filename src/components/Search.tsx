import { ChangeEvent, createRef, useRef } from "react";
import SearchIcon from "../assets/icons/SearchIcon";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  requestJoinRoomQuery,
  search,
  verifyUser,
} from "../lib/react_query/queries";
import { User } from "../types/user";
import Avatar from "./Avatar";
import PlusIcon from "../assets/icons/PlusIcon";
import { sendFriendRequestQuery } from "../lib/react_query/queries";
import XIcon from "../assets/icons/XIcon";

const Search = () => {
  const inputValue = useRef<HTMLInputElement>(null);
  const debounceSearchRef = useRef<number | null>(null);
  const selectRef = createRef<HTMLSelectElement>();
  const searchType = useRef<"user" | "room">("user");

  const userData = useQuery({ queryKey: ["user"], queryFn: verifyUser });

  const searchMutation = useMutation<User[]>({
    mutationFn: async () => {
      return await search(
        inputValue.current?.value || "",
        selectRef.current?.value as "user" | "room"
      );
    },
  });

  const sendFriendRequest = useMutation({
    mutationFn: async ({
      userId,
      friendId,
    }: {
      userId: string;
      friendId: string;
    }) => {
      return await sendFriendRequestQuery(userId, friendId);
    },
  });

  const sendJoinRoom = useMutation({
    mutationFn: async (roomId: string) => {
      return await requestJoinRoomQuery(roomId);
    },
  });

  const handleSendSearch = async () => {
    if (inputValue.current && inputValue.current.value.length > 0) {
      clearTimeout(debounceSearchRef.current || 0);

      debounceSearchRef.current = setTimeout(() => {
        searchMutation.mutate();
      }, 500);
    } else {
      console.log("Search input is empty");
    }
  };

  const handleSendFriendRequest = (userId: string, friendId: string) => {
    sendFriendRequest.mutate({ userId, friendId });
  };

  const handleSendJoinRoom = (roomId: string) => {
    sendJoinRoom.mutate(roomId);
  };

  const handleResetSearch = () => {
    inputValue.current!.value = "";
    searchMutation.reset();
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    searchType.current = e.target.value as "user" | "room";
    searchMutation.reset();
  };

  const renderSearchData = !!inputValue.current?.value;

  return (
    <div className="z-50">
      <div className="flex items-center rounded-2xl shadow px-4 py-2 relative z-50">
        <label htmlFor="searchInput"></label>
        <input
          ref={inputValue}
          type="text"
          id="searchInput"
          title="Search"
          placeholder="Search"
          className="w-full outline-none rounded-e-2xl"
          onChange={() => handleSendSearch()}
        />
        {renderSearchData && (
          <div className="mr-2 cursor-pointer" onClick={handleResetSearch}>
            <XIcon />
          </div>
        )}
        <div className="cursor-pointer" onClick={handleSendSearch}>
          <SearchIcon />
        </div>
        <select
          title="search-select"
          className="ml-3 rounded-lg outline-none bg-white"
          ref={selectRef}
          onChange={handleSelectChange}
        >
          <option value="user">user</option>
          <option value="room">room</option>
        </select>

        {searchType.current === "user" && renderSearchData && (
          <div className="absolute top-full left-0 bg-white w-full border p-4 rounded-lg">
            {searchMutation.data &&
              searchMutation.data.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <Avatar width={"w-12"} height={"h-12"} name={item.name} />
                  <div className="flex items-center justify-between w-full">
                    <h3 className="">{item.name}</h3>
                    <div
                      className="cursor-pointer border rounded-full"
                      onClick={() =>
                        handleSendFriendRequest(
                          userData.data?.id || "",
                          item.id
                        )
                      }
                    >
                      <PlusIcon w={16} h={16} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {searchType.current === "room" && renderSearchData && (
          <div className="absolute top-full left-0 bg-white w-full border p-4 rounded-lg">
            {searchMutation.data &&
              searchMutation.data.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <Avatar width={"w-12"} height={"h-12"} name={item.name} />
                  <h3 className="">{item.name}</h3>
                  <div
                    className="cursor-pointer border rounded-full ml-auto "
                    onClick={() => handleSendJoinRoom(item.id)}
                  >
                    <PlusIcon w={16} h={16} />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

import { ChangeEvent, createRef, useRef, useState } from "react";
import SearchIcon from "../assets/icons/SearchIcon";
import { useMutation, useQuery } from "@tanstack/react-query";
import { User } from "../types/user";
import Avatar from "./Avatar";
import PlusIcon from "../assets/icons/PlusIcon";
import XIcon from "../assets/icons/XIcon";
import SuccessIcon from "../assets/icons/SuccessIcon";
import { user } from "../utils/contants";
import { verifyUser } from "../lib/react_query/queries/user/user";
import { requestJoinRoomQuery } from "../lib/react_query/queries/room/room";
import { sendFriendRequestQuery } from "../lib/react_query/queries/user/friendRequest";
import { search } from "../lib/react_query/queries/utils";

interface IProps {
  type: "user" | "room";
}

const Search = ({ type }: IProps) => {
  const inputValue = useRef<HTMLInputElement>(null);
  const debounceSearchRef = useRef<NodeJS.Timeout | null>(null);
  const selectRef = createRef<HTMLSelectElement>();
  const searchType = useRef<string>("user");
  const [sendJoinRequestRoom, setSendJoinRequestRoom] = useState<string[]>([]);
  const [sendFriendRequestUser, setSendFriendRequestUser] = useState<string[]>(
    []
  );

  const userData = useQuery({ queryKey: [user], queryFn: verifyUser });

  const searchMutation = useMutation<User[]>({
    mutationFn: async () => {
      return await search(
        inputValue.current?.value || "",
        type,
        selectRef.current?.value as
          | "joined"
          | "joined"
          | "unfriend"
          | "unjoined"
      );
    },
  });

  const sendFriendRequest = useMutation({
    mutationFn: ({ friendId }: { friendId: string }) => {
      return sendFriendRequestQuery(friendId);
    },
    onSuccess: (res) => {
      setSendFriendRequestUser((prev) => [...prev, res.friendId]);
    },
  });

  const sendJoinRoom = useMutation({
    mutationFn: async (roomId: string) => {
      return await requestJoinRoomQuery(roomId);
    },
    onSuccess: (res) => {
      setSendJoinRequestRoom((prev) => [...prev, res.roomId]);
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

  const handleSendFriendRequest = (friendId: string) => {
    if (userData.data?.id !== friendId && friendId) {
      sendFriendRequest.mutate({ friendId });
    }
  };

  const handleSendJoinRoom = (roomId: string) => {
    if (sendJoinRequestRoom.includes(roomId)) {
      return;
    }
    sendJoinRoom.mutate(roomId);
  };

  const handleResetSearch = () => {
    inputValue.current!.value = "";
    searchMutation.reset();
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    searchType.current = e.target.value as
      | "friend"
      | "joined"
      | "unfriend"
      | "unjoined";
    searchMutation.reset();
  };

  const renderSearchData = !!inputValue.current?.value;

  return (
    <div className="z-50">
      <div className="flex items-center rounded border border-slate-300 px-4 py-2 relative z-50">
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
          title="searchIcon-select"
          className="ml-3 rounded-lg outline-none bg-white"
          ref={selectRef}
          onChange={handleSelectChange}
        >
          <option value={type === "user" ? "friend" : "joined"}>
            {type === "user" ? "friend" : "joined"}
          </option>
          <option value={type === "user" ? "unfriend" : "unjoined"}>
            {type === "user" ? "unfriend" : "unjoined"}
          </option>
        </select>

        {type === "user" && renderSearchData && (
          <div className="absolute top-full left-0 bg-white w-full border p-4 rounded-lg">
            <ul className="flex flex-col gap-2">
              {searchMutation.data && searchMutation.data.length > 0 ? (
                searchMutation.data.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <Avatar width={"w-12"} height={"h-12"} name={item.name} />
                    <div className="flex items-center justify-between w-full">
                      <h3 className="">{item.name}</h3>
                      {userData.data?.id !== item.id ? (
                        <div
                          className="cursor-pointer border rounded-full"
                          onClick={() => handleSendFriendRequest(item.id)}
                        >
                          {sendFriendRequestUser.includes(item.id) ? (
                            <SuccessIcon w={16} h={16} />
                          ) : (
                            <PlusIcon width={16} height={16} />
                          )}
                        </div>
                      ) : (
                        <p>you</p>
                      )}
                    </div>
                  </li>
                ))
              ) : (
                <li className="">
                  <p className="text-center">No results</p>
                </li>
              )}
            </ul>
          </div>
        )}

        {type === "room" && renderSearchData && (
          <div className="absolute top-full left-0 bg-white w-full border p-4 rounded-lg">
            {searchMutation.data && searchMutation.data.length > 0 ? (
              searchMutation.data.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <Avatar width={"w-12"} height={"h-12"} name={item.name} />
                  <h3 className="">{item.name}</h3>
                  <div
                    className="cursor-pointer border rounded-full ml-auto "
                    onClick={() => handleSendJoinRoom(item.id)}
                  >
                    {sendJoinRequestRoom.includes(item.id) ? (
                      <SuccessIcon w={16} h={16} />
                    ) : (
                      <div className="bg-blue-500 rounded-full p-1">
                        <PlusIcon width={16} height={16} />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No results</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;

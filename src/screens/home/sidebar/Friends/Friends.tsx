import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { friends } from "../../../../utils/contants";
import {
  blockUserQuery,
  getConversationQuery,
  getFriends,
  unfriendQuery,
} from "../../../../lib/react_query/queries";
import Search from "../../../../components/Search";
import useAppStore from "../../../../lib/zustand/store";
import Friend from "./Friend";
import { useRef, useState } from "react";
import XIcon from "../../../../assets/icons/XIcon";

const Friends = () => {
  const queryClient = useQueryClient();
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const setCurrentConversationId = useAppStore(
    (state) => state.setCurrentConversationId
  );
  const [dialogType, setDialogType] = useState<"block" | "unfriend" | "">("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const tempFriendId = useRef<string>("");

  const { data } = useQuery({ queryKey: [friends], queryFn: getFriends });

  const getConversation = useMutation({
    mutationFn: (friendId: string) => getConversationQuery(friendId),
    onSuccess: (data) => {
      setCurrentFriendId(data.participants[0].id);
      setCurrentConversationId(data.id);
      setCurrentRoomId("");
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: (friendId: string) => {
      return blockUserQuery(friendId);
    },
    onSuccess: () => {
      tempFriendId.current = "";
      queryClient.invalidateQueries({ queryKey: [friends] });
    },
  });

  const unfriendUserMutation = useMutation({
    mutationFn: (friendId: string) => {
      return unfriendQuery(friendId);
    },
    onSuccess: () => {
      tempFriendId.current = "";
      queryClient.invalidateQueries({ queryKey: [friends] });
    },
  });

  const handleGetConversation = (friendId: string) => {
    getConversation.mutate(friendId);
  };

  const handleBlockUser = (friendId: string) => {
    setDialogType("block");
    dialogRef.current?.showModal();
    tempFriendId.current = friendId;
  };

  const handleUnfriendUser = (friendId: string) => {
    setDialogType("unfriend");
    dialogRef.current?.showModal();
    tempFriendId.current = friendId;
  };

  const handleCloseDialog = () => {
    dialogRef.current?.close();
  };

  const handleProcessDialog = () => {
    if (dialogType === "block") {
      blockUserMutation.mutate(tempFriendId.current);
    } else if (dialogType === "unfriend") {
      unfriendUserMutation.mutate(tempFriendId.current);
    }
    handleCloseDialog();
  };

  return (
    <div className="pt-1">
      <Search type="user" />
      {data && data.length === 0 ? (
        <h4 className="text-center mt-4">No friends</h4>
      ) : (
        <ul className="mt-3">
          {data &&
            data.map((friend) => (
              <Friend
                friend={friend}
                handleGetConversation={handleGetConversation}
                handleBlockUser={handleBlockUser}
                handleUnfriendUser={handleUnfriendUser}
              />
            ))}
        </ul>
      )}
      <dialog ref={dialogRef}>
        <div className="p-4">
          <div className="flex justify-end">
            <div className="border cursor-pointer" onClick={handleCloseDialog}>
              <XIcon w={18} h={18} />
            </div>
          </div>
          <h3 className="text-lg font-semibold mt-2">{`Are you want to ${dialogType} this user?`}</h3>
          <div className="flex justify-between mt-4">
            <button
              className="border px-4 py-1 text-sm rounded-full text-white bg-blue-500 active:bg-blue-600"
              onClick={handleCloseDialog}
            >
              No
            </button>
            <button
              className="border px-4 py-1 text-sm rounded-full text-white bg-red-500 active:bg-red-600"
              onClick={handleProcessDialog}
            >
              Yes
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Friends;

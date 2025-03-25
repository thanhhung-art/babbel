import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatting, friends } from "../../../../utils/contants";
import useAppStore from "../../../../lib/zustand/store";
import Friend from "./Friend";
import { useRef, useState } from "react";
import XIcon from "../../../../assets/icons/XIcon";
import {
  getFriends,
  getConversationQuery,
  blockUserQuery,
  unfriendQuery,
} from "../../../../lib/react_query/queries/user/friend";
import SearchUsers from "../../../../components/search/SearchUsers";

const Friends = () => {
  const queryClient = useQueryClient();
  const toggleOpenSideBar = useAppStore((state) => state.toggleOpenSidebar);
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
      queryClient.invalidateQueries({ queryKey: [chatting] });
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

    toggleOpenSideBar();
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
    <div className="pt-1 px-2 h-full max-h-[calc(100vh-60px)] overflow-hidden md:max-h-full">
      <SearchUsers />

      {/* Friends List */}
      {data && data.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-8 text-gray-500">
          <p className="text-lg font-medium">No friends yet</p>
          <p className="text-sm mt-1">
            Use the search bar above to find friends
          </p>
        </div>
      ) : (
        <ul className="mt-4 space-y-2 max-h-[calc(100vh-200px)] h-full overflow-y-auto pr-1 md:max-h-full">
          {data &&
            data.map((friend) => (
              <Friend
                key={friend.id}
                friend={friend}
                handleGetConversation={handleGetConversation}
                handleBlockUser={handleBlockUser}
                handleUnfriendUser={handleUnfriendUser}
              />
            ))}
        </ul>
      )}

      {/* Confirmation Dialog */}
      <dialog
        ref={dialogRef}
        className="rounded-lg shadow-xl p-0 backdrop:bg-gray-900/50"
      >
        <div className="w-[320px] bg-white rounded-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Confirm {dialogType}
            </h3>
            <button
              onClick={handleCloseDialog}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <XIcon width={20} height={20} className="text-gray-500" />
            </button>
          </div>

          <div className="p-4">
            <p className="text-gray-600">
              Are you sure you want to {dialogType} this user? This action
              cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                onClick={handleCloseDialog}
              >
                Cancel
              </button>
              <button
                className={`
                  px-4 py-2 text-sm font-medium text-white rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  transition-colors duration-200
                  ${
                    dialogType === "block"
                      ? "bg-red-500 hover:bg-red-600 focus:ring-red-500"
                      : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                  }
                `}
                onClick={handleProcessDialog}
              >
                {dialogType === "block" ? "Block User" : "Unfriend"}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Friends;

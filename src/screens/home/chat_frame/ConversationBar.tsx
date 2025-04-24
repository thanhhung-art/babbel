import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "../../../components/Avatar";
import {
  chatting,
  conversation,
  conversationMessages,
} from "../../../utils/contants";
import useAppStore from "../../../lib/zustand/store";
import { createRef, useMemo } from "react";
import DotMenuIcon from "../../../assets/icons/DotMenuIcon";
import {
  getConversationQuery,
  blockUserQuery,
  unfriendQuery,
} from "../../../lib/react_query/queries/user/friend";
import BlockIcon from "../../../assets/icons/BlockIcon";
import DeleteIcon from "../../../assets/icons/DeleteIcon";

const ConversationBar = () => {
  const queryClient = useQueryClient();
  const currentFriendId = useAppStore((state) => state.currentFriendId);
  const currentConversationId = useAppStore(
    (state) => state.currentConversationId
  );
  const currRoomId = useAppStore((state) => state.currentRoomId);
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);
  const setCurrConversationId = useAppStore(
    (state) => state.setCurrentConversationId
  );
  const onlineFriends = useAppStore((state) => state.onlineFriends);
  const optionsContainer = createRef<HTMLDivElement>();

  const { data, isLoading } = useQuery({
    queryKey: [conversation, currentFriendId],
    queryFn: () => getConversationQuery(currentFriendId),
    enabled: !!currentFriendId,
  });

  const name = useMemo(() => data?.participants[0].name, [data]);

  const isFriendOnline = useMemo(() => {
    return onlineFriends.some((friendId) => friendId === currentFriendId);
  }, [onlineFriends, currentFriendId]);

  const blockUserMutation = useMutation({
    mutationFn: () => {
      return blockUserQuery(currentFriendId);
    },
  });

  const unFriendUserMutation = useMutation({
    mutationFn: () => {
      return unfriendQuery(currentFriendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [conversationMessages, currentConversationId || currRoomId],
      });
      queryClient.invalidateQueries({ queryKey: [chatting] });
      setCurrConversationId("");
      setCurrentFriendId("");
    },
  });

  const handleToggleOptions = () => {
    optionsContainer.current?.classList.toggle("hidden");
  };

  const handleBlockUser = () => {
    blockUserMutation.mutate();
  };

  const handleUnfriendUser = () => {
    unFriendUserMutation.mutate();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-2">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar width="w-12" height="h-12" name={name} />
          <div className="absolute bottom-0 right-0">
            {isFriendOnline && (
              <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
        </div>
        <h3 className="flex-1">{name}</h3>

        <div className="relative z-20 option-container">
          <div className="cursor-pointer" onClick={handleToggleOptions}>
            <DotMenuIcon />
          </div>

          {/* Options container */}

          <div
            ref={optionsContainer}
            className="absolute top-full right-full bg-white p-2 shadow rounded hidden"
          >
            <h3 className="font-bold">Actions</h3>
            <ul className="w-[150px] mt-[7px]">
              <li
                className="text-sm cursor-pointer hover:bg-slate-100 p-[5px] rounded font-normal"
                onClick={handleBlockUser}
              >
                <div className="flex gap-2 items-center">
                  <BlockIcon width={24} height={24} />{" "}
                  <p className="pt-1">block</p>
                </div>
              </li>
              <li
                className="cursor-pointer hover:bg-slate-100 p-[5px] rounded text-red-500"
                onClick={handleUnfriendUser}
              >
                <div className="flex gap-2 items-center text-sm">
                  <DeleteIcon width={24} height={24} />{" "}
                  <p className="pt-1">unfriend</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationBar;

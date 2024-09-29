import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "../../../components/Avatar";
import {
  chatting,
  conversation,
  conversationMessages,
} from "../../../utils/contants";
import useAppStore from "../../../lib/zustand/store";
import { createRef, useEffect, useMemo, useState } from "react";
import DotMenuIcon from "../../../assets/icons/DotMenuIcon";
import Options from "../../../components/conversation/Options";
import {
  getConversationQuery,
  blockUserQuery,
  unfriendQuery,
} from "../../../lib/react_query/queries/user/friend";

const ConversationBar = () => {
  const queryClient = useQueryClient();
  const [openOptions, setOpenOptions] = useState(false);
  const currentFriendId = useAppStore((state) => state.currentFriendId);
  const currentConversationId = useAppStore(
    (state) => state.currentConversationId
  );
  const currRoomId = useAppStore((state) => state.currentRoomId);
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);
  const setCurrConversationId = useAppStore(
    (state) => state.setCurrentConversationId
  );
  const optionsContainer = createRef<HTMLDivElement>();

  const { data, isLoading } = useQuery({
    queryKey: [conversation, currentFriendId],
    queryFn: () => getConversationQuery(currentFriendId),
    enabled: !!currentFriendId,
  });

  const name = useMemo(() => data?.participants[0].name, [data]);

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
    setOpenOptions(!openOptions);
  };

  const handleBlockUser = () => {
    blockUserMutation.mutate();
  };

  const handleUnfriendUser = () => {
    unFriendUserMutation.mutate();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsContainer.current &&
        !optionsContainer.current.contains(e.target as Node)
      ) {
        setOpenOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsContainer]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white p-2">
      <div className="flex items-center gap-4">
        <Avatar width="w-12" height="h-12" name={name} />
        <h3 className="flex-1">{name}</h3>

        <div
          className="relative z-40"
          ref={optionsContainer}
          onClick={handleToggleOptions}
        >
          <div className="cursor-pointer">
            <DotMenuIcon />
          </div>
          {openOptions && (
            <Options
              handleBlockUser={handleBlockUser}
              handleUnfriendUser={handleUnfriendUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationBar;

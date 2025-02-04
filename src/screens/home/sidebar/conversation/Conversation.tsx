import { createRef, useEffect, useMemo, useState } from "react";
import useAppStore from "../../../../lib/zustand/store";
import Avatar from "../../../../components/Avatar";
import { socket } from "../../../../SocketContext/socket";
import DotMenuIcon from "../../../../assets/icons/DotMenuIcon";
import DeleteIcon from "../../../../assets/icons/DeleteIcon";
import { useQuery } from "@tanstack/react-query";
import { getConversationInfoQuery } from "../../../../lib/react_query/queries/user/user";
import { getRoomInfoQuery } from "../../../../lib/react_query/queries/room/room";
import { getConversationInfo, getRoomInfo } from "../../../../utils/contants";

interface IProps {
  handleRemoveChatting: (id: string) => void;
  conversationId: string | null;
  roomId: string | null;
}

const Conversation = ({
  handleRemoveChatting,
  conversationId,
  roomId,
}: IProps) => {
  const [isButtonVisible, setIsOptionsVisible] = useState(false);
  const optionsContainer = createRef<HTMLDivElement>();
  const toggleOpenSideBar = useAppStore((state) => state.toggleOpenSidebar);
  const currentFriendId = useAppStore((state) => state.currentFriendId);
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const onlineFriends = useAppStore((state) => state.onlineFriends);
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const setCurrentConversationId = useAppStore(
    (state) => state.setCurrentConversationId
  );

  const conversationData = useQuery({
    queryKey: [getConversationInfo, conversationId],
    queryFn: () => getConversationInfoQuery(conversationId || ""),
    enabled: !!conversationId,
  });

  const roomData = useQuery({
    queryKey: [getRoomInfo, roomId],
    queryFn: () => getRoomInfoQuery(roomId || ""),
    enabled: !!roomId,
  });

  const conversationName = useMemo(() => {
    if (conversationData.data) {
      return conversationData.data.participants[0].name;
    }

    if (roomData.data) {
      return roomData.data.name;
    }
  }, [conversationData.data, roomData.data]);

  const isCurrentConversation = useMemo(() => {
    if (conversationData.data) {
      return currentFriendId === conversationData.data.participants[0].id;
    }

    if (roomData.data) {
      return currentRoomId === roomId;
    }
  }, [
    currentFriendId,
    currentRoomId,
    conversationData.data,
    roomData.data,
    roomId,
  ]);

  const isUserOnline = useMemo(() => {
    if (!conversationData.data) return false;
    return onlineFriends.includes(conversationData.data.participants[0].id);
  }, [conversationData.data, onlineFriends]);

  const handleSetCurrentConversation = () => {
    if (conversationId && conversationData.data) {
      setCurrentFriendId(conversationData.data.participants[0].id);
      setCurrentConversationId(conversationId);
      setCurrentRoomId("");
    }

    if (roomId && roomData.data) {
      setCurrentRoomId(roomId);
      setCurrentFriendId("");
      setCurrentConversationId("");
      socket.emit("join-room", roomId);
    }

    toggleOpenSideBar();
  };

  const handleDotMenuClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOptionsVisible(!isButtonVisible);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsContainer.current &&
        !optionsContainer.current.contains(e.target as Node)
      ) {
        setIsOptionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsContainer]);

  return (
    <div
      className={`p-2 cursor-pointer hover:bg-slate-50 active:bg-slate-200 ${
        isCurrentConversation && "bg-slate-100"
      }`}
    >
      <div className="flex w-full items-center">
        <div
          className="flex gap-4 items-center w-full"
          onClick={handleSetCurrentConversation}
        >
          <div className="relative">
            <Avatar width="w-16" height="h-16" name={conversationName} />
            {isUserOnline && (
              <span className="absolute bottom-2 right-0 w-3 h-3 bg-green-600 rounded-full border-2 border-white"></span>
            )}
          </div>
          <h3>{conversationName}</h3>
        </div>
        <div
          className="relative"
          onClick={handleDotMenuClick}
          ref={optionsContainer}
        >
          <DotMenuIcon />
          {isButtonVisible && (
            <div className="absolute right-full top-0 rounded shadow bg-white">
              <div className="flex flex-col p-2">
                <div
                  className="flex items-center hover:bg-slate-100"
                  onClick={() => handleRemoveChatting(conversationId || "")}
                >
                  <span className="px-4 py-2 text-red-500 text-[14px]">
                    remove
                  </span>
                  <DeleteIcon width={24} height={24} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversation;

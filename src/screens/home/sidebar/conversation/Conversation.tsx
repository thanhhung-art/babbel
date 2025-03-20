import { createRef, useMemo } from "react";
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
  const popupContainerRef = createRef<HTMLDivElement>();

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

  const handleOpenPopup = () => {
    if (popupContainerRef.current) {
      popupContainerRef.current.classList.toggle("hidden");
    }
  };

  return (
    <div
      className={`
        group relative p-3 rounded-lg cursor-pointer
        transition-all duration-200 
        hover:bg-gray-50 active:bg-gray-100
        ${isCurrentConversation ? "bg-blue-50" : ""}
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex-1 flex items-center gap-3 min-w-0"
          onClick={handleSetCurrentConversation}
        >
          <div className="relative flex-shrink-0">
            <Avatar width="w-12" height="h-12" name={conversationName} />
            {isUserOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-900 truncate">
              {conversationName}
            </h3>
            {conversationData.data && (
              <p className="text-sm text-gray-500 truncate">
                {isUserOnline ? "Online" : "Offline"}
              </p>
            )}
          </div>
        </div>

        <div className="relative flex-shrink-0 option-container" ref={optionsContainer}>
          <div
            className={`
              p-1.5 rounded-full
              transition-colors duration-200`}
            onClick={handleOpenPopup}
          >
            <DotMenuIcon w={20} h={20} />
          </div>

          <div
            ref={popupContainerRef}
            className="absolute right-0 top-full mt-1 z-20 hidden option"
          >
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40">
              <button
                onClick={() => handleRemoveChatting(conversationId || "")}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
              >
                <DeleteIcon width={18} height={18} className="text-red-600" />
                <span>Remove chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;

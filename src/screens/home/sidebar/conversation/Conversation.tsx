import { createRef, useEffect, useMemo, useState } from "react";
import { IChatting } from "../../../../types/conversation";
import useAppStore from "../../../../lib/zustand/store";
import Avatar from "../../../../components/Avatar";
import { socket } from "../../../../SocketContext/socket";
import DotMenuIcon from "../../../../assets/icons/DotMenuIcon";
import DeleteIcon from "../../../../assets/icons/DeleteIcon";

interface IProps {
  conversation: IChatting;
  handleRemoveChatting: (id: string) => void;
}

const Conversation = ({ conversation, handleRemoveChatting }: IProps) => {
  const [isButtonVisible, setIsOptionsVisible] = useState(false);
  const optionsContainer = createRef<HTMLDivElement>();

  const currentFriendId = useAppStore((state) => state.currentFriendId);
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const onlineFriends = useAppStore((state) => state.onlineFriends);
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const setCurrentConversationId = useAppStore(
    (state) => state.setCurrentConversationId
  );

  const conversationName = useMemo(() => {
    return (
      conversation.conversation?.participants[0].name ||
      conversation.room?.name ||
      "No name"
    );
  }, [conversation]);

  const isCurrentConversation = useMemo(() => {
    if (conversation.conversation) {
      return currentFriendId === conversation.conversation.participants[0].id;
    }

    if (conversation.room) {
      return currentRoomId === conversation.room.id;
    }
  }, [conversation, currentFriendId, currentRoomId]);

  const isUserOnline = useMemo(() => {
    if (!conversation.conversation) return false;
    return onlineFriends.includes(conversation.conversation.participants[0].id);
  }, [onlineFriends, conversation]);

  const handleSetCurrentConversation = () => {
    if (conversation.conversation) {
      setCurrentFriendId(conversation.conversation.participants[0].id);
      setCurrentConversationId(conversation.conversation.id);
      setCurrentRoomId("");
    }

    if (conversation.room) {
      setCurrentRoomId(conversation.room.id);
      setCurrentFriendId("");
      setCurrentConversationId("");
      socket.emit("join-room", conversation.room.id);
    }
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
        <div className="relative" onClick={handleDotMenuClick}>
          <DotMenuIcon />
          {isButtonVisible && (
            <div
              className="absolute right-full top-0 rounded shadow bg-white"
              ref={optionsContainer}
            >
              <div className="flex flex-col p-2">
                <div
                  className="flex items-center hover:bg-slate-100"
                  onClick={() => handleRemoveChatting(conversation.id)}
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

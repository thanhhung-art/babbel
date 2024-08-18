import { useMemo } from "react";
import { IChatting } from "../../../types/conversation";
import useAppStore from "../../../lib/zustand/store";
import Avatar from "../../../components/Avatar";
import { socket } from "../../../SocketContext/socket";

interface IProps {
  conversation: IChatting;
}

const Conversation = ({ conversation }: IProps) => {
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

  return (
    <div
      className={`p-2 cursor-pointer hover:bg-slate-50 active:bg-slate-200 ${
        isCurrentConversation && "bg-slate-100"
      }`}
      onClick={handleSetCurrentConversation}
    >
      <div className="flex gap-4 items-center">
        <div className="relative">
          <Avatar width="w-16" height="h-16" name={conversationName} />
          {isUserOnline && (
            <span className="absolute bottom-2 right-0 w-3 h-3 bg-green-600 rounded-full border-2 border-white"></span>
          )}
        </div>
        <h3>{conversationName}</h3>
      </div>
    </div>
  );
};

export default Conversation;

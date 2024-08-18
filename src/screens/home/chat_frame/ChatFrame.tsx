import useAppStore from "../../../lib/zustand/store";
import MessageInput from "./MessageInput";
import Messages from "./Messages";

const ChatFrame = () => {
  const currConversationId = useAppStore(
    (state) => state.currentConversationId
  );
  const currRoomId = useAppStore((state) => state.currentRoomId);

  return (
    <main className="h-full bg-slate-100 relative">
      {currConversationId || currRoomId ? (
        <>
          <Messages />
          <MessageInput />
        </>
      ) : (
        <p className="text-center pt-16">No conversation selected</p>
      )}
    </main>
  );
};

export default ChatFrame;

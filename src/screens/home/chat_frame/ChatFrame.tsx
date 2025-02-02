import { lazy, Suspense } from "react";
import useAppStore from "../../../lib/zustand/store";
const ConversationBar = lazy(() => import("./ConversationBar"));
const MessageInput = lazy(() => import("./MessageInput"));
const Messages = lazy(() => import("./Messages/Messages"));
const RoomBar = lazy(() => import("./RoomBar"));

const ChatFrame = () => {
  const currConversationId = useAppStore(
    (state) => state.currentConversationId
  );
  const currRoomId = useAppStore((state) => state.currentRoomId);

  return (
    <main className="h-full flex flex-col bg-slate-100">
      {currConversationId || currRoomId ? (
        <Suspense>
          {currRoomId && <RoomBar />}
          {currConversationId && <ConversationBar />}
          <div className="flex-grow overflow-auto pt-4 px-4">
            <Messages />
          </div>
          <MessageInput />
        </Suspense>
      ) : (
        <p className="text-center pt-16">No conversation selected</p>
      )}
    </main>
  );
};

export default ChatFrame;

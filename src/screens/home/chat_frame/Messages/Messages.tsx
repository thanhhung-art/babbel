import { useQuery } from "@tanstack/react-query";
import { conversationMessages, user } from "../../../../utils/contants";
import useAppStore from "../../../../lib/zustand/store";
import { createRef, useEffect, useRef, useState } from "react";
import { IMessage } from "../../../../types/message";
import { chatSocket } from "../../../../SocketContext/socket";
import Message from "././Message";
import { verifyUser } from "../../../../lib/react_query/queries/user/user";
import { getConversationMessagesQuery } from "../../../../lib/react_query/queries/user/friend";

const Messages = () => {
  const currentConversationId = useAppStore(
    (state) => state.currentConversationId
  );
  const currentFriendId = useAppStore((state) => state.currentFriendId);
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const anchorRef = createRef<HTMLDivElement>();
  const deleteDialogRef = createRef<HTMLDialogElement>();
  const updateDialogRef = createRef<HTMLDialogElement>();
  const textAreaRef = createRef<HTMLTextAreaElement>();
  const idMessageToDelete = useRef<string>("");
  const idMessageToUpdate = useRef<string>("");
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: [conversationMessages, currentConversationId || currentRoomId],
    queryFn: () =>
      getConversationMessagesQuery(
        currentConversationId ? "user" : "room",
        currentConversationId || currentRoomId
      ),
    enabled: !!currentConversationId || !!currentRoomId,
  });

  const userData = useQuery({ queryKey: [user], queryFn: verifyUser });

  // update message

  const handleOpenUpdateDialog = () => {
    if (textAreaRef.current) {
      textAreaRef.current.defaultValue =
        messages.find((m) => m.id === idMessageToUpdate.current)?.content || "";
    }
    updateDialogRef.current?.showModal();
  };

  const handleCloseUpdateDialog = () => {
    updateDialogRef.current?.close();
  };

  const handleUpdateMessage = () => {
    const index = messages.findIndex((m) => m.id === idMessageToUpdate.current);
    if (index > -1 && textAreaRef.current) {
      messages[index].content = textAreaRef.current.value;
      setMessages([...messages]);
      if (currentConversationId) {
        chatSocket.emit("update-message-in-conversation", {
          messId: messages[index].id,
          value: textAreaRef.current.value,
          friendId: currentFriendId,
          conversationId: currentConversationId,
        });
      } else {
        chatSocket.emit("update-message-in-room", {
          messId: messages[index].id,
          value: textAreaRef.current.value,
          roomId: currentRoomId,
        });
      }
    }
    handleCloseUpdateDialog();
  };

  // delete message

  const handleOpenDeleteDialog = () => {
    deleteDialogRef.current?.showModal();
  };

  const handleCloseDeleteDialog = () => {
    deleteDialogRef.current?.close();
  };

  const handleDeleteMessage = () => {
    const index = messages.findIndex((m) => m.id === idMessageToDelete.current);
    if (index > -1) {
      setMessages((prev) =>
        prev.filter((m) => m.id !== idMessageToDelete.current)
      );
      if (currentConversationId) {
        chatSocket.emit("delete-message-in-conversation", {
          messId: idMessageToDelete.current,
          friendId: currentFriendId,
        });
      } else {
        chatSocket.emit("delete-message-in-room", {
          messId: idMessageToDelete.current,
          roomId: currentRoomId,
        });
      }
    }
    handleCloseDeleteDialog();
  };

  const handleScrollIntoView = () => {
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  useEffect(() => {
    if (anchorRef.current) {
      anchorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, anchorRef]);

  useEffect(() => {
    chatSocket.on("new-message-from-friend", (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    chatSocket.on("update-message-in-conversation", (message: IMessage) => {
      if (currentConversationId === message.conversationId) {
        const index = messages.findIndex((m) => m.id === message.id);
        if (index > -1) {
          messages[index] = message;
          setMessages([...messages]);
        }
        return;
      }
    });

    chatSocket.on(
      "delete-message-in-conversation",
      (messageId: string, conversationId: string) => {
        if (currentConversationId === conversationId)
          setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
    );

    chatSocket.on("new-message-to-room", (message: IMessage) => {
      if (currentRoomId === message.roomId)
        setMessages((prev) => [...prev, message]);
    });

    chatSocket.on("update-message-in-room", (message: IMessage) => {
      if (currentRoomId === message.roomId) {
        const index = messages.findIndex((m) => m.id === message.id);
        if (index > -1) {
          messages[index] = message;
          setMessages([...messages]);
        }
      }
    });

    chatSocket.on("delete-message-in-room", (messageId: string, roomId: string) => {
      if (currentRoomId === roomId)
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    return () => {
      chatSocket.off("new-message-from-friend");
      chatSocket.off("update-message-in-conversation");
      chatSocket.off("delete-message-in-conversation");
      chatSocket.off("update-message-in-room");
      chatSocket.off("delete-message-in-room");
      chatSocket.off("new-message-to-room");
    };
  }, [messages, currentConversationId, currentRoomId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        updateDialogRef.current &&
        !updateDialogRef.current.contains(e.target as Node)
      ) {
        handleCloseUpdateDialog();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-4 w-full px-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        {messages.map((message) => {
          const isUser = userData.data?.id === message.userId;
          return (
            <Message
              key={message.id}
              message={message}
              isUser={isUser}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
              handleOpenUpdateDialog={handleOpenUpdateDialog}
              idMessageToDelete={idMessageToDelete}
              idMessageToUpdate={idMessageToUpdate}
              username={message.user?.name}
              handleScrollIntoView={handleScrollIntoView}
            />
          );
        })}
        <div ref={anchorRef}></div>
      </div>

      {/* Delete Message Dialog */}
      <dialog
        ref={deleteDialogRef}
        className="rounded-lg shadow-lg backdrop:bg-gray-900/50"
      >
        <div className="w-[320px] p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delete Message
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this message? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                         rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-blue-500 transition-colors duration-200"
              onClick={handleCloseDeleteDialog}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg 
                         hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-red-500 transition-colors duration-200"
              onClick={handleDeleteMessage}
            >
              Delete
            </button>
          </div>
        </div>
      </dialog>

      {/* Update Message Dialog */}
      <dialog
        ref={updateDialogRef}
        className="rounded-lg shadow-lg backdrop:bg-gray-900/50"
      >
        <div className="w-[400px] p-6 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Edit Message
          </h3>
          <textarea
            ref={textAreaRef}
            className="w-full h-32 p-3 text-gray-700 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     resize-none transition-all duration-200"
            placeholder="Type your message..."
          ></textarea>
          <div className="flex justify-end gap-3 mt-4">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                         rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-blue-500 transition-colors duration-200"
              onClick={handleCloseUpdateDialog}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg 
                         hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                         focus:ring-blue-500 transition-colors duration-200"
              onClick={handleUpdateMessage}
            >
              Save Changes
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Messages;

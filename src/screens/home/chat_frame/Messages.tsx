import { useQuery } from "@tanstack/react-query";
import { conversationMessages, user } from "../../../utils/contants";
import {
  getConversationMessagesQuery,
  verifyUser,
} from "../../../lib/react_query/queries";
import useAppStore from "../../../lib/zustand/store";
import { createRef, useEffect, useRef, useState } from "react";
import { IMessage } from "../../../types/message";
import { socket } from "../../../SocketContext/socket";
import Message from "./Message";

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
        socket.emit("update-message-in-conversation", {
          messId: messages[index].id,
          value: textAreaRef.current.value,
          friendId: currentFriendId,
          conversationId: currentConversationId,
        });
      } else {
        socket.emit("update-message-in-room", {
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
        socket.emit("delete-message-in-conversation", {
          messId: idMessageToDelete.current,
          friendId: currentFriendId,
        });
      } else {
        socket.emit("delete-message-in-room", {
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
    socket.on("new-message-from-friend", (message: IMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("update-message-in-conversation", (message: IMessage) => {
      if (currentConversationId === message.conversationId) {
        const index = messages.findIndex((m) => m.id === message.id);
        if (index > -1) {
          messages[index] = message;
          setMessages([...messages]);
        }
        return;
      }
    });

    socket.on(
      "delete-message-in-conversation",
      (messageId: string, conversationId: string) => {
        if (currentConversationId === conversationId)
          setMessages((prev) => prev.filter((m) => m.id !== messageId));
      }
    );

    socket.on("new-message-to-room", (message: IMessage) => {
      if (currentRoomId === message.roomId)
        setMessages((prev) => [...prev, message]);
    });

    socket.on("update-message-in-room", (message: IMessage) => {
      if (currentRoomId === message.roomId) {
        const index = messages.findIndex((m) => m.id === message.id);
        if (index > -1) {
          messages[index] = message;
          setMessages([...messages]);
        }
      }
    });

    socket.on("delete-message-in-room", (messageId: string, roomId: string) => {
      if (currentRoomId === roomId)
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
    });

    return () => {
      socket.off("new-message-from-friend");
      socket.off("update-message-in-conversation");
      socket.off("delete-message-in-conversation");
      socket.off("update-message-in-room");
      socket.off("delete-message-in-room");
      socket.off("new-message-to-room");
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col gap-4 h-full overflow-auto border pt-4 px-4 pb-16">
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
      <dialog ref={deleteDialogRef} className="p-4 shadow rounded-lg">
        <p>Are you want to delete the message?</p>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 text-sm shadow bg-red-500 text-white rounded active:bg-red-700"
            onClick={handleDeleteMessage}
          >
            delete
          </button>
          <button
            className="px-4 py-2 text-sm shadow bg-blue-500 text-white rounded active:bg-blue-700"
            onClick={handleCloseDeleteDialog}
          >
            close
          </button>
        </div>
      </dialog>

      <dialog ref={updateDialogRef} className="p-4 shadow rounded-lg">
        <textarea
          ref={textAreaRef}
          className="text-black outline-none border w-full p-2"
        ></textarea>
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 text-sm shadow bg-red-500 text-white rounded active:bg-red-700"
            onClick={handleUpdateMessage}
          >
            update
          </button>
          <button
            className="px-4 py-2 text-sm shadow bg-blue-500 text-white rounded active:bg-blue-700"
            onClick={handleCloseUpdateDialog}
          >
            close
          </button>
        </div>
      </dialog>
    </>
  );
};

export default Messages;

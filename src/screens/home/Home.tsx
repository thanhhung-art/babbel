import { useEffect } from "react";
import { socket } from "../../SocketContext/socket";
import Sidebar from "./sidebar/Sidebar";
import ChatFrame from "./chat_frame/ChatFrame";
import Navbar from "./Navbar";
import { user } from "../../utils/contants";
import { useQuery } from "@tanstack/react-query";
import useAppStore from "../../lib/zustand/store";
import { verifyUser } from "../../lib/react_query/queries/user/user";
import useHandleClickOutside from "../../hooks/utils/useHandleClickOutside";

const Home = () => {
  const setOnlineFriends = useAppStore((state) => state.setOnlineFriends);
  const onlineFriends = useAppStore((state) => state.onlineFriends);
  const { data } = useQuery({ queryKey: [user], queryFn: verifyUser });

  useEffect(() => {
    if (data?.id) {
      socket.io.opts.query = { userId: data.id };
      socket.connect();

      socket.on("online-friends", (onlineFriends: string[]) => {
        setOnlineFriends([...onlineFriends]);
      });

      socket.on("online", (userId: string) => {
        if (onlineFriends.includes(userId)) return;
        setOnlineFriends([...onlineFriends, userId]);
      });

      socket.on("offline", (userId: string) => {
        setOnlineFriends(onlineFriends.filter((id) => id !== userId));
      });
    }

    return () => {
      socket.off("online-friends");
      socket.off("online");
      socket.off("offline");
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);

  useEffect(() => {
    const dialogs = document.querySelectorAll("dialog");

    const handleClickOutside = (e: MouseEvent) => {
      const dialog = e.currentTarget as HTMLDialogElement;
      const dialogContainer = dialog.querySelector(".dialog-container");
      if (dialogContainer && !dialogContainer.contains(e.target as Node)) {
        dialog.close();
      }
    };

    const addListenerToDialog = (dialog: HTMLDialogElement) => {
      dialog.addEventListener("click", handleClickOutside);
    };

    const removeListenerFromDialog = (dialog: HTMLDialogElement) => {
      dialog.removeEventListener("click", handleClickOutside);
    };

    dialogs.forEach(addListenerToDialog);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLDialogElement) {
            addListenerToDialog(node);
          }
        });
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLDialogElement) {
            removeListenerFromDialog(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      dialogs.forEach(removeListenerFromDialog);
    };
  });

  useHandleClickOutside();

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow relative overflow-hidden">
        <article
          className="absolute overflow-hidden -left-[100vw] w-full h-full z-30 transition-all duration-300 md:static md:w-1/4 md:h-auto"
          ref={useAppStore((state) => state.sideBarContainer)}
        >
          <Sidebar />
        </article>
        <div className="w-full md:w-3/4">
          <ChatFrame />
        </div>
      </div>
    </div>
  );
};

export default Home;

import { useEffect } from "react";
import { socket } from "../../SocketContext/socket";
import Sidebar from "./sidebar/Sidebar";
import ChatFrame from "./chat_frame/ChatFrame";
import Navbar from "./Navbar";
import SidebarRight from "./sidebarRight/sidebarRight";
import { user } from "../../utils/contants";
import { useQuery } from "@tanstack/react-query";
import useAppStore from "../../lib/zustand/store";
import { verifyUser } from "../../lib/react_query/queries/user/user";

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

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-grow relative overflow-hidden">
        <Sidebar />
        <div className="w-3/4">
          <ChatFrame />
        </div>
        <SidebarRight />
      </div>
    </div>
  );
};

export default Home;

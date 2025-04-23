import { useEffect } from "react";
import useAppStore from "../../lib/zustand/store";
import { chatSocket, onlineSocket } from "../../SocketContext/socket";
import { useQuery } from "@tanstack/react-query";
import { user } from "../../utils/contants";
import { verifyUser } from "../../lib/react_query/queries/user/user";

function useConnectSocketIO() {
  const setOnlineFriends = useAppStore((state) => state.setOnlineFriends);
  const onlineFriends = useAppStore((state) => state.onlineFriends);
  const { data } = useQuery({ queryKey: [user], queryFn: verifyUser });

  useEffect(() => {
    if (data?.id) {
      chatSocket.io.opts.query = { userId: data.id };
      onlineSocket.io.opts.query = { userId: data.id };
      chatSocket.connect();
      onlineSocket.connect();

      onlineSocket.on("online-friends", (onlineFriends: string[]) => {
        setOnlineFriends([...onlineFriends]);
      });

      onlineSocket.on("online", (userId: string) => {
        if (onlineFriends.includes(userId)) return;
        setOnlineFriends([...onlineFriends, userId]);
      });

      onlineSocket.on("offline", (userId: string) => {
        setOnlineFriends(onlineFriends.filter((id) => id !== userId));
      });
    }

    return () => {
      onlineSocket.off("online-friends");
      onlineSocket.off("online");
      onlineSocket.off("offline");
      onlineSocket.disconnect();
      chatSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.id]);
}

export default useConnectSocketIO;

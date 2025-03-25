import { useEffect } from "react";
import useAppStore from "../../lib/zustand/store";
import { socket } from "../../SocketContext/socket";
import { useQuery } from "@tanstack/react-query";
import { user } from "../../utils/contants";
import { verifyUser } from "../../lib/react_query/queries/user/user";

function useConnectSocketIO() {
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
}

export default useConnectSocketIO;

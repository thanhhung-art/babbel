import { useQuery } from "@tanstack/react-query";
import { ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chatSocket } from "../SocketContext/socket";
import { verifyUser } from "../lib/react_query/queries/user/user";
import { user } from "../utils/contants";

const Auth = ({ children }: { children: ReactElement }) => {
  const navigation = useNavigate();

  const { data, isFetched } = useQuery({
    queryKey: [user],
    queryFn: verifyUser,
    staleTime: 4 * 60 * 1000 + 30 * 1000, // 4 minutes 30 seconds
    refetchInterval: 4 * 60 * 1000 + 30 * 1000, // 4 minutes 30 seconds
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (isFetched) {
      if (!data) {
        chatSocket.disconnect();
        navigation("/login");
      }
    }
  }, [data, navigation, isFetched]);

  return <>{children}</>;
};

export default Auth;

import { useQuery } from "@tanstack/react-query";
import { ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../SocketContext/socket";
import { verifyUser } from "../lib/react_query/queries/user/user";

const Auth = ({ children }: { children: ReactElement }) => {
  const navigation = useNavigate();

  const { data, isFetched } = useQuery({
    queryKey: ["user"],
    queryFn: verifyUser,
  });

  useEffect(() => {
    if (isFetched) {
      if (!data) {
        socket.disconnect();
        navigation("/login");
      }
    }
  }, [data, navigation, isFetched]);

  return <>{children}</>;
};

export default Auth;

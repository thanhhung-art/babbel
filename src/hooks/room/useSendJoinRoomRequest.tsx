import { useMutation } from "@tanstack/react-query";
import { requestJoinRoomQuery } from "../../lib/react_query/queries/room/room";
import { useState } from "react";

const useSendJoinRoomRequest = () => {
  const [sendJoinRoomRequest, setSendJoinRoomRequest] = useState<string[]>([]);

  const sendJoinRoomRequestMutation = useMutation({
    mutationFn: async (roomId: string) => {
      return await requestJoinRoomQuery(roomId);
    },
    onSuccess: (res) => {
      setSendJoinRoomRequest((prev) => [...prev, res.roomId]);
    },
  });

  const handleSendJoinRoom = (roomId: string) => {
    if (sendJoinRoomRequest.includes(roomId)) {
      return;
    }
    sendJoinRoomRequestMutation.mutate(roomId);
  };

  return {
    sendJoinRoomRequestMutation,
    sendJoinRoomRequest,
    handleSendJoinRoom,
  };
};

export default useSendJoinRoomRequest;

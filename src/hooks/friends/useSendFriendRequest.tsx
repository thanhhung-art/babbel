import { useMutation, useQuery } from "@tanstack/react-query";
import { user } from "../../utils/contants";
import { verifyUser } from "../../lib/react_query/queries/user/user";
import { sendFriendRequestQuery } from "../../lib/react_query/queries/user/friendRequest";
import { useState } from "react";

export default function useSendFriendRequest() {
  const [sentFriendRequestUserIds, setSentFriendRequestUserIds] = useState<
    string[]
  >([]);

  const userData = useQuery({ queryKey: [user], queryFn: verifyUser });

  const sendFriendRequest = useMutation({
    mutationFn: ({ friendId }: { friendId: string }) => {
      return sendFriendRequestQuery(friendId);
    },
    onSuccess: (res) => {
      setSentFriendRequestUserIds((prev) => [...prev, res.friendId]);
    },
  });

  const handleSendFriendRequest = (friendId: string) => {
    if (userData.data?.id !== friendId && friendId) {
      sendFriendRequest.mutate({ friendId });
    }
  };

  return {
    sentFriendRequestUserIds,
    handleSendFriendRequest,
  };
}

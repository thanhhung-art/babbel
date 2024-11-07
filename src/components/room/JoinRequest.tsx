import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { joinRequest, members } from "../../utils/contants";
import useAppStore from "../../lib/zustand/store";
import Avatar from "../Avatar";
import {
  acceptJoinRequestQuery,
  getJoinRequestQuery,
  rejectJoinRequestQuery,
} from "../../lib/react_query/queries/room/room";

const JoinRequest = () => {
  const currRoomId = useAppStore((state) => state.currentRoomId);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [joinRequest],
    queryFn: () => getJoinRequestQuery(currRoomId),
    enabled: !!currRoomId,
  });

  const acceptJoinRequestMutation = useMutation({
    mutationFn: (userId: string) =>
      acceptJoinRequestQuery({ userId, roomId: currRoomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [joinRequest, members] });
    },
  });

  const rejectJoinRequestMutation = useMutation({
    mutationFn: (userId: string) =>
      rejectJoinRequestQuery({ userId, roomId: currRoomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [joinRequest] });
    },
  });

  const handleAcceptJoinRequest = (userId: string) => {
    acceptJoinRequestMutation.mutate(userId);
  };

  const handleRejectJoinRequest = (userId: string) => {
    rejectJoinRequestMutation.mutate(userId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <p className="p-4 text-center">No join request</p>;
  }

  return (
    <ul className="">
      {data.map((req) => (
        <li key={req.userId} className="flex gap-2 items-center px-4 py-2">
          <Avatar width="w-10" height="h-10" name={req.user.name} />
          <h4 className="flex-1">{req.user.name}</h4>
          <div>
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded-full text-sm active:bg-blue-600 "
              onClick={() => handleAcceptJoinRequest(req.userId)}
            >
              accept
            </button>
            <button
              className="px-2 py-1 bg-red-500 text-white rounded-full text-sm active:bg-red-600 ml-2"
              onClick={() => handleRejectJoinRequest(req.userId)}
            >
              reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default JoinRequest;

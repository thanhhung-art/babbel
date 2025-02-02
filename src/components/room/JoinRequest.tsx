import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { joinRequest, members } from "../../utils/contants";
import useAppStore from "../../lib/zustand/store";
import Avatar from "../Avatar";
import {
  acceptJoinRequestQuery,
  getJoinRequestQuery,
  rejectJoinRequestQuery,
} from "../../lib/react_query/queries/room/room";
import SuccessIcon from "../../assets/icons/SuccessIcon";
import XIcon from "../../assets/icons/XIcon";

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
        <li key={req.userId} className="flex gap-2 items-center pl-4 py-2">
          <Avatar width="w-10" height="h-10" name={req.user.name} />
          <h4 className="flex-1">{req.user.name}</h4>
          <div className="flex gap-2">
            <div
              className="flex justify-center items-center gap-1 px-2 md:px-3 py-1 md:py-2 bg-green-500 text-white rounded-lg md:rounded-full text-sm active:bg-green-600 "
              onClick={() => handleAcceptJoinRequest(req.userId)}
            >
              <SuccessIcon width={20} height={20} fill="#ffffff" />
              <h5 className="hidden md:block font-semibold">accept</h5>
            </div>
            <div
              className="flex justify-center items-center gap-1 px-2 md:px-3 py-1 md:py-2 bg-red-500 text-white rounded-lg md:rounded-full text-sm active:bg-red-600"
              onClick={() => handleRejectJoinRequest(req.userId)}
            >
              <XIcon width={20} height={20} />
              <h5 className="hidden md:block font-semibold">reject</h5>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default JoinRequest;

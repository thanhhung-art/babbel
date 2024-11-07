import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  banUserQuery,
  getRoomMembersQuery,
  kickUserQuery,
} from "../../lib/react_query/queries/room/room";
import { verifyUser } from "../../lib/react_query/queries/user/user";
import { members, user } from "../../utils/contants";
import useAppStore from "../../lib/zustand/store";
import Avatar from "../Avatar";

const Members = () => {
  const currRoomId = useAppStore((state) => state.currentRoomId);
  const queryClient = useQueryClient();

  const userData = useQuery({ queryKey: [user], queryFn: verifyUser });

  const { data, isLoading } = useQuery({
    queryKey: [members],
    queryFn: () => getRoomMembersQuery(currRoomId),
    enabled: !!currRoomId,
  });

  const kickMutation = useMutation({
    mutationFn: (userId: string) =>
      kickUserQuery({ userId, roomId: currRoomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [members] });
    },
  });

  const banMutation = useMutation({
    mutationFn: (userId: string) =>
      banUserQuery({ userId, roomId: currRoomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [members] });
    },
  });

  const handleKickUser = (userId: string) => {
    kickMutation.mutate(userId);
  };

  const handleBanUser = (userId: string) => {
    banMutation.mutate(userId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {data && data.length > 0 && (
        <ul className="pl-4">
          {data.map((member) => (
            <li
              key={member.userId}
              className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50"
            >
              <Avatar width="w-10" height="h-10" name={member.user.name} />
              <h4 className="flex-1">{member.user.name}</h4>
              {userData.data?.id !== member.userId && (
                <div className="flex gap-2">
                  <button
                    className="text-sm bg-blue-500 text-white w-[90px] py-[7px] rounded-full active:bg-blue-700 hover:bg-blue-600"
                    onClick={() => handleBanUser(member.userId)}
                  >
                    banned
                  </button>
                  <button
                    className="text-sm bg-red-500 text-white w-[90px] py-[7px] rounded-full  hover:bg-red-600 active:bg-red-700"
                    onClick={() => handleKickUser(member.userId)}
                  >
                    kick
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Members;

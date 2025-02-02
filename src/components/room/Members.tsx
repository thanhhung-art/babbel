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
import DeleteIcon from "../../assets/icons/DeleteIcon";
import BannedIcon from "../../assets/icons/BannedIcon";

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
              className="flex items-center gap-2 md:px-4 py-2 hover:bg-slate-50"
            >
              <Avatar width="w-10" height="h-10" name={member.user.name} />
              <h4 className="flex-1">{member.user.name}</h4>
              {userData.data?.id !== member.userId && (
                <div className="flex gap-2">
                  <div
                    className="flex justify-center items-center text-sm bg-gray-500 text-white w-[40px] h-[40px] md:w-[90px] md:py-[7px] rounded md:rounded-full  hover:bg-gray-600 active:bg-gray-700 gap-2 cursor-pointer"
                    onClick={() => handleBanUser(member.userId)}
                  >
                    <BannedIcon width={18} height={18} />
                    <h5 className="font-semibold hidden md:block">ban</h5>
                  </div>
                  <div
                    className="flex justify-center items-center text-sm bg-red-500 text-white w-[40px] h-[40px] md:w-[90px] md:py-[7px] rounded md:rounded-full  hover:bg-red-600 active:bg-red-700 cursor-pointer"
                    onClick={() => handleKickUser(member.userId)}
                  >
                    <DeleteIcon width={24} height={24} fill="#ffffff" />
                    <h5 className="font-semibold mt-1 hidden md:block">kick</h5>
                  </div>
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

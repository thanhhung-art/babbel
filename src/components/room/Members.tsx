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
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
              <div className="w-20 h-8 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {data && data.length > 0 ? (
        <ul className="space-y-0.5">
          {data.map((member) => (
            <li
              key={member.userId}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <div className="relative">
                <Avatar width="w-10" height="h-10" name={member.user.name} />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">
                  {member.user.name}
                </h4>
                <p className="text-sm text-gray-500">Member</p>
              </div>

              {userData.data?.id !== member.userId && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBanUser(member.userId)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 
                             bg-gray-100 rounded-lg hover:bg-gray-200 active:bg-gray-300 
                             transition-colors duration-200"
                    title="Ban user"
                  >
                    <BannedIcon
                      width={18}
                      height={18}
                      className="text-gray-600"
                    />
                    <span className="hidden md:block">Ban</span>
                  </button>

                  <button
                    onClick={() => handleKickUser(member.userId)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 
                             bg-red-50 rounded-lg hover:bg-red-100 active:bg-red-200 
                             transition-colors duration-200"
                    title="Kick user"
                  >
                    <DeleteIcon
                      width={18}
                      height={18}
                      className="text-red-600"
                    />
                    <span className="hidden md:block">Kick</span>
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900">No members yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Invite people to join this room
          </p>
        </div>
      )}
    </div>
  );
};

export default Members;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { banned } from "../../utils/contants";
import useAppStore from "../../lib/zustand/store";
import Avatar from "../Avatar";
import {
  getBannedUsersQuery,
  unbanUserQuery,
} from "../../lib/react_query/queries/room/room";

const BannedUsers = () => {
  const currRoomId = useAppStore((state) => state.currentRoomId);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [banned],
    queryFn: () => getBannedUsersQuery(currRoomId),
    enabled: !!currRoomId,
  });

  const unbanMutation = useMutation({
    mutationFn: (userId: string) =>
      unbanUserQuery({ userId, roomId: currRoomId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [banned] });
    },
  });

  const handleUnbanUser = (userId: string) => {
    unbanMutation.mutate(userId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data || data.length === 0) {
    return <h3 className="text-center mt-4">No banned user</h3>;
  }

  return (
    <ul>
      {data.map((banned) => (
        <li key={banned.userId} className="flex gap-2 items-center px-4 py-2">
          <Avatar width="w-10" height="h-10" name={banned.user.name} />
          <h4 className="flex-1">{banned.user.name}</h4>
          <div>
            <button
              className="bg-blue-500 text-white text-sm rounded-full p-2 active:bg-blue-600"
              onClick={() => handleUnbanUser(banned.userId)}
            >
              unban
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BannedUsers;

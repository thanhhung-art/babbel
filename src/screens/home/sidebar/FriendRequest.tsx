import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  acceptFriendRequestQuery,
  getRequestFriendQuery,
} from "../../../lib/react_query/queries";
import { getFriendRequest } from "../../../utils/contants";
import Avatar from "../../../components/Avatar";

const FriendRequest = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [getFriendRequest],
    queryFn: getRequestFriendQuery,
  });

  const acceptFriendRequest = useMutation({
    mutationFn: (friendId: string) => {
      return acceptFriendRequestQuery(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getFriendRequest] });
    },
  });

  return (
    <div>
      {data && data.length === 0 ? (
        <h4 className="text-center mt-2">No friend requests</h4>
      ) : (
        <ul>
          {data &&
            data.map((friend) => (
              <li
                key={friend.id}
                className="flex gap-4 items-center p-2 cursor-pointer rounded"
              >
                <Avatar width="w-10" height="h-10" name={friend.name} />
                <h3 className="text-base">{friend.name}</h3>
                <div className="flex gap-2 ml-auto">
                  <button
                    className="border border-blue-500 px-4 py-1 text-sm rounded-full text-blue-500 active:bg-gray-100"
                    onClick={() => acceptFriendRequest.mutate(friend.id)}
                  >
                    accept
                  </button>
                  <button className="border border-red-500 px-4 py-1 text-sm rounded-full text-red-500 active:bg-gray-100">
                    delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequest;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFriendRequest } from "../../../utils/contants";
import Avatar from "../../../components/Avatar";
import {
  acceptFriendRequestQuery,
  deleteFriendRequestQuery,
  getFriendRequestQuery,
} from "../../../lib/react_query/queries/user/friendRequest";

const FriendRequest = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [getFriendRequest],
    queryFn: getFriendRequestQuery,
  });

  const acceptFriendRequest = useMutation({
    mutationFn: (friendId: string) => {
      return acceptFriendRequestQuery(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getFriendRequest] });
    },
  });

  const deleteFriendRequest = useMutation({
    mutationFn: (friendId: string) => {
      return deleteFriendRequestQuery(friendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getFriendRequest] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1 h-4 bg-gray-200 rounded" />
              <div className="w-20 h-8 bg-gray-200 rounded-full" />
              <div className="w-20 h-8 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {!data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <svg
            className="w-16 h-16 text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <h4 className="text-lg font-medium text-gray-900">
            No friend requests
          </h4>
          <p className="text-sm text-gray-500 text-center mt-1">
            When someone sends you a friend request, it will appear here
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {data.map((friend) => (
            <li
              key={friend.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-colors duration-200 shadow-sm"
            >
              <div className="flex-shrink-0">
                <Avatar width="w-12" height="h-12" name={friend.name} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {friend.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Wants to connect with you
                </p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg 
                           hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50
                           transition-colors duration-200 flex items-center gap-1"
                  onClick={() => acceptFriendRequest.mutate(friend.id)}
                  disabled={acceptFriendRequest.isPending}
                >
                  {acceptFriendRequest.isPending ? (
                    <>
                      <span>Accepting...</span>
                    </>
                  ) : (
                    "Accept"
                  )}
                </button>

                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                           rounded-lg hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50
                           transition-colors duration-200 flex items-center gap-1"
                  onClick={() => deleteFriendRequest.mutate(friend.id)}
                  disabled={deleteFriendRequest.isPending}
                >
                  {deleteFriendRequest.isPending ? (
                    <>
                      <span>Declining...</span>
                    </>
                  ) : (
                    "Decline"
                  )}
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

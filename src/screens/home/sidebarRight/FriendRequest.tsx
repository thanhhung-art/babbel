import { useMutation, useQuery } from "@tanstack/react-query";
import {
  acceptFriendRequestQuery,
  getFriendRequestQuery,
  verifyUser,
} from "../../../lib/react_query/queries";
import { getFriendRequest, user as user_key } from "../../../utils/contants";
import Avatar from "../../../components/Avatar";

interface IProps {
  id: string;
}

const FriendRequest = ({ id }: IProps) => {
  const { data } = useQuery({
    queryKey: [getFriendRequest],
    queryFn: () => getFriendRequestQuery(id),
    enabled: !!id,
  });

  const user = useQuery({
    queryKey: [user_key],
    queryFn: verifyUser,
    enabled: !!id,
  });

  const aceptFriendRequest = useMutation({
    mutationFn: ({
      user_id,
      friend_id,
    }: {
      user_id: string;
      friend_id: string;
    }) => {
      return acceptFriendRequestQuery(user_id, friend_id);
    },
  });

  return (
    <div className="mt-6">
      {data?.length ? (
        <ul>
          {data?.map((item) => (
            <li key={item.id}>
              <div className="flex gap-4 items-center justify-between py-2">
                <div className="flex gap-2 items-center">
                  <Avatar width="w-12" height="h-12" name={item.name} />
                  <h3>{item.name}</h3>
                </div>
                <div>
                  <button
                    onClick={() =>
                      aceptFriendRequest.mutate({
                        user_id: user.data?.id || "",
                        friend_id: item.id,
                      })
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-full mr-4 shadow hover:bg-blue-600 active:bg-blue-800"
                  >
                    Accept
                  </button>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 active:bg-red-800">
                    Reject
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <h3 className="text-center">No friend request</h3>
      )}
    </div>
  );
};

export default FriendRequest;

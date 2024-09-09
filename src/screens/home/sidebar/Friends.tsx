import { useMutation, useQuery } from "@tanstack/react-query";
import { friends } from "../../../utils/contants";
import {
  getConversationQuery,
  getFriends,
} from "../../../lib/react_query/queries";
import Avatar from "../../../components/Avatar";
import Search from "../../../components/Search";
import useAppStore from "../../../lib/zustand/store";

const Friends = () => {
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const setCurrentConversationId = useAppStore(
    (state) => state.setCurrentConversationId
  );

  const { data } = useQuery({ queryKey: [friends], queryFn: getFriends });

  const getConversation = useMutation({
    mutationFn: (friendId: string) => getConversationQuery(friendId),
    onSuccess: (data) => {
      setCurrentFriendId(data.participants[0].id);
      setCurrentConversationId(data.id);
      setCurrentRoomId("");
    },
  });

  const handleGetConvesation = (friendId: string) => {
    getConversation.mutate(friendId);
  };

  if (data?.length === 0)
    return <h3 className="text-center mt-4 text-slate-700">No friends</h3>;

  return (
    <div className="pt-1">
      <Search type="user" />
      <ul className="mt-3">
        {data &&
          data.map((friend) => (
            <li
              key={friend.id}
              className="flex gap-4 items-center p-2 cursor-pointer rounded hover:bg-slate-100"
              onClick={() => handleGetConvesation(friend.id)}
            >
              <div className="relative">
                <Avatar width="w-12" height="h-12" name={friend.name} />
                <div
                  className={`absolute bg-green-500 w-3 h-3 rounded-full bottom-0 right-0 border-2 border-white`}
                ></div>
              </div>
              <div>{friend.name}</div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Friends;

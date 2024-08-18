import { useMutation, useQuery } from "@tanstack/react-query";
import {
  addConversationToChatQuery,
  getFriends,
} from "../../../lib/react_query/queries";
import { friends } from "../../../utils/contants";
import Avatar from "../../../components/Avatar";
import useAppStore from "../../../lib/zustand/store";

const UserFriends = () => {
  const { data } = useQuery({ queryKey: [friends], queryFn: getFriends });
  const onlineFriends = useAppStore((state) => state.onlineFriends);
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);

  const addToChatMutation = useMutation({
    mutationFn: (friendId: string) => {
      return addConversationToChatQuery("user", friendId);
    },
  });

  const handleClick = (friendId: string) => {
    setCurrentFriendId(friendId);
    addToChatMutation.mutate(friendId);
  };

  return (
    <div>
      {data &&
        data.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 items-center justify-between py-2 cursor-pointer active:bg-slate-100"
            onClick={() => handleClick(item.id)}
          >
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Avatar width="w-12" height="h-12" name={item.name} />
                {onlineFriends.includes(item.id) && (
                  <span className="absolute bottom-1 right-0 w-3 h-3 bg-green-600 rounded-full border-2 border-white"></span>
                )}
              </div>
              <h3 className="">{item.name}</h3>
            </div>
          </div>
        ))}
    </div>
  );
};

export default UserFriends;

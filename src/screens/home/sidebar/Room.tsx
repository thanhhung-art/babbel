import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatting, roomsJoined } from "../../../utils/contants";
import Avatar from "../../../components/Avatar";
import Search from "../../../components/Search";
import useAppStore from "../../../lib/zustand/store";
import { addConversationToChatQuery } from "../../../lib/react_query/queries/utils";
import { getRoomsJoinedQuery } from "../../../lib/react_query/queries/room/room";

const Room = () => {
  const queryClient = useQueryClient();
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);
  const setCurrConversationId = useAppStore(
    (state) => state.setCurrentConversationId
  );

  const { data, isLoading } = useQuery({
    queryKey: [roomsJoined],
    queryFn: getRoomsJoinedQuery,
  });

  const addToChatMutation = useMutation({
    mutationFn: (roomId: string) => {
      return addConversationToChatQuery("room", roomId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [chatting] });
    },
  });

  const handleSetState = (roomId: string) => {
    setCurrentRoomId(roomId);
    setCurrentFriendId("");
    setCurrConversationId("");
    addToChatMutation.mutate(roomId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data?.length === 0) {
    return (
      <div className="mt-1">
        <Search type="room" />
        <p className="mt-4 text-center">No rooms joined</p>
      </div>
    );
  }

  return (
    <div className="pt-1">
      <Search type="room" />
      <ul className="mt-3">
        {data &&
          data.map((room) => (
            <li
              key={room.id}
              className="flex gap-4 items-center p-2 cursor-pointer rounded hover:bg-slate-100"
              onClick={() => handleSetState(room.id)}
            >
              <Avatar width="w-12" height="h-12" name={room.name} />
              <h4>{room.name}</h4>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Room;

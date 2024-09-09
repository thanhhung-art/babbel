import { useQuery } from "@tanstack/react-query";
import { getRoomsJoinedQuery } from "../../../lib/react_query/queries";
import { roomsJoined } from "../../../utils/contants";
import Avatar from "../../../components/Avatar";
import Search from "../../../components/Search";
import useAppStore from "../../../lib/zustand/store";

const Room = () => {
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);

  const { data, isLoading } = useQuery({
    queryKey: [roomsJoined],
    queryFn: getRoomsJoinedQuery,
  });

  const handleSetState = (roomId: string) => {
    setCurrentRoomId(roomId);
    setCurrentFriendId("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data?.length === 0) {
    return <h3 className="text-center mt-4 text-slate-700">No rooms</h3>;
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

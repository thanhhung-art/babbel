import { useQuery } from "@tanstack/react-query";
import CreateRoom from "./CreateRoom";
import RoomList from "./RoomList";
import { roomsJoined } from "../../../../utils/contants";
import { getRoomsJoinedQuery } from "../../../../lib/react_query/queries";

const Room = () => {
  const rooms = useQuery({
    queryKey: [roomsJoined],
    queryFn: getRoomsJoinedQuery,
  });

  return (
    <div>
      <CreateRoom />
      {rooms.data && <RoomList rooms={rooms.data} />}
    </div>
  );
};

export default Room;

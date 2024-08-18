import { useMutation } from "@tanstack/react-query";
import Avatar from "../../../../components/Avatar";
import { IRoom } from "../../../../types/room";
import { addConversationToChatQuery } from "../../../../lib/react_query/queries";
import useAppStore from "../../../../lib/zustand/store";

interface IProps {
  rooms: IRoom[];
}

const RoomList = ({ rooms }: IProps) => {
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);

  const addToChattingMutation = useMutation({
    mutationFn: (roomId: string) => {
      return addConversationToChatQuery("room", roomId);
    },
  });

  const handleAddToChatting = (roomId: string) => {
    setCurrentRoomId(roomId);
    addToChattingMutation.mutate(roomId);
  };

  return (
    <div className="mt-2">
      {rooms.map((room) => (
        <div
          key={room.id}
          className="flex gap-4 items-center p-2 hover:bg-slate-200 cursor-pointer active:bg-slate-300 rounded"
          onClick={() => handleAddToChatting(room.id)}
        >
          <Avatar width={"w-12"} height={"h-12"} name={room.name} />
          <h3>{room.name}</h3>
        </div>
      ))}
    </div>
  );
};

export default RoomList;

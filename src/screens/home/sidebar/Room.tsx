import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatting, roomsJoined } from "../../../utils/contants";
import Avatar from "../../../components/Avatar";
import Search from "../../../components/Search";
import useAppStore from "../../../lib/zustand/store";
import { addConversationToChatQuery } from "../../../lib/react_query/queries/utils";
import {
  createRoomQuery,
  getRoomsJoinedQuery,
} from "../../../lib/react_query/queries/room/room";
import PlusIcon from "../../../assets/icons/PlusIcon";
import { createRef } from "react";

const Room = () => {
  const queryClient = useQueryClient();
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);
  const setCurrConversationId = useAppStore(
    (state) => state.setCurrentConversationId
  );
  const modalRef = createRef<HTMLDialogElement>();
  const roomPrivate = createRef<HTMLInputElement>();
  const roomName = createRef<HTMLInputElement>();
  const roomDesc = createRef<HTMLInputElement>();

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

  const createRoomMutation = useMutation({
    mutationFn: (data: {
      name: string;
      avatar: string;
      isPublic: boolean;
      description: string;
    }) => {
      return createRoomQuery(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roomsJoined] });
      modalRef.current?.close();
    },
  });

  const handleSetState = (roomId: string) => {
    setCurrentRoomId(roomId);
    setCurrentFriendId("");
    setCurrConversationId("");
    addToChatMutation.mutate(roomId);
  };

  const handleOpenModal = () => {
    modalRef.current?.showModal();
  };

  const handleTolgglePrivate = () => {
    if (roomPrivate.current) {
      roomPrivate.current.checked = !roomPrivate.current?.checked;
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = roomName.current?.value;
    const desc = roomDesc.current?.value;
    const isPublic = roomPrivate.current?.checked;

    if (name && isPublic !== undefined) {
      if (!name) {
        return;
      }

      const data = {
        name,
        avatar: "",
        isPublic,
        description: desc || "",
      };

      await createRoomMutation.mutate(data);
      modalRef.current?.close();
    }
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
      <div className="absolute bottom-8 right-8">
        <div
          className="bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600 active:bg-blue-700"
          onClick={handleOpenModal}
        >
          <PlusIcon width={40} height={40} />
        </div>
      </div>
      <dialog ref={modalRef} className="rounded-lg">
        <div className="dialog-container p-4 rounded-lg w-[400px]">
          <form onSubmit={handleCreateRoom}>
            <div className="flex flex-col">
              <label htmlFor="room-name-create">Room name:</label>
              <input
                id="room-name-create"
                type="text"
                ref={roomName}
                placeholder="type room name"
                maxLength={50}
                className="text-sm border border-black outline-none mt-2 py-2 px-2 rounded-lg"
              />
            </div>

            <div className="flex flex-col my-4">
              <label htmlFor="room-desc-create">Room description:</label>
              <input
                id="room-desc-create"
                ref={roomDesc}
                type="text"
                placeholder="type room description"
                maxLength={100}
                className="text-sm border border-black outline-none mt-2 p-2 rounded-lg"
              />
            </div>

            <div className="mb-8">
              <h4 className="mb-2">Public</h4>
              <label
                htmlFor="switch"
                className="relative w-[40px] h-[24px] inline-block"
                onClick={handleTolgglePrivate}
              >
                <input
                  ref={roomPrivate}
                  title="switch"
                  id="switch"
                  type="checkbox"
                  className="w-0 h-0 peer"
                />
                <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-200 transition-all peer-checked:bg-blue-500 peer-focus:shadow slider rounded-[30px]"></span>
              </label>
            </div>

            <div className="flex justify-end">
              <button className="bg-blue-500 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-500 active:bg-blue-700 cursor-pointer">
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Room;

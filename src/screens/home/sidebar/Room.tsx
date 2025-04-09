import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatting, roomsJoined } from "../../../utils/contants";
import Avatar from "../../../components/Avatar";
import useAppStore from "../../../lib/zustand/store";
import { addConversationToChatQuery } from "../../../lib/react_query/queries/utils";
import {
  createRoomQuery,
  getRoomsJoinedQuery,
} from "../../../lib/react_query/queries/room/room";
import PlusIcon from "../../../assets/icons/PlusIcon";
import { createRef } from "react";
import SearchRooms from "../../../components/search/SearchRooms";

const Room = () => {
  const queryClient = useQueryClient();
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const setCurrentFriendId = useAppStore((state) => state.setCurrentFriendId);
  const setCurrConversationId = useAppStore(
    (state) => state.setCurrentConversationId,
  );
  const toggleOpenSidebar = useAppStore((state) => state.toggleOpenSidebar);
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
    toggleOpenSidebar(); // Close the sidebar when a room is clicked
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
    const isPrivate = roomPrivate.current?.checked;

    if (name && isPrivate !== undefined) {
      if (!name) {
        return;
      }

      const data = {
        name,
        avatar: "",
        isPublic: !isPrivate,
        description: desc || "",
      };

      createRoomMutation.mutate(data);
      modalRef.current?.close();
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin mb-4"></div>
        <p className="text-gray-500">Loading your rooms...</p>
      </div>
    );
  }

  const CreateRoom = () => (
    <>
      {/* Create Room Button */}
      <div className="absolute bottom-8 right-8" dialog-trigger="true">
        <div
          className="bg-blue-500 p-3 rounded-full cursor-pointer hover:bg-blue-600 active:bg-blue-700 transition-colors duration-200 shadow-lg"
          onClick={handleOpenModal}
        >
          <PlusIcon width={24} height={24} className="text-white" />
        </div>
      </div>

      {/* Create Room Dialog */}
      <dialog
        ref={modalRef}
        className="rounded-xl w-full md:w-[450px] p-0 dialog"
      >
        <div className="p-6 border border-gray-200 bg-white rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Create New Room
            </h2>
            <button
              onClick={() => modalRef.current?.close()}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="room-name-create"
                className="block text-sm font-medium text-gray-700"
              >
                Room name
              </label>
              <input
                id="room-name-create"
                type="text"
                ref={roomName}
                placeholder="Enter room name"
                maxLength={50}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="room-desc-create"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <input
                id="room-desc-create"
                ref={roomDesc}
                type="text"
                placeholder="Enter room description"
                maxLength={100}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  Room Privacy
                </h4>
                <label
                  htmlFor="switch"
                  className="relative inline-flex items-center cursor-pointer"
                  onClick={handleTolgglePrivate}
                >
                  <input
                    ref={roomPrivate}
                    title="switch"
                    id="switch"
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {roomPrivate.current?.checked ? "Public" : "Private"}
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => modalRef.current?.close()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Create Room
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );

  if (data?.length === 0) {
    return (
      <div className="relative h-full flex flex-col">
        <div className="px-2 pt-2">
          <SearchRooms />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center p-6 max-w-md">
            <div className="bg-slate-100 rounded-full p-4 inline-block mb-4">
              <svg
                className="w-10 h-10 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              No rooms yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Create a new room or search for existing ones to join
              conversations.
            </p>
          </div>
        </div>
        <CreateRoom />
      </div>
    );
  }

  return (
    <div className="pt-1 relative h-full">
      <div className="px-2">
        <SearchRooms />
      </div>

      {/* Room List */}
      <ul className="mt-3 px-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {data &&
          data.length > 0 &&
          data.map((room) => (
            <li
              key={room.id}
              className="flex gap-4 items-center p-3 cursor-pointer rounded-lg hover:bg-slate-100 transition-colors duration-200"
              onClick={() => handleSetState(room.id)}
            >
              <Avatar width="w-12" height="h-12" name={room.name} />
              <div>
                <h4 className="font-medium text-gray-800">{room.name}</h4>
                {/* {room.description && (
                  <p className="text-sm text-gray-500 truncate max-w-[200px]">
                    {room.description}
                  </p>
                )} */}
              </div>
            </li>
          ))}
      </ul>

      <CreateRoom />
    </div>
  );
};

export default Room;

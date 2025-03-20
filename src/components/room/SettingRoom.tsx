import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "../Avatar";
import { getRoomInfo, roomsJoined } from "../../utils/contants";
import {
  deleteRoomQuery,
  getRoomInfoQuery,
  updateRoomQuery,
} from "../../lib/react_query/queries/room/room";
import useAppStore from "../../lib/zustand/store";
import { RefObject, useEffect, useRef } from "react";
import { IUpdateRoom } from "../../types/room";
import LoadingIcon from "../../assets/icons/LoadingIcon";

interface IProps {
  dialog: RefObject<HTMLDialogElement>;
}

const SettingRoom = ({ dialog }: IProps) => {
  const currRoooId = useAppStore((state) => state.currentRoomId);
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const roomName = useRef<HTMLInputElement>(null);
  const roomDescription = useRef<HTMLTextAreaElement>(null);
  const roomPrivate = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [getRoomInfo],
    queryFn: () => getRoomInfoQuery(currRoooId),
    enabled: !!currRoooId,
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({
      roomName,
      roomDescription,
      isPublic,
    }: {
      roomName: string;
      roomDescription: string;
      isPublic: boolean;
    }) => {
      const dataToUpdate: IUpdateRoom = {};

      if (data) {
        if (roomName && roomName !== data.name) dataToUpdate.name = roomName;
        if (roomDescription && roomDescription !== data.description)
          dataToUpdate.description = roomDescription;
        if (isPublic && isPublic !== data.isPublic)
          dataToUpdate.isPublic = isPublic;
      }

      return updateRoomQuery(currRoooId, dataToUpdate);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [getRoomInfo] });
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: () => {
      return deleteRoomQuery(currRoooId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [roomsJoined] });
    },
  });

  const handleTolgglePrivate = () => {
    if (roomPrivate.current) {
      roomPrivate.current.checked = !roomPrivate.current?.checked;
    }
  };

  const hanldeUpdateRoom = () => {
    if (roomName.current && roomDescription.current && roomPrivate.current) {
      updateRoomMutation.mutate({
        roomName: roomName.current.value,
        roomDescription: roomDescription.current.value,
        isPublic: !roomPrivate.current.checked,
      });
    }
  };

  const handleDeleteRoom = () => {
    deleteRoomMutation.mutate();
    dialog.current?.close();
    setCurrentRoomId("");
  };

  useEffect(() => {
    if (data && roomPrivate.current) {
      roomPrivate.current.checked = data?.isPublic ? false : true;
    }
  }, [data]);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          <Avatar
            width="w-24"
            height="h-24"
            name={data?.name || "Room"}
          />
          <div className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200">
            {/* <EditIcon width={16} height={16} className="text-gray-600" /> */}
          </div>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          {data?.name || "Room Settings"}
        </h2>
      </div>

      {/* Form Section */}
      <div className="space-y-6">
        {/* Room Name */}
        <div className="space-y-2">
          <label
            htmlFor="room-name"
            className="block text-sm font-medium text-gray-700"
          >
            Room Name
          </label>
          <input
            ref={roomName}
            id="room-name"
            type="text"
            placeholder="Enter room name"
            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     placeholder:text-gray-400 transition-all duration-200"
            defaultValue={data?.name || ""}
          />
        </div>

        {/* Room Description */}
        <div className="space-y-2">
          <label
            htmlFor="room-description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            ref={roomDescription}
            id="room-description"
            placeholder="Enter room description"
            rows={4}
            className="w-full px-4 py-2 text-gray-700 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     placeholder:text-gray-400 transition-all duration-200 resize-none"
            defaultValue={data?.description || ""}
          />
        </div>

        {/* Privacy Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-700">Private Room</h4>
            <p className="text-sm text-gray-500">
              Only invited members can join
            </p>
          </div>
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
            <div
              className="w-11 h-6 bg-gray-200 rounded-full peer 
                          peer-checked:after:translate-x-full peer-checked:after:border-white 
                          after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                          after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"
            ></div>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-6 border-t">
          <button
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 
                     rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50 
                     transition-colors duration-200 flex items-center justify-center"
            onClick={hanldeUpdateRoom}
            disabled={updateRoomMutation.isPending}
          >
            {updateRoomMutation.isPending ? (
              <div className="flex items-center gap-2">
                <LoadingIcon width={16} height={16} className="animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              "Save Changes"
            )}
          </button>

          <button
            className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 
                     rounded-lg hover:bg-red-100 active:bg-red-200 disabled:opacity-50 
                     transition-colors duration-200 flex items-center justify-center"
            onClick={handleDeleteRoom}
            disabled={deleteRoomMutation.isPending}
          >
            {deleteRoomMutation.isPending ? (
              <div className="flex items-center gap-2">
                <LoadingIcon width={16} height={16} className="animate-spin" />
                <span>Deleting...</span>
              </div>
            ) : (
              "Delete Room"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingRoom;

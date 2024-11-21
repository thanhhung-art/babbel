import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "../Avatar";
import { getRoomInfo } from "../../utils/contants";
import {
  deleteRoomQuery,
  getRoomInfoQuery,
  updateRoomQuery,
} from "../../lib/react_query/queries/room/room";
import useAppStore from "../../lib/zustand/store";
import { useEffect, useRef } from "react";
import { IUpdateRoom } from "../../types/room";
import LoadingIcon from "../../assets/icons/LoadingIcon";

const SettingRoom = () => {
  const currRoooId = useAppStore((state) => state.currentRoomId);
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
  };

  useEffect(() => {
    if (data && roomPrivate.current) {
      roomPrivate.current.checked = data?.isPublic ? false : true;
    }
  }, [data]);

  return (
    <div className="pl-4">
      <div className="">
        <div className="m-auto w-fit my-6">
          <Avatar width="w-24" height="h-24" name="room 1" />
        </div>
        <div className="mb-4">
          <label htmlFor="room-name">Name</label>
          <input
            ref={roomName}
            id="room-name"
            type="text"
            placeholder="name"
            className="border border-gray-400 w-full p-2 rounded-lg outline-none"
            defaultValue={data?.name || ""}
          />
        </div>

        <div>
          <label htmlFor="room-description">Description</label>
          <textarea
            ref={roomDescription}
            id="room-description"
            placeholder="description"
            className="border border-gray-400 w-full p-2 rounded-lg outline-none"
            defaultValue={data?.description || ""}
          />
        </div>

        <div className="mt-2">
          <h4 className="mb-1">Private</h4>
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

        <div className="flex flex-col gap-2 items-end mt-5">
          <button
            className="bg-blue-500 w-[110px] py-2  text-white rounded-lg text-sm hover:bg-blue-600 active:bg-blue-700"
            onClick={hanldeUpdateRoom}
            disabled={updateRoomMutation.isPending}
          >
            {updateRoomMutation.isPending ? (
              <div className="flex gap-2 items-center px-2">
                <div className="animate-spin w-fit h-fit">
                  <LoadingIcon width={20} height={20} />
                </div>
                <p className="text-sm">loading...</p>
              </div>
            ) : (
              "update"
            )}
          </button>
          <button
            className="bg-red-500 w-[110px] py-2 text-white rounded-lg text-sm hover:bg-red-600 active:bg-red-700"
            onClick={handleDeleteRoom}
            disabled={deleteRoomMutation.isPending}
          >
            {deleteRoomMutation.isPending ? (
              <div className="flex gap-2 items-center px-2">
                <div className="animate-spin w-fit h-fit">
                  <LoadingIcon width={20} height={20} />
                </div>
                <p className="text-sm">loading...</p>
              </div>
            ) : (
              "delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingRoom;

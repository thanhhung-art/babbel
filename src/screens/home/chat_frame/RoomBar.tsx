import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Avatar from "../../../components/Avatar";
import {
  chatting,
  checkAdmin,
  room,
  roomsJoined,
} from "../../../utils/contants";
import useAppStore from "../../../lib/zustand/store";
import { createRef, useRef } from "react";
import RoomManagement from "../../../components/room/RoomManagement";
import DotMenuIcon from "../../../assets/icons/DotMenuIcon";
import {
  finRoomById,
  leaveRoomQuery,
} from "../../../lib/react_query/queries/room/room";
import { checkRoomAdminQuery } from "../../../lib/react_query/queries/user/user";

const RoomBar = () => {
  const queryClient = useQueryClient();
  const currRoomId = useAppStore((state) => state.currentRoomId);
  const setCurrentRoomId = useAppStore((state) => state.setCurrentRoomId);
  const triggerRef = createRef<HTMLDivElement>();
  const refs = useRef<{
    dialog: HTMLDialogElement | null;
  }>({ dialog: null });

  const { data } = useQuery({
    queryKey: [room],
    queryFn: () => finRoomById(currRoomId),
    enabled: !!currRoomId,
  });

  const checkAdminQuery = useQuery({
    queryKey: [checkAdmin],
    queryFn: () => checkRoomAdminQuery(currRoomId),
  });

  const leaveRoomMutation = useMutation({
    mutationFn: () => leaveRoomQuery(currRoomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [chatting, roomsJoined] });
    },
  });

  const handleOpenOptions = () => {
    refs.current.dialog?.showModal();
  };

  const handleCloseOptions = () => {
    refs.current.dialog?.close();
  };

  const handleLeaveRoom = () => {
    leaveRoomMutation.mutate();
    setCurrentRoomId("");
  };

  return (
    <div className="bg-white p-2">
      <div className="flex gap-4 items-center">
        <Avatar width="w-12" height="h-12" name={data ? data.name : ""} />
        <h3 className="flex-1">{data ? data.name : ""}</h3>
        {checkAdminQuery &&
        checkAdminQuery.data &&
        checkAdminQuery.data.isAdmin ? (
          <div
            className="cursor-pointer"
            onClick={handleOpenOptions}
            ref={triggerRef}
          >
            <DotMenuIcon />
          </div>
        ) : (
          <button
            className="px-3 py-1 border-2 border-red-500 text-red-500 text-sm font-semibold rounded hover:bg-red-500 hover:text-white active:bg-red-600"
            onClick={handleLeaveRoom}
          >
            leave room
          </button>
        )}
      </div>
      {checkAdminQuery.data && checkAdminQuery.data.isAdmin && (
        <RoomManagement ref={refs} handleCloseOptions={handleCloseOptions} />
      )}
    </div>
  );
};

export default RoomBar;

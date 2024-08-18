import { useMutation } from "@tanstack/react-query";
import { createRef } from "react";
import { createRoomQuery } from "../../../../lib/react_query/queries";

const CreateRoom = () => {
  const roomDialog = createRef<HTMLDialogElement>();
  const roomName = createRef<HTMLInputElement>();

  const createRoom = useMutation({
    mutationFn: (data: { name: string; avatar: string }) => {
      return createRoomQuery(data);
    },
  });

  const handleOpenDeleteDialog = () => {
    roomDialog.current?.showModal();
  };

  const handleCloseDeleteDialog = () => {
    roomDialog.current?.close();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomName.current) {
      const name = roomName.current.value;
      createRoom.mutate({ name, avatar: "" });
    }

    handleCloseDeleteDialog();
  };

  return (
    <>
      <div className="mt-4">
        <button
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 active:bg-blue-700"
          onClick={handleOpenDeleteDialog}
        >
          create room
        </button>
      </div>
      <dialog ref={roomDialog} className="p-4 rounded w-[400px]">
        <div className="flex justify-end">
          <button
            onClick={handleCloseDeleteDialog}
            className="bg-red-500 px-2 py-1 text-white text-sm rounded hover:bg-red-600 active:bg-red-700"
          >
            close
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="room-name" className="font-bold">
              Room name:
            </label>
          </div>
          <input
            id="room-name"
            type="text"
            placeholder="type room name"
            className="border p-2 rounded outline-none w-full"
            ref={roomName}
          />
          <div className="mt-2">
            <label htmlFor="room-description" className="font-bold">
              Room description:
            </label>
          </div>
          <textarea
            id="room-description"
            placeholder="type room description"
            className="w-full p-2 outline-none border rounded"
          ></textarea>
          <div>
            <button className="bg-blue-500 w-full py-2 rounded text-white">
              create
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default CreateRoom;

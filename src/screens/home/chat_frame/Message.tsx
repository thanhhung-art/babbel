import { MutableRefObject, useMemo, useState } from "react";
import { IMessage } from "../../../types/message";
import { timeAgo } from "../../../utils/timeAgo";
import Avatar from "../../../components/Avatar";
import useAppStore from "../../../lib/zustand/store";

interface IProps {
  message: IMessage;
  isUser: boolean;
  idMessageToDelete: MutableRefObject<string>;
  username?: string;
  idMessageToUpdate: MutableRefObject<string>;
  handleOpenDeleteDialog: () => void;
  handleOpenUpdateDialog: () => void;
}

const Message = ({
  message,
  isUser,
  username,
  idMessageToDelete,
  idMessageToUpdate,
  handleOpenDeleteDialog,
  handleOpenUpdateDialog,
}: IProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const date = useMemo(
    () => timeAgo(message.createdAt || ""),
    [message.createdAt]
  );
  const currentRoomId = useAppStore((state) => state.currentRoomId);

  const handleToggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleMouseLeave = () => {
    setShowOptions(false);
  };

  return (
    <div className="group">
      <div className="flex gap-2 items-center">
        {username && !isUser && currentRoomId && (
          <div>
            <Avatar name={username} width="w-12" height="h-12" />
          </div>
        )}
        <div
          className={`p-4 shadow w-[500px] rounded-[30px] relative ${
            isUser ? "bg-blue-500 text-white ml-auto" : "bg-white text-gray-800"
          }`}
        >
          <h3 className={`break-words`}>{message.content}</h3>
          {isUser && (
            <>
              <div
                className="absolute top-1/2 -translate-y-1/2 -left-10 hidden group-hover:block z-20"
                onClick={handleToggleOptions}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-white w-8 h-8 flex gap-1 justify-center items-center rounded-full rotate-90 cursor-pointer active:bg-slate-200 relative">
                  <div className="w-[3px] h-[3px] bg-black rounded-full"></div>
                  <div className="w-[3px] h-[3px] my-1 bg-black rounded-full"></div>
                  <div className="w-[3px] h-[3px] bg-black rounded-full"></div>

                  {showOptions && (
                    <div className="absolute -bottom-8 left-5  -rotate-90">
                      <div className=" bg-white text-black rounded p-2 mt-8">
                        <button
                          className="px-2 py-1 text-sm hover:bg-slate-100 active:bg-slate-200 text-blue-500"
                          onClick={() => {
                            if (idMessageToUpdate) {
                              idMessageToUpdate.current = message.id;
                            }
                            handleOpenUpdateDialog();
                          }}
                        >
                          update
                        </button>
                        <br />
                        <button
                          className="px-2 py-1 text-sm hover:bg-slate-100 active:bg-slate-200 text-red-500"
                          onClick={() => {
                            if (idMessageToDelete) {
                              idMessageToDelete.current = message.id;
                            }
                            handleOpenDeleteDialog();
                          }}
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {message.files &&
        message.files.map((file, index) => (
          <div key={index} className={`${isUser && "flex justify-end"} mt-4`}>
            <img src={file.url} alt="image" className="rounded-lg" />
          </div>
        ))}
      <div className={`${isUser && "flex justify-end"}`}>
        {username && !isUser && currentRoomId && (
          <span className="text-gray-600 text-[14px] ml-2 mr-8">
            {message.user?.name}
          </span>
        )}
        <span className="text-gray-600 text-[14px] ml-2">{date}</span>
      </div>
    </div>
  );
};

export default Message;

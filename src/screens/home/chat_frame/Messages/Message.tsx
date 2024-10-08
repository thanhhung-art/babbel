import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { IMessage } from "../../../../types/message";
import { timeAgo } from "../../../../utils/timeAgo";
import Avatar from "../../../../components/Avatar";
import DeleteIcon from "../../../../assets/icons/DeleteIcon";
import UpdateIcon from "../../../../assets/icons/UpdateIcon";
interface IProps {
  message: IMessage;
  isUser: boolean;
  idMessageToDelete: MutableRefObject<string>;
  username?: string;
  idMessageToUpdate: MutableRefObject<string>;
  handleOpenDeleteDialog: () => void;
  handleOpenUpdateDialog: () => void;
  handleScrollIntoView: () => void;
}

const Message = ({
  message,
  isUser,
  username,
  idMessageToDelete,
  idMessageToUpdate,
  handleOpenDeleteDialog,
  handleOpenUpdateDialog,
  handleScrollIntoView,
}: IProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const date = useMemo(
    () => timeAgo(message.createdAt || ""),
    [message.createdAt]
  );
  const handleToggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleMouseLeave = () => {
    setShowOptions(false);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      optionsContainerRef.current &&
      !optionsContainerRef.current.contains(e.target as Node)
    ) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (!entries[entries.length - 1].isIntersecting) {
        handleScrollIntoView();
      }
    });

    const images = document.querySelectorAll("img[data-src]");
    images.forEach((img) => {
      observer.observe(img);
    });
  }, [message.files, handleScrollIntoView]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`flex ${isUser && "justify-end"} group mt-2`}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex gap-4">
        {!isUser && (
          <div>
            <Avatar width="w-14" height="h-14" name={username} />
          </div>
        )}
        <div className="relative">
          {message.content && (
            <p
              className={`p-4 ${
                isUser ? "bg-blue-500 text-white" : "bg-white"
              } rounded-full`}
            >
              {message.content}
            </p>
          )}
          {message.files?.length > 0 && (
            <div className={`${message.content && "mt-2"}`}>
              {message.files?.map((file, index) => (
                <img
                  key={index}
                  data-src={file.url}
                  src={file.url}
                  alt="file"
                  className="rounded max-w-[500px]"
                />
              ))}
            </div>
          )}
          {isUser && (
            <div
              className={`absolute right-full top-0 hidden group-hover:block`}
            >
              <div
                className="flex flex-col justify-center items-center gap-1 w-10 h-10 rounded-full bg-white shadow cursor-pointer mr-2 active:bg-gray-100 relative"
                onClick={handleToggleOptions}
              >
                <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
                <div className="w-[3px] h-[3px] rounded-full bg-black"></div>
              </div>

              {showOptions && (
                <div
                  ref={optionsContainerRef}
                  className="absolute right-full top-0"
                >
                  <div className="mr-2 bg-white p-2">
                    <div
                      className="flex gap-2 items-center cursor-pointer hover:bg-slate-100 p-1 rounded"
                      onClick={() => {
                        idMessageToUpdate.current = message.id;
                        handleOpenUpdateDialog();
                      }}
                    >
                      <p className="text-blue-500 text-sm">Update</p>
                      <UpdateIcon width={24} height={24} />
                    </div>

                    <div
                      className="flex gap-2 items-center cursor-pointer hover:bg-slate-100 p-1 rounded"
                      onClick={() => {
                        idMessageToDelete.current = message.id;
                        handleOpenDeleteDialog();
                      }}
                    >
                      <p className="text-red-500 text-sm pr-1">Delete</p>
                      <DeleteIcon width={24} height={24} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={`flex ${isUser && "justify-end"}`}>
            <span className="text-sm text-gray-600">{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;

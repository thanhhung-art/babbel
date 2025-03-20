import { MutableRefObject, useEffect, useMemo, useRef } from "react";
import { IMessage } from "../../../../types/message";
import { timeAgo } from "../../../../utils/timeAgo";
import Avatar from "../../../../components/Avatar";
import DeleteIcon from "../../../../assets/icons/DeleteIcon";
import UpdateIcon from "../../../../assets/icons/UpdateIcon";
import DotMenuIcon from "../../../../assets/icons/DotMenuIcon";
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
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const date = useMemo(
    () => timeAgo(message.createdAt || ""),
    [message.createdAt]
  );

  const handleToggleOptions = () => {
    const optionsContainer = optionsContainerRef.current;
    if (optionsContainer) {
      optionsContainer.classList.toggle("hidden");
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

  return (
    <div
      className={`group flex items-start gap-2 hover:bg-gray-50/50 transition-colors duration-200 ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="flex-shrink-0">
          <Avatar width="w-10" height="h-10" name={username} />
        </div>
      )}

      {/* Message Content */}
      <div
        className={`flex flex-col gap-1 max-w-[70%] ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div className={`relative group ${isUser && "z-10"}`}>
          {/* Text Message */}
          {message.content && (
            <div
              className={`
                px-4 py-2 rounded-2xl break-words
                ${
                  isUser
                    ? "bg-blue-500 text-white"
                    : "bg-white border border-gray-200"
                }
              `}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          )}

          {/* Images */}
          {message.files?.length > 0 && (
            <div className={`${message.content ? "mt-2" : ""} space-y-2`}>
              {message.files?.map((file, index) => (
                <img
                  key={index}
                  data-src={file.url}
                  src={file.url}
                  alt="attachment"
                  className="rounded-lg max-w-[300px] md:max-w-[400px] hover:opacity-95 transition-opacity duration-200"
                  loading="lazy"
                />
              ))}
            </div>
          )}

          {/* Message Options */}
          {isUser && (
            <div className="absolute top-1/2 -translate-y-1/2 right-full mr-2 option-container">
              <div
                className="p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-all duration-200"
                onClick={handleToggleOptions}
              >
                <DotMenuIcon w={16} h={16} />
              </div>

              <div
                ref={optionsContainerRef}
                className="absolute right-full top-full -left-7 mt-1 mr-1 z-10 hidden"
              >
                <div className="bg-white rounded-lg shadow-lg border border-gray-200   w-32">
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => {
                      idMessageToUpdate.current = message.id;
                      handleOpenUpdateDialog();
                    }}
                  >
                    <UpdateIcon width={16} height={16} />
                    <span>Edit</span>
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
                    onClick={() => {
                      idMessageToDelete.current = message.id;
                      handleOpenDeleteDialog();
                    }}
                  >
                    <DeleteIcon width={16} height={16} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className={`text-xs text-gray-500 ${isUser ? "pr-4" : "pl-4"}`}>
          {date}
        </span>
      </div>
    </div>
  );
};

export default Message;

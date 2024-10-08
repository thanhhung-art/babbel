import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  lazy,
  Suspense,
} from "react";
import { SendIcon } from "../../../assets/icons/SendIcon";
import { socket } from "../../../SocketContext/socket";
import useAppStore from "../../../lib/zustand/store";
//import FileIcon from "../../../assets/icons/FileIcon";
import Arrow from "../../../assets/icons/Arrow";
import ImageIcon from "../../../assets/icons/ImageIcon";
//import VideoIcon from "../../../assets/icons/VideoIcon";
import { handleFileUploads } from "../../../utils/file";
const Picker = lazy(() => import("@emoji-mart/react"));
import EmojiIcon from "../../../assets/icons/EmojiIcon";
import { IFileUpload } from "../../../types/file";

const MessageInput = () => {
  const currConversationId = useAppStore(
    (state) => state.currentConversationId
  );
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const currentFriendId = useAppStore((state) => state.currentFriendId);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hiddenInputContainerRef = useRef<HTMLInputElement>(null);
  const [friendTyping, setFriendTyping] = useState({
    isTyping: false,
    conversationId: "",
  });
  const [images, setImages] = useState<string[]>([]);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [emojiData, setEmojiData] = useState<unknown>(null);
  const fileUploadRef = useRef<IFileUpload>({});

  const handleSendMessage = async () => {
    if (
      !inputRef.current?.value &&
      Object.keys(fileUploadRef.current).length === 0
    )
      return;

    const limit = 500;

    if (inputRef.current && inputRef.current.value.length <= limit) {
      let urls: string[] = [];
      // if there are files to upload
      if (Object.keys(fileUploadRef.current).length > 0) {
        const res = await handleFileUploads(fileUploadRef.current);
        urls = res
          .map((r) => r.map((file) => file.fileData))
          .flat()
          .filter((url) => url);
      }
      if (currConversationId && currentFriendId) {
        socket.emit("send-message-to-user", {
          conversationId: currConversationId,
          friendId: currentFriendId,
          content: inputRef.current.value,
          urls,
        });
      } else {
        socket.emit("send-message-to-room", {
          roomId: currentRoomId,
          content: inputRef.current?.value,
          urls,
        });
      }

      inputRef.current.value = "";
      fileUploadRef.current = {};
      setImages([]);
    } else {
      alert(`Message should be less than ${limit} characters`);
    }
  };

  const handleTypingMessage = (isTyping: boolean) => {
    if (currConversationId && currentFriendId) {
      socket.emit("typing-message-to-friend", {
        conversationId: currConversationId,
        friendId: currentFriendId,
        isTyping,
      });
    }
  };

  const handleOpenHiddenInput = () => {
    if (hiddenInputContainerRef.current) {
      hiddenInputContainerRef.current.classList.toggle("w-[100px]");
      hiddenInputContainerRef.current.classList.toggle("overflow-hidden");
      hiddenInputContainerRef.current.classList.toggle("w-0");
      arrowRef.current?.classList.toggle("rotate-180");
    }
  };

  const handleOpenEmoji = () => {
    setOpenEmoji(!openEmoji);
  };

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = crypto.randomUUID() + "." + file.type.split("/")[1];
        const totalChunks = Math.ceil(file.size / (64 * 1024));

        for (let j = 0; j < file.size; j += 64 * 1024) {
          const chunk = file.slice(j, j + 64 * 1024);
          if (!fileUploadRef.current[fileName]) {
            fileUploadRef.current[fileName] = {
              chunks: [chunk],
              size: file.size,
              name: fileName,
              type: file.type,
              totalChunks,
            };
          } else {
            fileUploadRef.current[fileName].chunks.push(chunk);
          }
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setImages([...images, reader.result]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const addEmoji = (e: { native: unknown }) => {
    if (inputRef.current) {
      inputRef.current.value += e.native;
    }
  };

  useEffect(() => {
    const pressEnter = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSendMessage();
      }
    };
    document.addEventListener("keydown", pressEnter);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      document.removeEventListener("keydown", pressEnter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchEmojiData = async () => {
      const response = await fetch(
        "https://cdn.jsdelivr.net/npm/@emoji-mart/data"
      );

      const data = await response.json();

      setEmojiData(data);
    };

    fetchEmojiData();
  }, []);

  useEffect(() => {
    socket.on(
      "friend-typing-message",
      ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        conversationId,
        isTyping,
      }: {
        conversationId: string;
        isTyping: boolean;
      }) => {
        setFriendTyping({ isTyping, conversationId });
      }
    );

    return () => {
      socket.off("friend-typing-message");
    };
  }, []);

  return (
    <div className="border">
      <div className="flex relative">
        {friendTyping.isTyping &&
          friendTyping.conversationId === currConversationId && (
            <div className="absolute -top-4 left-2 flex gap-2 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-gray-600"></span>
              <span className="w-2 h-2 rounded-full bg-gray-600"></span>
              <span className="w-2 h-2 rounded-full bg-gray-600"></span>
            </div>
          )}

        {images.length > 0 && (
          <div className="absolute -top-[120px] w-[calc(100%-100px)] left-24 overflow-x-auto flex-container">
            <div className="flex gap-2">
              {images.map((image, index) => (
                <div className="relative shrink-0" key={index}>
                  <span
                    className="absolute -right-1 -top-1 w-4 h-4 bg-red-500 text-white cursor-pointer rounded-full flex justify-center items-center active:bg-red-600"
                    onClick={() => {
                      setImages(images.filter((img) => img !== image));
                    }}
                  >
                    x
                  </span>
                  <img
                    src={image}
                    alt="image"
                    className="w-[200px] h-[120px] object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div
          ref={hiddenInputContainerRef}
          className="w-0 transition-all duration-200 overflow-hidden"
        >
          <div className="flex justify-between p-2 items-center border h-full bg-white">
            {/* <label htmlFor="file" className="cursor-pointer">
              <input id="file" type="file" className="hidden" hidden />
              <FileIcon />
            </label> */}
            <label htmlFor="image" className="cursor-pointer">
              <input
                id="image"
                type="file"
                className="hidden"
                hidden
                accept="image/*"
                onChange={handleSelectFile}
              />
              <ImageIcon h={12} w={12} />
            </label>
            {/* <label htmlFor="video" className="cursor-pointer">
              <input
                id="video"
                type="file"
                className="hidden"
                hidden
                accept="video/*"
              />
              <VideoIcon h={12} w={12} />
            </label> */}
            <label
              htmlFor=""
              className="relative cursor-pointer"
              onClick={handleOpenEmoji}
            >
              {openEmoji && (
                <Suspense>
                  <div className="absolute -top-[460px] -left-16">
                    <Picker data={emojiData} onEmojiSelect={addEmoji} />
                  </div>
                </Suspense>
              )}
              <EmojiIcon h={24} w={24} />
            </label>
          </div>
        </div>
        <div
          className="w-16 bg-white border-r flex justify-center items-center"
          onClick={handleOpenHiddenInput}
        >
          <span
            className="cursor-pointer transition-all duration-300"
            ref={arrowRef}
          >
            <Arrow w={12} h={12} />
          </span>
        </div>
        <input
          type="text"
          className="w-full p-4 outline-none"
          placeholder="Type a message..."
          ref={inputRef}
          onFocus={() => handleTypingMessage(true)}
          onBlur={() => handleTypingMessage(false)}
        />
        <span
          className="w-20 flex items-center justify-center cursor-pointer bg-sky-300 border-l active:bg-sky-400"
          onClick={handleSendMessage}
        >
          <SendIcon />
        </span>
      </div>
    </div>
  );
};

export default MessageInput;

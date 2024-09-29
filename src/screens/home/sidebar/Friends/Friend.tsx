import { createRef, useEffect, useState } from "react";
import DotMenuIcon from "../../../../assets/icons/DotMenuIcon";
import Avatar from "../../../../components/Avatar";
import UnfriendIcon from "../../../../assets/icons/UnfriendIcon";
import BlockIcon from "../../../../assets/icons/BlockIcon";

interface IProps {
  friend: { id: string; name: string };
  handleGetConversation: (id: string) => void;
  handleBlockUser: (friendId: string) => void;
  handleUnfriendUser: (friendId: string) => void;
}

const Friend = ({
  friend,
  handleGetConversation,
  handleBlockUser,
  handleUnfriendUser,
}: IProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionsContainer = createRef<HTMLDivElement>();

  const handleToggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        optionsContainer.current &&
        !optionsContainer.current.contains(e.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [optionsContainer]);

  return (
    <li className="flex justify-between items-center p-2 cursor-pointer rounded hover:bg-slate-100">
      <div
        className="flex gap-4 items-center w-full"
        onClick={() => handleGetConversation(friend.id)}
      >
        <div className="relative">
          <Avatar width="w-12" height="h-12" name={friend.name} />
          <div
            className={`absolute bg-green-500 w-3 h-3 rounded-full bottom-0 right-0 border-2 border-white`}
          ></div>
        </div>
        <h4 className="">{friend.name}</h4>
      </div>
      <div
        className="ml-auto relative"
        onClick={handleToggleOptions}
        ref={optionsContainer}
      >
        <DotMenuIcon w={24} h={24} />
        {showOptions && (
          <div className="absolute top-0 right-full">
            <div className="bg-white p-2 rounded-lg shadow">
              <div
                onClick={() => handleBlockUser(friend.id)}
                className="w-full flex justify-between items-end cursor-pointer p-1 hover:bg-slate-100 active:bg-slate-200"
              >
                <span className="text-sm w-16">Block</span>
                <BlockIcon width={24} height={24} />
              </div>
              <div
                className="w-full flex justify-between items-end cursor-pointer p-1 hover:bg-slate-100 active:bg-slate-200"
                onClick={() => handleUnfriendUser(friend.id)}
              >
                <span className="text-sm text-red-500 w-16">Unfriend</span>
                <UnfriendIcon width={24} height={24} />
              </div>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default Friend;

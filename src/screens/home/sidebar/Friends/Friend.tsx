import { useState } from "react";
import DotMenuIcon from "../../../../assets/icons/DotMenuIcon";
import Avatar from "../../../../components/Avatar";

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

  const handleToggleOptions = () => {
    setShowOptions((prev) => !prev);
  };

  const handleCloseShowOptions = () => {
    setShowOptions(false);
  };

  return (
    <li
      className="flex justify-between items-center p-2 cursor-pointer rounded hover:bg-slate-100"
      onMouseLeave={handleCloseShowOptions}
    >
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
      <div className="ml-auto relative" onClick={handleToggleOptions}>
        <DotMenuIcon w={24} h={24} />
        {showOptions && (
          <div className="absolute top-0 right-full">
            <div className="bg-white p-2 rounded-lg shadow">
              <button
                onClick={() => handleBlockUser(friend.id)}
                className="w-full text-sm"
              >
                Block
              </button>
              <button
                className="w-full text-sm text-red-500"
                onClick={() => handleUnfriendUser(friend.id)}
              >
                Unfriend
              </button>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default Friend;

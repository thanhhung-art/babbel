import { createRef, useMemo } from "react";
import DotMenuIcon from "../../../../assets/icons/DotMenuIcon";
import Avatar from "../../../../components/Avatar";
import UnfriendIcon from "../../../../assets/icons/UnfriendIcon";
import BlockIcon from "../../../../assets/icons/BlockIcon";
import useAppStore from "../../../../lib/zustand/store";
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
  const optionsContainer = createRef<HTMLDivElement>();
  const onlineFriends = useAppStore((state) => state.onlineFriends);

  const isUserOnline = useMemo(() => {
    if (!friend.id) return false;
    return onlineFriends.includes(friend.id);
  }, [friend.id, onlineFriends]);

  const handleToggleOptions = () => {
    if (optionsContainer.current) {
      optionsContainer.current.classList.toggle("hidden");
    }
  };

  return (
    <li className="group relative flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
      <div
        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
        onClick={() => handleGetConversation(friend.id)}
      >
        <div className="relative flex-shrink-0">
          <Avatar width="w-11" height="h-11" name={friend.name} />
          {isUserOnline && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
          )}
        </div>
        <div className="min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{friend.name}</h4>
          <p className="text-sm text-gray-500">
            {isUserOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div
        className="relative flex-shrink-0 p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200 option-container"
        onClick={handleToggleOptions}
      >
        <DotMenuIcon w={20} h={20} />

        <div
          ref={optionsContainer}
          className="absolute top-0 right-full mt-1 mr-2 z-50 hidden"
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1.5 w-36">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBlockUser(friend.id);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <BlockIcon width={18} height={18} className="text-gray-500" />
              <span>Block user</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUnfriendUser(friend.id);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-gray-50 transition-colors duration-200"
            >
              <UnfriendIcon width={18} height={18} className="text-red-600" />
              <span>Unfriend</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Friend;

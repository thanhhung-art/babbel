import { useState } from "react";
import ChatIcon from "../../../assets/icons/ChatIcon";
import ContactIcon from "../../../assets/icons/ContactIcon";
import RoomIcon from "../../../assets/icons/RoomIcon";
import Conversations from "./conversation/Conversations";
import Friends from "./Friends/Friends";
import Room from "./Room";
import FriendRequestIcon from "../../../assets/icons/FriendRequestIcon";
import FriendRequest from "./FriendRequests";
import { useQuery } from "@tanstack/react-query";
import { getFriendRequest } from "../../../utils/contants";
import { getFriendRequestQuery } from "../../../lib/react_query/queries/user/friendRequest";

const Sidebar = () => {
  const [currentTab, setCurrentTab] = useState("chat");

  const friendsRequestQuery = useQuery({
    queryKey: [getFriendRequest],
    queryFn: getFriendRequestQuery,
  });

  const handleChooseTab = (tab: string) => {
    setCurrentTab(tab);
  };

  const navItems = [
    { id: "chat", icon: ChatIcon, label: "Chat" },
    { id: "contact", icon: ContactIcon, label: "Contacts" },
    { id: "friend-request", icon: FriendRequestIcon, label: "Friend Requests" },
    { id: "room", icon: RoomIcon, label: "Rooms" },
  ];

  return (
    <div className="flex h-full flex-col md:flex-row bg-gray-50 z-50">
      {/* Navigation Sidebar */}
      <nav className="bg-slate-600 border-r border-gray-200 w-full md:w-16 order-2 md:order-1 shadow-sm">
        <ul className="flex justify-between md:justify-start md:flex-col h-full py-2 px-1">
          {navItems.map((item) => {
            return (
              <li key={item.id} className="relative ">
                {item.id === "friend-request" &&
                  friendsRequestQuery.data &&
                  friendsRequestQuery.data?.length > 0 && (
                    <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 w-5 h-5 text-white text-xs flex items-center justify-center rounded-full">
                      {friendsRequestQuery.data?.length}
                    </div>
                  )}
                <button
                  onClick={() => handleChooseTab(item.id)}
                  className={`
                  w-full p-3 rounded-lg transition-all duration-200
                  flex items-center justify-center
                  hover:bg-blue-400 hover:text-blue-600
                  ${
                    currentTab === item.id
                      ? "bg-blue-500 text-blue-600"
                      : "text-gray-600"
                  }
                `}
                  title={item.label}
                >
                  <item.icon
                    width={30}
                    height={30}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full order-1 md:order-2 overflow-hidden">
        <div className="flex-1 overflow-y-auto bg-white">
          {currentTab === "chat" && <Conversations />}
          {currentTab === "contact" && <Friends />}
          {currentTab === "friend-request" && <FriendRequest />}
          {currentTab === "room" && <Room />}
        </div>
      </main>
    </div>
  );
};

export default Sidebar;

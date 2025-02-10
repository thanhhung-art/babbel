import { useState } from "react";
import ChatIcon from "../../../assets/icons/ChatIcon";
import ContactIcon from "../../../assets/icons/ContactIcon";
import RoomIcon from "../../../assets/icons/RoomIcon";
import Conversations from "./conversation/Conversations";
import Friends from "./Friends/Friends";
import Room from "./Room";
import FriendRequestIcon from "../../../assets/icons/FriendRequestIcon";
import FriendRequest from "./FriendRequests";
import AppSettings from "../../../components/appSettings/AppSettings";

const Sidebar = () => {
  const [currentTab, setCurrentTab] = useState("chat");

  const handleChooseTab = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <>
      <div className="flex h-full flex-col md:flex-row">
        <div className="bg-slate-500 w-full md:h-full md:w-fit order-2 md:order-1">
          <ul className="text-white flex justify-between md:justify-start md:flex-col h-full">
            <li
              className={`cursor-pointer hover:bg-slate-400 p-3 rounded ${
                currentTab === "chat" && "bg-slate-400"
              }`}
              onClick={() => handleChooseTab("chat")}
            >
              <ChatIcon width={"30px"} height={"30px"} />
            </li>
            <li
              className={`cursor-pointer hover:bg-slate-400 p-3 rounded ${
                currentTab === "contact" && "bg-slate-400"
              }`}
              onClick={() => handleChooseTab("contact")}
            >
              <ContactIcon width={"30px"} height={"30px"} />
            </li>
            <li
              className={`cursor-pointer hover:bg-slate-400 p-3 rounded ${
                currentTab === "friend-request" && "bg-slate-400"
              }`}
              onClick={() => handleChooseTab("friend-request")}
            >
              <FriendRequestIcon width={"30px"} height={"30px"} />
            </li>
            <li
              className={`cursor-pointer hover:bg-slate-400 p-3 rounded ${
                currentTab === "room" && "bg-slate-400"
              }`}
              onClick={() => handleChooseTab("room")}
            >
              <RoomIcon width={30} height={30} />
            </li>
          </ul>
        </div>
        <div className="p-2 bg-white flex-1 relative order-1 md:order-2">
          {currentTab === "chat" && <Conversations />}
          {currentTab === "contact" && <Friends />}
          {currentTab === "friend-request" && <FriendRequest />}
          {currentTab === "room" && <Room />}
        </div>
        <AppSettings />
      </div>
    </>
  );
};

export default Sidebar;

import { useState } from "react";
import ChatIcon from "../../../assets/icons/ChatIcon";
import ContactIcon from "../../../assets/icons/ContactIcon";
import RoomIcon from "../../../assets/icons/RoomIcon";
import SettingIcon from "../../../assets/icons/SettingIcon";
import Conversations from "./conversation/Conversations";
import Friends from "./Friends/Friends";
import Room from "./Room";
import FriendRequestIcon from "../../../assets/icons/FriendRequestIcon";
import FriendRequest from "./FriendRequests";

const Sidebar = () => {
  const [currentTab, setCurrentTab] = useState("chat");

  const handleChooseTab = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <article className="w-1/4 flex">
      <div className="bg-slate-500">
        <ul className="text-white flex flex-col h-full">
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
          <li
            className={`cursor-pointer hover:bg-slate-400 p-3 rounded mt-auto ${
              currentTab === "setting" && "bg-slate-400"
            }`}
            onClick={() => handleChooseTab("setting")}
          >
            <SettingIcon width={"37px"} height={"37px"} fill="#ffffff" />
          </li>
        </ul>
      </div>
      <div className="p-2 w-full relative">
        {currentTab === "chat" && <Conversations />}
        {currentTab === "contact" && <Friends />}
        {currentTab === "friend-request" && <FriendRequest />}
        {currentTab === "room" && <Room />}
        {currentTab === "setting" && <div>Setting</div>}
      </div>
    </article>
  );
};

export default Sidebar;

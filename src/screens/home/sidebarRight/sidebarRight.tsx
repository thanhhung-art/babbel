import { useEffect, useRef, useState } from "react";
import useAppStore from "../../../lib/zustand/store";
import { useQuery } from "@tanstack/react-query";
import { verifyUser } from "../../../lib/react_query/queries";
import UserInfo from "./UserInfo";
import FriendRequest from "./FriendRequest";
import UserFriends from "./UserFriends";
import Room from "./room/Room";
import { user } from "../../../utils/contants";

const SidebarRight = () => {
  const isOpenSidebarRight = useAppStore((state) => state.isOpenSidebarRight);
  const containerRef = useRef<HTMLDivElement>(null);
  const gliderRef = useRef<HTMLLIElement>(null);
  const [listToRender, setListToRender] = useState<
    "friend-request" | "user-friend" | "room"
  >("user-friend");

  const { data } = useQuery({ queryKey: [user], queryFn: verifyUser });

  const handleMoveGlider = (position: string) => {
    if (gliderRef.current) {
      if (position === "left") {
        gliderRef.current.classList.remove("left-[76%]", "left-[38%]");
        gliderRef.current.classList.add("left-0");
        setListToRender("user-friend");
      } else if (position === "right") {
        gliderRef.current.classList.remove("left-0", "left-[38%]");
        gliderRef.current.classList.add("left-[76%]");
        setListToRender("room");
      } else {
        gliderRef.current.classList.remove("left-[76%]", "left-0");
        gliderRef.current.classList.add("left-[38%]");
        setListToRender("friend-request");
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.classList.toggle("translate-x-[600px]");
    }
  }, [isOpenSidebarRight]);

  return (
    <div
      ref={containerRef}
      className="absolute h-full w-[600px] translate-x-[600px] bg-white right-0 transition-all duration-500 ease-in-out shadow-md overflow-hidden z-40"
    >
      <div className="p-4">
        <UserInfo name={data?.name} email={data?.email} />
        <hr className="my-4" />
        <div>
          <ul className="flex justify-between relative">
            <li
              className="py-2 px-4 rounded w-40 cursor-pointer"
              onClick={() => handleMoveGlider("left")}
            >
              <h3 className="text-center">Friends</h3>
            </li>
            <li
              className="py-2 px-4 rounded w-40 cursor-pointer"
              onClick={() => handleMoveGlider("between")}
            >
              <h3 className="text-center relative">
                Friend request{" "}
                {data &&
                  data.FriendRequest &&
                  data.FriendRequest.length > 0 && (
                    <span className="absolute -top-2 bg-red-500 w-4 h-4 text-white rounded-full text-[12px]">
                      {data.FriendRequest.length}
                    </span>
                  )}
              </h3>
            </li>
            <li
              className="py-2 px-4 rounded w-40 cursor-pointer"
              onClick={() => handleMoveGlider("right")}
            >
              <h3 className="text-center">Room</h3>
            </li>
            <li
              ref={gliderRef}
              className="w-40 h-2 rounded bg-blue-500 absolute bottom-0 left-0 transition-all duration-300 ease-in-out"
            ></li>
          </ul>
        </div>
        {listToRender === "friend-request" && (
          <FriendRequest id={data?.id || ""} />
        )}
        {listToRender === "user-friend" && <UserFriends />}
        {listToRender === "room" && <Room />}
      </div>
    </div>
  );
};

export default SidebarRight;

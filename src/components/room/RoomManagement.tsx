import {
  createRef,
  forwardRef,
  lazy,
  Suspense,
  useImperativeHandle,
  useState,
} from "react";
import RoomIcon from "../../assets/icons/RoomIcon";
import NewRequestIcon from "../../assets/icons/NewRequestIcon";
import BlockIcon from "../../assets/icons/BlockIcon";
import SettingIcon from "../../assets/icons/SettingIcon";
import { useQuery } from "@tanstack/react-query";
import {
  getTotalBannedUsersAmountQuery,
  getTotalJoinRequestAmountQuery,
  getTotalMembersAmountQuery,
} from "../../lib/react_query/queries/room/room";
import useAppStore from "../../lib/zustand/store";
import {
  totalBanned,
  totalJoinRequest,
  totalMembers,
} from "../../utils/contants";
const Members = lazy(() => import("./Members"));
const JoinRequests = lazy(() => import("./JoinRequest"));
const BannedUsers = lazy(() => import("./BannedUsers"));
const Setting = lazy(() => import("./SettingRoom"));

interface IProps {
  handleCloseOptions: () => void;
}

interface IRef {
  dialog: HTMLDialogElement | null;
  container: HTMLDivElement | null;
}

const RoomManagement = forwardRef<IRef, IProps>((_props, ref) => {
  const [currOption, setCurrOption] = useState("members");
  const dialogRef = createRef<HTMLDialogElement>();
  const containerRef = createRef<HTMLDivElement>();
  const currentRoomId = useAppStore((state) => state.currentRoomId);

  useImperativeHandle(ref, () => ({
    dialog: dialogRef.current,
    container: containerRef.current,
  }));

  const totalMembersQuery = useQuery({
    queryKey: [totalMembers],
    queryFn: () => getTotalMembersAmountQuery(currentRoomId),
  });

  const totalJoinRequestQuery = useQuery({
    queryKey: [totalJoinRequest],
    queryFn: () => getTotalJoinRequestAmountQuery(currentRoomId),
  });

  const totalBannedUsersQuery = useQuery({
    queryKey: [totalBanned],
    queryFn: () => getTotalBannedUsersAmountQuery(currentRoomId),
  });

  const handleSelectOption = (option: string) => {
    setCurrOption(option);
  };

  return (
    <dialog ref={dialogRef} className="rounded-lg outline-none">
      <div className="p-4 rounded-lg" ref={containerRef}>
        <div className="flex">
          <div>
            <ul className="border-r w-[200px] pr-4 h-full">
              <li
                className="cursor-pointer hover:bg-slate-100 active:bg-slate-200 rounded"
                onClick={() => handleSelectOption("members")}
              >
                <div className="flex gap-2 items-center p-2 rounded">
                  <RoomIcon height={24} width={24} fill="#000000" />
                  <h5 className="relative">
                    Members{" "}
                    <span className="text-sm">
                      {`(${totalMembersQuery.data?.total || 0})`}
                    </span>
                  </h5>
                </div>
              </li>
              <li
                className="cursor-pointer hover:bg-slate-100 active:bg-slate-200 rounded"
                onClick={() => handleSelectOption("join-requests")}
              >
                <div className="flex gap-2 items-center p-2 rounded">
                  <NewRequestIcon height={24} width={24} />
                  <h5>
                    Join Request{" "}
                    <span className="text-sm">{`(${
                      totalJoinRequestQuery.data?.total || 0
                    })`}</span>
                  </h5>
                </div>
              </li>
              <li
                className="cursor-pointer hover:bg-slate-100 active:bg-slate-200 rounded"
                onClick={() => handleSelectOption("banned-users")}
              >
                <div className="flex gap-2 items-center p-2 rounded">
                  <BlockIcon height={24} width={24} />
                  <h5>
                    Banned Users{" "}
                    <span className="text-sm">{`(${
                      totalBannedUsersQuery.data?.total || 0
                    })`}</span>
                  </h5>
                </div>
              </li>
              <li
                className="cursor-pointer hover:bg-slate-100 active:bg-slate-200 rounded"
                onClick={() => handleSelectOption("setting")}
              >
                <div className="flex gap-2 items-center p-2 rounded">
                  <SettingIcon height={24} width={24} fill="#000000" />
                  <h5>Setting</h5>
                </div>
              </li>
            </ul>
          </div>
          <div className="h-[600px] w-[500px]">
            <Suspense>
              {currOption === "members" && <Members />}
              {currOption === "join-requests" && <JoinRequests />}
              {currOption === "banned-users" && <BannedUsers />}
              {currOption === "setting" && <Setting />}
            </Suspense>
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default RoomManagement;

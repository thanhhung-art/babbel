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
import XIcon from "../../assets/icons/XIcon";
const Members = lazy(() => import("./Members"));
const JoinRequests = lazy(() => import("./JoinRequest"));
const BannedUsers = lazy(() => import("./BannedUsers"));
const Setting = lazy(() => import("./SettingRoom"));

interface IProps {
  handleCloseOptions: () => void;
}

interface IRef {
  dialog: HTMLDialogElement | null;
}

const RoomManagement = forwardRef<IRef, IProps>((_props, ref) => {
  const [currOption, setCurrOption] = useState("members");
  const dialogRef = createRef<HTMLDialogElement>();
  const currentRoomId = useAppStore((state) => state.currentRoomId);

  useImperativeHandle(ref, () => ({
    dialog: dialogRef.current,
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

  const handleCloseOptions = () => {
    dialogRef.current?.close();
  };

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg outline-none h-full md:h-auto"
    >
      <div className="p-4 rounded-lg dialog-container h-full border relative">
        <div
          className="absolute top-0 right-0 cursor-pointer bg-red-500 text-white w-5 h-5 flex justify-center items-center text-sm rounded md:hidden"
          onClick={handleCloseOptions}
        >
          <XIcon width={18} height={18} fill="#ffffff" color="#ffffff" />
        </div>
        <div className="flex h-full">
          <div>
            <ul className="border-r md:w-[200px] md:pr-4 h-full">
              <li
                className="cursor-pointer hover:bg-slate-100 active:bg-slate-200 rounded"
                onClick={() => handleSelectOption("members")}
              >
                <div className="flex gap-2 items-center p-2 rounded">
                  <RoomIcon height={24} width={24} fill="#000000" />
                  <h5 className="hidden md:block">Members </h5>
                  <span className="text-sm">
                    {`(${totalMembersQuery.data?.total || 0})`}
                  </span>
                </div>
              </li>
              <li
                className="cursor-pointer hover:bg-slate-100 active:bg-slate-200 rounded"
                onClick={() => handleSelectOption("join-requests")}
              >
                <div className="flex gap-2 items-center p-2 rounded">
                  <NewRequestIcon height={24} width={24} />
                  <h5 className="hidden md:block">Join Request </h5>
                  <span className="text-sm">{`(${
                    totalJoinRequestQuery.data?.total || 0
                  })`}</span>
                </div>
              </li>
              <li
                className="cursor-pointer hover:bg-slate-100 active:bg-slate-200 rounded"
                onClick={() => handleSelectOption("banned-users")}
              >
                <div className="flex gap-2 items-center p-2 rounded">
                  <BlockIcon height={24} width={24} />
                  <h5 className="hidden md:block">Banned Users </h5>
                  <span className="text-sm">{`(${
                    totalBannedUsersQuery.data?.total || 0
                  })`}</span>
                </div>
              </li>
              <li
                className="cursor-pointer hover:bg-slate-100 active:bg-slate-200 rounded"
                onClick={() => handleSelectOption("setting")}
              >
                <div className="flex gap-2 items-center p-2 rounded">
                  <SettingIcon height={24} width={24} fill="#000000" />
                  <h5 className="hidden md:block">Setting</h5>
                </div>
              </li>
            </ul>
          </div>
          <div className="h-[600px] w-[500px]">
            <Suspense>
              {currOption === "members" && <Members />}
              {currOption === "join-requests" && <JoinRequests />}
              {currOption === "banned-users" && <BannedUsers />}
              {currOption === "setting" && <Setting dialog={dialogRef} />}
            </Suspense>
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default RoomManagement;

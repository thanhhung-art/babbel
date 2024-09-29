import { useRef } from "react";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import BlockIcon from "../../assets/icons/BlockIcon";

interface IProps {
  handleBlockUser: () => void;
  handleUnfriendUser: () => void;
}

const Options = ({ handleBlockUser, handleUnfriendUser }: IProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="absolute top-full right-full bg-white p-2 shadow rounded"
    >
      <h3 className="font-bold">Actions</h3>
      <ul className="w-[150px] mt-[7px]">
        <li
          className="text-sm cursor-pointer hover:bg-slate-100 p-[5px] rounded font-normal"
          onClick={handleBlockUser}
        >
          <div className="flex gap-2 items-center">
            <BlockIcon width={24} height={24} /> <p className="pt-1">block</p>
          </div>
        </li>
        <li
          className="cursor-pointer hover:bg-slate-100 p-[5px] rounded text-red-500"
          onClick={handleUnfriendUser}
        >
          <div className="flex gap-2 items-center text-sm">
            <DeleteIcon width={24} height={24} />{" "}
            <p className="pt-1">unfriend</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Options;
